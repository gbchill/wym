import type { TransactionFilters, CategoryId, TransactionSource } from '../../types';
import { formatMonth } from '../../utils/formatters';

interface FilterBarProps {
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
}

const CATEGORIES: { value: CategoryId; label: string }[] = [
  { value: 'food', label: 'Food & Dining' },
  { value: 'transport', label: 'Transport' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'bills', label: 'Bills & Utilities' },
  { value: 'other', label: 'Other' },
];

const SOURCES: { value: TransactionSource; label: string }[] = [
  { value: 'bofa-checking', label: 'BofA Checking' },
  { value: 'bofa-credit', label: 'BofA Credit' },
  { value: 'capitalone', label: 'Capital One' },
];

function getRecentMonths(n: number): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return months;
}

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const months = getRecentMonths(12);

  return (
    <div className="flex flex-wrap gap-3 mb-5">
      <select
        value={filters.month ?? ''}
        onChange={(e) => onChange({ ...filters, month: e.target.value || undefined })}
        className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
      >
        <option value="">All months</option>
        {months.map((m) => (
          <option key={m} value={m}>{formatMonth(m)}</option>
        ))}
      </select>

      <select
        value={filters.category ?? ''}
        onChange={(e) => onChange({ ...filters, category: (e.target.value as CategoryId) || undefined })}
        className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
      >
        <option value="">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>

      <select
        value={filters.source ?? ''}
        onChange={(e) => onChange({ ...filters, source: (e.target.value as TransactionSource) || undefined })}
        className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
      >
        <option value="">All sources</option>
        {SOURCES.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Search merchant..."
        value={filters.search ?? ''}
        onChange={(e) => onChange({ ...filters, search: e.target.value || undefined })}
        className="bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 flex-1 min-w-48"
      />
    </div>
  );
}
