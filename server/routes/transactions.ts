import { Router } from 'express';
import { getDb } from '../db.js';

const router = Router();

router.get('/transactions', (req, res) => {
  const { month, category, source, search } = req.query as Record<string, string>;

  const conditions: string[] = [];
  const params: unknown[] = [];

  if (month) {
    conditions.push("strftime('%Y-%m', t.date) = ?");
    params.push(month);
  }
  if (category) {
    conditions.push('t.category = ?');
    params.push(category);
  }
  if (source) {
    conditions.push('t.source = ?');
    params.push(source);
  }
  if (search) {
    conditions.push('t.merchant LIKE ?');
    params.push(`%${search}%`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const sql = `
    SELECT
      t.id, t.date, t.merchant, t.amount, t.category, t.source, t.raw_description, t.created_at,
      c.name AS category_name, c.color AS category_color
    FROM transactions t
    JOIN categories c ON c.id = t.category
    ${where}
    ORDER BY t.date DESC
    LIMIT 500
  `;

  const rows = getDb().prepare(sql).all(...params);
  res.json(rows);
});

export default router;
