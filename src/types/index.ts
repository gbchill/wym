export type CategoryId = 'food' | 'transport' | 'entertainment' | 'shopping' | 'bills' | 'other';

export interface Category {
  id: CategoryId;
  name: string;
  color: string;
}

export type TransactionSource = 'bofa-checking' | 'bofa-credit' | 'capitalone';

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  merchant: string;
  amount: number;
  category: CategoryId;
  source: TransactionSource;
  raw_description: string;
  created_at: string;
  // joined from categories
  category_name?: string;
  category_color?: string;
}

export interface TransactionFilters {
  month?: string; // YYYY-MM
  category?: CategoryId;
  source?: TransactionSource;
  search?: string;
}

export interface MonthlySummary {
  month: string; // YYYY-MM
  category: CategoryId;
  category_name: string;
  category_color: string;
  total: number;
}

export interface CategorySummary {
  category: CategoryId;
  category_name: string;
  category_color: string;
  total: number;
  count: number;
}

export interface BudgetRecommendation {
  category: CategoryId;
  category_name: string;
  category_color: string;
  median_spend: number;
  recommended_budget: number;
  current_month_spend: number;
}

export interface UploadResult {
  imported: number;
  skipped: number;
  errors: string[];
  total: number;
}
