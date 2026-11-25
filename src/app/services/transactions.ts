import { computed, Service, signal } from '@angular/core';
import { Transaction } from '../models/transaction.model';
import { MOCK_TRANSACTIONS } from '../mock-data/mock-data';

export interface MonthlyTotal {
  month: string;
  income: number;
  expenses: number;
}

@Service()
export class TransactionsService {
  private readonly _transactions = signal<Transaction[]>(structuredClone(MOCK_TRANSACTIONS));

  readonly transactions = this._transactions.asReadonly();

  // Filter state
  private readonly _selectedMonth = signal<string>(
    new Date().toISOString().slice(0, 7),
  );
  private readonly _selectedCategoryId = signal<string | null>(null);
  private readonly _searchText = signal<string>('');
  private readonly _sortBy = signal<'date' | 'amount'>('date');
  private readonly _sortDirection = signal<'asc' | 'desc'>('desc');

  // Public read-only access to filter state
  readonly selectedMonth = this._selectedMonth.asReadonly();
  readonly selectedCategoryId = this._selectedCategoryId.asReadonly();
  readonly searchText = this._searchText.asReadonly();
  readonly sortBy = this._sortBy.asReadonly();
  readonly sortDirection = this._sortDirection.asReadonly();

  // Transactions filtered by month only (used for totals and charts)
  private readonly monthTransactions = computed(() => {
    const month = this._selectedMonth();
    return this._transactions().filter((t) => t.date.startsWith(month));
  });

  // Fully filtered and sorted transactions (used for the list view)
  readonly filteredTransactions = computed(() => {
    let result = this.monthTransactions();

    const categoryId = this._selectedCategoryId();
    if (categoryId) {
      result = result.filter((t) => t.categoryId === categoryId);
    }

    const search = this._searchText().toLowerCase().trim();
    if (search) {
      result = result.filter((t) =>
        t.description.toLowerCase().includes(search),
      );
    }

    const sortBy = this._sortBy();
    const direction = this._sortDirection();
    const multiplier = direction === 'asc' ? 1 : -1;

    return [...result].sort((a, b) => {
      if (sortBy === 'date') {
        return a.date.localeCompare(b.date) * multiplier;
      }
      return (a.amount - b.amount) * multiplier;
    });
  });

  // Computed totals for the selected month
  readonly totalIncome = computed(() =>
    this.monthTransactions()
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0),
  );

  readonly totalExpenses = computed(() =>
    this.monthTransactions()
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0),
  );

  readonly balance = computed(() => this.totalIncome() - this.totalExpenses());

  // Spending grouped by category (expenses only) for the selected month
  readonly spendingByCategory = computed(() => {
    const spending: Record<string, number> = {};
    for (const tx of this.monthTransactions()) {
      if (tx.type === 'expense') {
        spending[tx.categoryId] = (spending[tx.categoryId] ?? 0) + tx.amount;
      }
    }
    return spending;
  });

  // Income vs expenses for the last 6 months (ending at selectedMonth)
  readonly monthlyTotals = computed((): MonthlyTotal[] => {
    const current = this._selectedMonth();
    const [year, month] = current.split('-').map(Number);
    const months: string[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(year, month - 1 - i, 1);
      months.push(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      );
    }

    return months.map((m) => {
      const txs = this._transactions().filter((t) => t.date.startsWith(m));
      return {
        month: m,
        income: txs
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0),
        expenses: txs
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0),
      };
    });
  });

  // Filter setters
  setSelectedMonth(month: string): void {
    this._selectedMonth.set(month);
  }

  setSelectedCategoryId(categoryId: string | null): void {
    this._selectedCategoryId.set(categoryId);
  }

  setSearchText(text: string): void {
    this._searchText.set(text);
  }

  setSortBy(sortBy: 'date' | 'amount'): void {
    this._sortBy.set(sortBy);
  }

  setSortDirection(direction: 'asc' | 'desc'): void {
    this._sortDirection.set(direction);
  }

  // CRUD
  addTransaction(transaction: Omit<Transaction, 'id'>): void {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    this._transactions.update((txs) => [...txs, newTransaction]);
  }

  updateTransaction(transaction: Transaction): void {
    this._transactions.update((txs) =>
      txs.map((t) => (t.id === transaction.id ? transaction : t)),
    );
  }

  deleteTransaction(id: string): void {
    this._transactions.update((txs) => txs.filter((t) => t.id !== id));
  }
}
