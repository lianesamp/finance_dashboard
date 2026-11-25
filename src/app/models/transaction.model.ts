export interface Transaction {
  id: string;
  description: string;
  amount: number; // always positive; use `type` for income vs expense
  type: 'income' | 'expense';
  categoryId: string;
  date: string; // ISO date string (YYYY-MM-DD)
}
