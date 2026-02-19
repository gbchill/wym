import { Router } from 'express';
import { getDb } from '../db.js';

const router = Router();

// GET /api/summary/monthly — last 6 months, grouped by month + category
router.get('/summary/monthly', (_req, res) => {
  const sql = `
    SELECT
      strftime('%Y-%m', t.date) AS month,
      t.category,
      c.name AS category_name,
      c.color AS category_color,
      ROUND(SUM(t.amount), 2) AS total
    FROM transactions t
    JOIN categories c ON c.id = t.category
    WHERE t.date >= date('now', '-6 months')
    GROUP BY month, t.category
    ORDER BY month ASC, total DESC
  `;

  const rows = getDb().prepare(sql).all();
  res.json(rows);
});

// GET /api/summary/categories — current or specified month, grouped by category
router.get('/summary/categories', (req, res) => {
  const { month } = req.query as { month?: string };

  let dateFilter: string;
  let params: unknown[];

  if (month) {
    dateFilter = "strftime('%Y-%m', t.date) = ?";
    params = [month];
  } else {
    dateFilter = "strftime('%Y-%m', t.date) = strftime('%Y-%m', 'now')";
    params = [];
  }

  const sql = `
    SELECT
      t.category,
      c.name AS category_name,
      c.color AS category_color,
      ROUND(SUM(t.amount), 2) AS total,
      COUNT(*) AS count
    FROM transactions t
    JOIN categories c ON c.id = t.category
    WHERE ${dateFilter}
    GROUP BY t.category
    ORDER BY total DESC
  `;

  const rows = getDb().prepare(sql).all(...params);
  res.json(rows);
});

// GET /api/budget/recommendations
router.get('/budget/recommendations', (req, res) => {
  const { month } = req.query as { month?: string };

  // Trailing 3 complete months per category → compute median
  const historySql = `
    SELECT
      t.category,
      c.name AS category_name,
      c.color AS category_color,
      strftime('%Y-%m', t.date) AS month,
      ROUND(SUM(t.amount), 2) AS monthly_total
    FROM transactions t
    JOIN categories c ON c.id = t.category
    WHERE strftime('%Y-%m', t.date) < strftime('%Y-%m', 'now')
      AND t.date >= date('now', '-4 months')
    GROUP BY t.category, month
    ORDER BY t.category, month
  `;

  const historyRows = getDb().prepare(historySql).all() as Array<{
    category: string;
    category_name: string;
    category_color: string;
    month: string;
    monthly_total: number;
  }>;

  // Group by category
  const byCategory = new Map<string, { name: string; color: string; totals: number[] }>();

  for (const row of historyRows) {
    if (!byCategory.has(row.category)) {
      byCategory.set(row.category, {
        name: row.category_name,
        color: row.category_color,
        totals: [],
      });
    }
    byCategory.get(row.category)!.totals.push(row.monthly_total);
  }

  // Current month spend
  const currentMonth = month || new Date().toISOString().slice(0, 7);
  const currentSql = `
    SELECT
      t.category,
      ROUND(SUM(t.amount), 2) AS current_spend
    FROM transactions t
    WHERE strftime('%Y-%m', t.date) = ?
    GROUP BY t.category
  `;

  const currentRows = getDb().prepare(currentSql).all(currentMonth) as Array<{
    category: string;
    current_spend: number;
  }>;

  const currentByCategory = new Map(currentRows.map((r) => [r.category, r.current_spend]));

  function median(values: number[]): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  const recommendations = [];

  for (const [categoryId, data] of byCategory.entries()) {
    const medianSpend = median(data.totals);
    const recommendedBudget = Math.round(medianSpend * 1.1 * 100) / 100;
    const currentSpend = currentByCategory.get(categoryId) ?? 0;

    recommendations.push({
      category: categoryId,
      category_name: data.name,
      category_color: data.color,
      median_spend: Math.round(medianSpend * 100) / 100,
      recommended_budget: recommendedBudget,
      current_month_spend: currentSpend,
    });
  }

  // Sort by recommended budget descending
  recommendations.sort((a, b) => b.recommended_budget - a.recommended_budget);

  res.json(recommendations);
});

export default router;
