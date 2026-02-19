import { useState } from 'react';
import { useMonthly, useCategorySummary } from '../../hooks/useSummary';
import SummaryCards from './SummaryCards';
import CategoryPieChart from './CategoryPieChart';
import MonthlyBarChart from './MonthlyBarChart';
import { formatMonth } from '../../utils/formatters';

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function getRecentMonths(n: number): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return months;
}

export default function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const { data: monthlyData, loading: monthlyLoading } = useMonthly();
  const { data: categoryData, loading: categoryLoading } = useCategorySummary(selectedMonth);

  const recentMonths = getRecentMonths(8);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-slate-400 text-sm mt-0.5">Spending overview and trends</p>
        </div>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
        >
          {recentMonths.map((m) => (
            <option key={m} value={m}>{formatMonth(m)}</option>
          ))}
        </select>
      </div>

      {monthlyLoading || categoryLoading ? (
        <div className="text-slate-500 animate-pulse">Loading...</div>
      ) : (
        <>
          <SummaryCards
            categorySummary={categoryData}
            monthlyData={monthlyData}
            selectedMonth={selectedMonth}
          />
          <div className="grid grid-cols-2 gap-4">
            <CategoryPieChart data={categoryData} />
            <MonthlyBarChart data={monthlyData} />
          </div>
        </>
      )}
    </div>
  );
}
