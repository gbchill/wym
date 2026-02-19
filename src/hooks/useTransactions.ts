import { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import type { Transaction, TransactionFilters } from '../types';

interface UseTransactionsResult {
  data: Transaction[];
  loading: boolean;
  error: string | null;
}

export function useTransactions(filters: TransactionFilters): UseTransactionsResult {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.month) params.set('month', filters.month);
    if (filters.category) params.set('category', filters.category);
    if (filters.source) params.set('source', filters.source);
    if (filters.search) params.set('search', filters.search);

    const url = `/api/transactions${params.toString() ? '?' + params.toString() : ''}`;

    setLoading(true);
    setError(null);

    apiFetch<Transaction[]>(url)
      .then(setData)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filters.month, filters.category, filters.source, filters.search]);

  return { data, loading, error };
}
