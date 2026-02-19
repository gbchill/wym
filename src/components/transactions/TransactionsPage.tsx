import { useState } from 'react';
import type { TransactionFilters } from '../../types';
import { useTransactions } from '../../hooks/useTransactions';
import FilterBar from './FilterBar';
import TransactionTable from './TransactionTable';

export default function TransactionsPage() {
  const [filters, setFilters] = useState<TransactionFilters>({});
  const { data, loading } = useTransactions(filters);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <p className="text-slate-400 text-sm mt-0.5">Browse and filter your spending history</p>
      </div>

      <FilterBar filters={filters} onChange={setFilters} />

      <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-slate-400">
            {loading ? '...' : `${data.length} transaction${data.length !== 1 ? 's' : ''}`}
          </span>
        </div>
        <TransactionTable transactions={data} loading={loading} />
      </div>
    </div>
  );
}
