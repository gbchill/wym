import type { CategorySummary, MonthlySummary } from '../../types';
import { formatCurrency, formatMonth } from '../../utils/formatters';

interface SummaryCardsProps {
  categorySummary: CategorySummary[];
  monthlyData: MonthlySummary[];
  selectedMonth: string;
}

export default function SummaryCards({ categorySummary, monthlyData, selectedMonth }: SummaryCardsProps) {
  const totalSpend = categorySummary.reduce((sum, c) => sum + c.total, 0);
  const topCategory = categorySummary[0] ?? null;

  // Month-over-month delta: compare selectedMonth vs previous month
  const months = [...new Set(monthlyData.map((d) => d.month))].sort();
  const selectedIdx = months.indexOf(selectedMonth);
  const prevMonth = selectedIdx > 0 ? months[selectedIdx - 1] : null;

  const prevTotal = prevMonth
    ? monthlyData
        .filter((d) => d.month === prevMonth)
        .reduce((sum, d) => sum + d.total, 0)
    : null;

  const delta = prevTotal !== null ? totalSpend - prevTotal : null;
  const deltaPercent = prevTotal && prevTotal > 0 ? ((delta! / prevTotal) * 100).toFixed(1) : null;

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <Card title="Total Spend" subtitle={formatMonth(selectedMonth)}>
        <span className="text-3xl font-bold text-white">{formatCurrency(totalSpend)}</span>
      </Card>

      <Card title="Top Category" subtitle={topCategory ? `${topCategory.count} transactions` : 'No data'}>
        {topCategory ? (
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: topCategory.category_color }}
            />
            <span className="text-xl font-bold text-white">{topCategory.category_name}</span>
            <span className="text-slate-400 text-sm">{formatCurrency(topCategory.total)}</span>
          </div>
        ) : (
          <span className="text-slate-500">—</span>
        )}
      </Card>

      <Card title="vs Last Month" subtitle={prevMonth ? formatMonth(prevMonth) : 'No previous data'}>
        {delta !== null ? (
          <span
            className={`text-3xl font-bold ${
              delta <= 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {delta > 0 ? '+' : ''}{formatCurrency(delta)}
            {deltaPercent && (
              <span className="text-sm ml-1 font-normal">({delta > 0 ? '+' : ''}{deltaPercent}%)</span>
            )}
          </span>
        ) : (
          <span className="text-slate-500 text-xl">—</span>
        )}
      </Card>
    </div>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
      <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{title}</div>
      <div className="text-xs text-slate-500 mb-3">{subtitle}</div>
      {children}
    </div>
  );
}
