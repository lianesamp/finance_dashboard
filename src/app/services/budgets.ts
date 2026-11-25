import { computed, inject, Service, signal } from '@angular/core';
import { Budget } from '../models/budget.model';
import { MOCK_BUDGETS } from '../mock-data/mock-data';
import { TransactionsService } from './transactions';

export interface BudgetStatus {
  budget: Budget;
  spent: number;
  percentage: number;
  warning: boolean;
}

@Service()
export class BudgetsService {
  private readonly transactionsService = inject(TransactionsService);

  private readonly _budgets = signal<Budget[]>(structuredClone(MOCK_BUDGETS));

  readonly budgets = this._budgets.asReadonly();

  // Budget statuses for the currently selected month
  readonly budgetStatuses = computed((): BudgetStatus[] => {
    const month = this.transactionsService.selectedMonth();
    const spending = this.transactionsService.spendingByCategory();
    const monthBudgets = this._budgets().filter((b) => b.month === month);

    return monthBudgets.map((budget) => {
      const spent = spending[budget.categoryId] ?? 0;
      const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
      return {
        budget,
        spent,
        percentage,
        warning: percentage >= 80,
      };
    });
  });

  getBudgetsByMonth(month: string): Budget[] {
    return this._budgets().filter((b) => b.month === month);
  }

  addBudget(budget: Omit<Budget, 'id'>): void {
    const newBudget: Budget = {
      ...budget,
      id: crypto.randomUUID(),
    };
    this._budgets.update((budgets) => [...budgets, newBudget]);
  }

  updateBudget(budget: Budget): void {
    this._budgets.update((budgets) =>
      budgets.map((b) => (b.id === budget.id ? budget : b)),
    );
  }

  deleteBudget(id: string): void {
    this._budgets.update((budgets) => budgets.filter((b) => b.id !== id));
  }
}
