import { TestBed } from '@angular/core/testing';
import { BudgetsService } from './budgets';
import { TransactionsService } from './transactions';
import { Budget } from '../models/budget.model';

describe('BudgetsService', () => {
  let service: BudgetsService;
  let transactionsService: TransactionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BudgetsService);
    transactionsService = TestBed.inject(TransactionsService);
    transactionsService.setSelectedMonth('2026-11');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load initial mock budgets', () => {
    expect(service.budgets().length).toBeGreaterThan(0);
  });

  describe('budget status', () => {
    it('should compute spending percentage for a budget', () => {
      // Groceries (cat-2): budget 150, spent 117.90 → ~78.6%
      const statuses = service.budgetStatuses();
      const groceries = statuses.find((s) => s.budget.categoryId === 'cat-2');
      expect(groceries).toBeDefined();
      expect(groceries!.spent).toBeCloseTo(117.90, 2);
      expect(groceries!.percentage).toBeCloseTo((117.90 / 150) * 100, 1);
    });

    it('should flag a budget as warning when above 80%', () => {
      // Groceries: 117.90 / 150 = 78.6% → not warning
      // Entertainment (cat-5): budget 50, spent 15.99 + 24 = 39.99 → 79.98% → not warning
      // Rent (cat-3): budget 1000, spent 950 → 95% → warning
      const statuses = service.budgetStatuses();
      const rent = statuses.find((s) => s.budget.categoryId === 'cat-3');
      expect(rent!.warning).toBe(true);
      expect(rent!.percentage).toBeCloseTo(95, 1);
    });

    it('should not flag a budget under 80% as warning', () => {
      const statuses = service.budgetStatuses();
      const groceries = statuses.find((s) => s.budget.categoryId === 'cat-2');
      expect(groceries!.warning).toBe(false);
    });
  });

  describe('CRUD', () => {
    it('should add a budget', () => {
      const before = service.budgets().length;
      const newBudget: Omit<Budget, 'id'> = {
        categoryId: 'cat-7',
        month: '2026-11',
        limit: 200,
      };
      service.addBudget(newBudget);
      expect(service.budgets().length).toBe(before + 1);
    });

    it('should update a budget', () => {
      const first = service.budgets()[0];
      service.updateBudget({ ...first, limit: 999 });
      const updated = service.budgets().find((b) => b.id === first.id);
      expect(updated!.limit).toBe(999);
    });

    it('should delete a budget', () => {
      const first = service.budgets()[0];
      const before = service.budgets().length;
      service.deleteBudget(first.id);
      expect(service.budgets().length).toBe(before - 1);
    });

    it('should get budgets filtered by month', () => {
      const novBudgets = service.getBudgetsByMonth('2026-11');
      expect(novBudgets.length).toBeGreaterThan(0);
      expect(novBudgets.every((b) => b.month === '2026-11')).toBe(true);

      const janBudgets = service.getBudgetsByMonth('2020-01');
      expect(janBudgets.length).toBe(0);
    });
  });
});
