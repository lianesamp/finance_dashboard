import { TestBed } from '@angular/core/testing';
import { TransactionsService } from './transactions';
import { Transaction } from '../models/transaction.model';

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load initial mock transactions', () => {
    expect(service.transactions().length).toBeGreaterThan(0);
  });

  describe('totals', () => {
    it('should compute total income for a given month', () => {
      // November 2026 has: salary 2800 + freelance 600 = 3400
      service.setSelectedMonth('2026-11');
      expect(service.totalIncome()).toBe(3400);
    });

    it('should compute total expenses for a given month', () => {
      // November 2026 expenses: 85.50 + 950 + 40 + 15.99 + 72 + 45 + 32.40 + 24 = 1264.89
      service.setSelectedMonth('2026-11');
      expect(service.totalExpenses()).toBeCloseTo(1264.89, 2);
    });

    it('should compute balance (income - expenses) for a given month', () => {
      service.setSelectedMonth('2026-11');
      expect(service.balance()).toBeCloseTo(3400 - 1264.89, 2);
    });

    it('should return zero totals for a month with no transactions', () => {
      service.setSelectedMonth('2020-01');
      expect(service.totalIncome()).toBe(0);
      expect(service.totalExpenses()).toBe(0);
      expect(service.balance()).toBe(0);
    });
  });

  describe('filters', () => {
    it('should filter transactions by selected month', () => {
      service.setSelectedMonth('2026-10');
      const filtered = service.filteredTransactions();
      expect(filtered.every((t) => t.date.startsWith('2026-10'))).toBe(true);
    });

    it('should filter transactions by category', () => {
      service.setSelectedMonth('2026-11');
      service.setSelectedCategoryId('cat-2'); // Groceries
      const filtered = service.filteredTransactions();
      expect(filtered.every((t) => t.categoryId === 'cat-2')).toBe(true);
      expect(filtered.length).toBe(2); // 2 grocery transactions in Nov
    });

    it('should filter transactions by search text (case-insensitive)', () => {
      service.setSelectedMonth('2026-11');
      service.setSearchText('metro');
      const filtered = service.filteredTransactions();
      expect(filtered.length).toBe(1);
      expect(filtered[0].description.toLowerCase()).toContain('metro');
    });

    it('should combine month + category + search filters', () => {
      service.setSelectedMonth('2026-11');
      service.setSelectedCategoryId('cat-2');
      service.setSearchText('midweek');
      const filtered = service.filteredTransactions();
      expect(filtered.length).toBe(1);
      expect(filtered[0].description).toContain('midweek');
    });

    it('should show all categories when no category filter is set', () => {
      service.setSelectedMonth('2026-11');
      service.setSelectedCategoryId(null);
      const filtered = service.filteredTransactions();
      const categoryIds = new Set(filtered.map((t) => t.categoryId));
      expect(categoryIds.size).toBeGreaterThan(1);
    });
  });

  describe('sorting', () => {
    it('should sort by date descending by default', () => {
      service.setSelectedMonth('2026-11');
      const filtered = service.filteredTransactions();
      for (let i = 1; i < filtered.length; i++) {
        expect(filtered[i - 1].date >= filtered[i].date).toBe(true);
      }
    });

    it('should sort by amount ascending', () => {
      service.setSelectedMonth('2026-11');
      service.setSortBy('amount');
      service.setSortDirection('asc');
      const filtered = service.filteredTransactions();
      for (let i = 1; i < filtered.length; i++) {
        expect(filtered[i - 1].amount <= filtered[i].amount).toBe(true);
      }
    });
  });

  describe('CRUD', () => {
    it('should add a transaction', () => {
      const before = service.transactions().length;
      const newTx: Omit<Transaction, 'id'> = {
        description: 'Test transaction',
        amount: 100,
        type: 'expense',
        categoryId: 'cat-1',
        date: '2026-11-20',
      };
      service.addTransaction(newTx);
      expect(service.transactions().length).toBe(before + 1);
    });

    it('should update a transaction', () => {
      const first = service.transactions()[0];
      service.updateTransaction({ ...first, description: 'Updated' });
      const updated = service.transactions().find((t) => t.id === first.id);
      expect(updated!.description).toBe('Updated');
    });

    it('should delete a transaction', () => {
      const first = service.transactions()[0];
      const before = service.transactions().length;
      service.deleteTransaction(first.id);
      expect(service.transactions().length).toBe(before - 1);
    });
  });

  describe('spending by category', () => {
    it('should return spending grouped by categoryId for the selected month', () => {
      service.setSelectedMonth('2026-11');
      const spending = service.spendingByCategory();
      // cat-2 (Groceries): 85.50 + 32.40 = 117.90
      expect(spending['cat-2']).toBeCloseTo(117.90, 2);
      // cat-3 (Rent): 950
      expect(spending['cat-3']).toBe(950);
      // Income categories should not appear
      expect(spending['cat-1']).toBeUndefined();
      expect(spending['cat-7']).toBeUndefined();
    });
  });

  describe('monthly totals for chart (last 6 months)', () => {
    it('should return income and expense totals for the last 6 months', () => {
      service.setSelectedMonth('2026-11');
      const monthly = service.monthlyTotals();
      expect(monthly.length).toBe(6);
      // Most recent should be November
      expect(monthly[5].month).toBe('2026-11');
      expect(monthly[5].income).toBe(3400);
      expect(monthly[5].expenses).toBeCloseTo(1264.89, 2);
      // First should be June
      expect(monthly[0].month).toBe('2026-06');
    });
  });
});
