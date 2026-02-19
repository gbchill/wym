import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { MonthlySummary } from '../../types';
import { formatCurrency, formatMonth } from '../../utils/formatters';

interface MonthlyBarChartProps {
  data: MonthlySummary[];
}

const CATEGORY_ORDER = ['food', 'transport', 'entertainment', 'shopping', 'bills', 'other'];

export default function MonthlyBarChart({ data }: MonthlyBarChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 flex items-center justify-center h-64">
        <p className="text-slate-500">No monthly data available</p>
      </div>
    );
  }

  // Pivot: { month, food, transport, ... }
  const months = [...new Set(data.map((d) => d.month))].sort();
  const categoryMeta = new Map<string, { name: string; color: string }>();

  for (const d of data) {
    if (!categoryMeta.has(d.category)) {
      categoryMeta.set(d.category, { name: d.category_name, color: d.category_color });
    }
  }

  const pivoted = months.map((month) => {
    const row: Record<string, unknown> = { month, label: formatMonth(month) };
    const monthRows = data.filter((d) => d.month === month);
    for (const mr of monthRows) {
      row[mr.category] = mr.total;
    }
    return row;
  });

  const categories = CATEGORY_ORDER.filter((c) => categoryMeta.has(c));

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
      <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
        Monthly Spending Trend
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={pivoted} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="label"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `$${Math.round(v)}`}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#f1f5f9',
            }}
          />
          <Legend
            formatter={(value) => {
              const meta = categoryMeta.get(value);
              return (
                <span style={{ color: '#94a3b8', fontSize: '12px' }}>
                  {meta?.name ?? value}
                </span>
              );
            }}
          />
          {categories.map((cat) => (
            <Bar
              key={cat}
              dataKey={cat}
              stackId="a"
              fill={categoryMeta.get(cat)?.color ?? '#9E9E9E'}
              name={cat}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
