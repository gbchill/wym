import { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import type { BudgetRecommendation } from '../types';

interface UseBudgetResult {
  data: BudgetRecommendation[];
  loading: boolean;
  error: string | null;
}

export function useBudgetRecommendations(): UseBudgetResult {
  const [data, setData] = useState<BudgetRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<BudgetRecommendation[]>('/api/budget/recommendations')
      .then(setData)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
