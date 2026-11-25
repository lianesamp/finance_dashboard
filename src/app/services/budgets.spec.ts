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

    it('should flag exactly at 80% as warning', () => {
      // Transport (cat-4): spent 40 in Nov. Update existing budget limit to 50 → 40/50 = 80%
      const existing = service.budgets().find((b) => b.categoryId === 'cat-4')!;
      service.updateBudget({ ...existing, limit: 50 });
      const statuses = service.budgetStatuses();
      const transport = statuses.find((s) => s.budget.categoryId === 'cat-4');
      expect(transport!.percentage).toBeCloseTo(80, 1);
      expect(transport!.warning).toBe(true);
    });

    it('should handle over-budget (> 100%)', () => {
      // Add a budget with limit lower than actual spending
      // Rent (cat-3): spent 950 in Nov. Set limit to 500 → 190%
      service.updateBudget({
        ...service.budgets().find((b) => b.categoryId === 'cat-3')!,
        limit: 500,
      });
      const statuses = service.budgetStatuses();
      const rent = statuses.find((s) => s.budget.categoryId === 'cat-3');
      expect(rent!.percentage).toBeCloseTo(190, 1);
      expect(rent!.warning).toBe(true);
    });

    it('should return 0% when no spending in category', () => {
      // Dining (cat-8): budget 80, spent 45 in Nov
      // Add a budget for a category with no spending this month
      service.addBudget({ categoryId: 'cat-1', month: '2026-11', limit: 500 });
      const statuses = service.budgetStatuses();
      // cat-1 is Salary (income), so no expense spending
      const salary = statuses.find((s) => s.budget.categoryId === 'cat-1');
      expect(salary!.spent).toBe(0);
      expect(salary!.percentage).toBe(0);
      expect(salary!.warning).toBe(false);
    });

    it('should only include budgets for the selected month', () => {
      transactionsService.setSelectedMonth('2026-10');
      const statuses = service.budgetStatuses();
      // Mock budgets are all for 2026-11, so Oct should have none
      expect(statuses.length).toBe(0);
    });

    it('should react to month changes', () => {
      const novStatuses = service.budgetStatuses();
      expect(novStatuses.length).toBeGreaterThan(0);

      transactionsService.setSelectedMonth('2026-10');
      const octStatuses = service.budgetStatuses();
      expect(octStatuses.length).toBe(0);

      // Switch back
      transactionsService.setSelectedMonth('2026-11');
      expect(service.budgetStatuses().length).toBeGreaterThan(0);
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
