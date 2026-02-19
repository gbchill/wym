import { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import type { MonthlySummary, CategorySummary } from '../types';

export function useMonthly() {
  const [data, setData] = useState<MonthlySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<MonthlySummary[]>('/api/summary/monthly')
      .then(setData)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useCategorySummary(month?: string) {
  const [data, setData] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = month
      ? `/api/summary/categories?month=${month}`
      : '/api/summary/categories';

    setLoading(true);
    setError(null);

    apiFetch<CategorySummary[]>(url)
      .then(setData)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [month]);

  return { data, loading, error };
}
