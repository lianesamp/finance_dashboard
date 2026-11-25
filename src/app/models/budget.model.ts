export interface Budget {
  id: string;
  categoryId: string;
  month: string; // format: YYYY-MM
  limit: number; // max EUR for this category in this month
}
