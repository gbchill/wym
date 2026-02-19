import type { Transaction } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

const SOURCE_LABELS: Record<string, string> = {
  'bofa-checking': 'BofA Checking',
  'bofa-credit': 'BofA Credit',
  'capitalone': 'Capital One',
};

interface TransactionTableProps {
  transactions: Transaction[];
  loading: boolean;
}

export default function TransactionTable({ transactions, loading }: TransactionTableProps) {
  if (loading) {
    return <div className="text-slate-500 animate-pulse py-8 text-center">Loading transactions...</div>;
  }

  if (transactions.length === 0) {
    return <div className="text-slate-500 py-8 text-center">No transactions found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700 text-left">
            <th className="pb-3 text-slate-400 font-medium">Date</th>
            <th className="pb-3 text-slate-400 font-medium">Merchant</th>
            <th className="pb-3 text-slate-400 font-medium">Category</th>
            <th className="pb-3 text-slate-400 font-medium text-right">Amount</th>
            <th className="pb-3 text-slate-400 font-medium">Source</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {transactions.map((t) => (
            <tr key={t.id} className="hover:bg-slate-800/50 transition-colors">
              <td className="py-3 text-slate-400 whitespace-nowrap">{formatDate(t.date)}</td>
              <td className="py-3 text-slate-100 max-w-xs truncate">{t.merchant}</td>
              <td className="py-3">
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: t.category_color + '33', color: t.category_color }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full mr-1.5"
                    style={{ backgroundColor: t.category_color }}
                  />
                  {t.category_name}
                </span>
              </td>
              <td className="py-3 text-right font-mono text-slate-100">
                {formatCurrency(t.amount)}
              </td>
              <td className="py-3 text-slate-500 text-xs">
                {SOURCE_LABELS[t.source] ?? t.source}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {transactions.length === 500 && (
        <p className="text-slate-500 text-xs text-center mt-4">Showing first 500 results. Use filters to narrow down.</p>
      )}
    </div>
  );
}
