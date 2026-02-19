import type { BudgetRecommendation } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface BudgetCardProps {
  rec: BudgetRecommendation;
}

export default function BudgetCard({ rec }: BudgetCardProps) {
  const pct = rec.recommended_budget > 0
    ? (rec.current_month_spend / rec.recommended_budget) * 100
    : 0;

  const barColor =
    pct > 100 ? '#F44336' : pct > 80 ? '#FF9800' : '#4CAF50';

  const clampedPct = Math.min(pct, 100);

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <span
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: rec.category_color }}
        />
        <h3 className="font-semibold text-white">{rec.category_name}</h3>
        {pct > 100 && (
          <span className="ml-auto text-xs font-medium text-red-400 bg-red-900/30 px-2 py-0.5 rounded-full">
            Over budget
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4 text-center">
        <div>
          <div className="text-lg font-bold text-white">{formatCurrency(rec.median_spend)}</div>
          <div className="text-xs text-slate-500 mt-0.5">3-mo median</div>
        </div>
        <div>
          <div className="text-lg font-bold text-indigo-400">{formatCurrency(rec.recommended_budget)}</div>
          <div className="text-xs text-slate-500 mt-0.5">Recommended</div>
        </div>
        <div>
          <div
            className="text-lg font-bold"
            style={{ color: pct > 100 ? '#F44336' : pct > 80 ? '#FF9800' : '#4CAF50' }}
          >
            {formatCurrency(rec.current_month_spend)}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">This month</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${clampedPct}%`, backgroundColor: barColor }}
        />
      </div>
      <div className="flex justify-between text-xs text-slate-500 mt-1">
        <span>$0</span>
        <span>{pct.toFixed(0)}% of budget</span>
        <span>{formatCurrency(rec.recommended_budget)}</span>
      </div>
    </div>
  );
}
