import { useBudgetRecommendations } from '../../hooks/useBudget';
import BudgetCard from './BudgetCard';

export default function BudgetPage() {
  const { data, loading, error } = useBudgetRecommendations();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Budget Recommendations</h2>
        <p className="text-slate-400 text-sm mt-0.5">
          Based on your 3-month spending history. Recommended budget = median × 1.1.
        </p>
      </div>

      {loading && (
        <div className="text-slate-500 animate-pulse">Calculating recommendations...</div>
      )}

      {error && (
        <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
          {error}
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="p-8 bg-slate-800 rounded-xl border border-slate-700 text-center text-slate-400">
          <p className="text-lg mb-2">No data yet</p>
          <p className="text-sm">Upload at least one month of transactions to see budget recommendations.</p>
        </div>
      )}

      {!loading && data.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {data.map((rec) => (
            <BudgetCard key={rec.category} rec={rec} />
          ))}
        </div>
      )}
    </div>
  );
}
