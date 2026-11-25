import { Category } from '../models/category.model';
import { Transaction } from '../models/transaction.model';
import { Budget } from '../models/budget.model';

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Salary', icon: 'payments', color: '#4CAF50' },
  { id: 'cat-2', name: 'Groceries', icon: 'shopping_cart', color: '#FF9800' },
  { id: 'cat-3', name: 'Rent', icon: 'home', color: '#F44336' },
  { id: 'cat-4', name: 'Transport', icon: 'directions_bus', color: '#2196F3' },
  { id: 'cat-5', name: 'Entertainment', icon: 'movie', color: '#9C27B0' },
  { id: 'cat-6', name: 'Utilities', icon: 'bolt', color: '#607D8B' },
  { id: 'cat-7', name: 'Freelance', icon: 'laptop', color: '#009688' },
  { id: 'cat-8', name: 'Dining', icon: 'restaurant', color: '#E91E63' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  // November 2026
  { id: 'tx-1', description: 'Monthly salary', amount: 2800, type: 'income', categoryId: 'cat-1', date: '2026-11-01' },
  { id: 'tx-2', description: 'Supermarket weekly shop', amount: 85.50, type: 'expense', categoryId: 'cat-2', date: '2026-11-03' },
  { id: 'tx-3', description: 'Apartment rent', amount: 950, type: 'expense', categoryId: 'cat-3', date: '2026-11-01' },
  { id: 'tx-4', description: 'Metro monthly pass', amount: 40, type: 'expense', categoryId: 'cat-4', date: '2026-11-02' },
  { id: 'tx-5', description: 'Netflix subscription', amount: 15.99, type: 'expense', categoryId: 'cat-5', date: '2026-11-05' },
  { id: 'tx-6', description: 'Electricity bill', amount: 72, type: 'expense', categoryId: 'cat-6', date: '2026-11-10' },
  { id: 'tx-7', description: 'Freelance web project', amount: 600, type: 'income', categoryId: 'cat-7', date: '2026-11-15' },
  { id: 'tx-8', description: 'Restaurant with friends', amount: 45, type: 'expense', categoryId: 'cat-8', date: '2026-11-12' },
  { id: 'tx-9', description: 'Groceries midweek', amount: 32.40, type: 'expense', categoryId: 'cat-2', date: '2026-11-14' },
  { id: 'tx-10', description: 'Cinema tickets', amount: 24, type: 'expense', categoryId: 'cat-5', date: '2026-11-18' },

  // October 2026
  { id: 'tx-11', description: 'Monthly salary', amount: 2800, type: 'income', categoryId: 'cat-1', date: '2026-10-01' },
  { id: 'tx-12', description: 'Supermarket weekly shop', amount: 92, type: 'expense', categoryId: 'cat-2', date: '2026-10-04' },
  { id: 'tx-13', description: 'Apartment rent', amount: 950, type: 'expense', categoryId: 'cat-3', date: '2026-10-01' },
  { id: 'tx-14', description: 'Metro monthly pass', amount: 40, type: 'expense', categoryId: 'cat-4', date: '2026-10-02' },
  { id: 'tx-15', description: 'Spotify subscription', amount: 9.99, type: 'expense', categoryId: 'cat-5', date: '2026-10-05' },
  { id: 'tx-16', description: 'Water bill', amount: 35, type: 'expense', categoryId: 'cat-6', date: '2026-10-08' },
  { id: 'tx-17', description: 'Tapas night', amount: 38, type: 'expense', categoryId: 'cat-8', date: '2026-10-20' },

  // September 2026
  { id: 'tx-18', description: 'Monthly salary', amount: 2800, type: 'income', categoryId: 'cat-1', date: '2026-09-01' },
  { id: 'tx-19', description: 'Groceries', amount: 110, type: 'expense', categoryId: 'cat-2', date: '2026-09-06' },
  { id: 'tx-20', description: 'Apartment rent', amount: 950, type: 'expense', categoryId: 'cat-3', date: '2026-09-01' },
  { id: 'tx-21', description: 'Freelance logo design', amount: 350, type: 'income', categoryId: 'cat-7', date: '2026-09-20' },
  { id: 'tx-22', description: 'Gas bill', amount: 28, type: 'expense', categoryId: 'cat-6', date: '2026-09-15' },
  { id: 'tx-23', description: 'Concert tickets', amount: 55, type: 'expense', categoryId: 'cat-5', date: '2026-09-25' },

  // August 2026
  { id: 'tx-24', description: 'Monthly salary', amount: 2800, type: 'income', categoryId: 'cat-1', date: '2026-08-01' },
  { id: 'tx-25', description: 'Groceries', amount: 98, type: 'expense', categoryId: 'cat-2', date: '2026-08-05' },
  { id: 'tx-26', description: 'Apartment rent', amount: 950, type: 'expense', categoryId: 'cat-3', date: '2026-08-01' },
  { id: 'tx-27', description: 'Summer festival', amount: 80, type: 'expense', categoryId: 'cat-5', date: '2026-08-15' },
  { id: 'tx-28', description: 'Electricity bill', amount: 85, type: 'expense', categoryId: 'cat-6', date: '2026-08-10' },

  // July 2026
  { id: 'tx-29', description: 'Monthly salary', amount: 2800, type: 'income', categoryId: 'cat-1', date: '2026-07-01' },
  { id: 'tx-30', description: 'Groceries', amount: 105, type: 'expense', categoryId: 'cat-2', date: '2026-07-07' },
  { id: 'tx-31', description: 'Apartment rent', amount: 950, type: 'expense', categoryId: 'cat-3', date: '2026-07-01' },
  { id: 'tx-32', description: 'Train to Barcelona', amount: 65, type: 'expense', categoryId: 'cat-4', date: '2026-07-20' },
  { id: 'tx-33', description: 'Freelance API project', amount: 500, type: 'income', categoryId: 'cat-7', date: '2026-07-25' },

  // June 2026
  { id: 'tx-34', description: 'Monthly salary', amount: 2800, type: 'income', categoryId: 'cat-1', date: '2026-06-01' },
  { id: 'tx-35', description: 'Groceries', amount: 88, type: 'expense', categoryId: 'cat-2', date: '2026-06-03' },
  { id: 'tx-36', description: 'Apartment rent', amount: 950, type: 'expense', categoryId: 'cat-3', date: '2026-06-01' },
  { id: 'tx-37', description: 'Electricity bill', amount: 60, type: 'expense', categoryId: 'cat-6', date: '2026-06-12' },
  { id: 'tx-38', description: 'Birthday dinner', amount: 65, type: 'expense', categoryId: 'cat-8', date: '2026-06-18' },
];

export const MOCK_BUDGETS: Budget[] = [
  { id: 'bud-1', categoryId: 'cat-2', month: '2026-11', limit: 150 },
  { id: 'bud-2', categoryId: 'cat-3', month: '2026-11', limit: 1000 },
  { id: 'bud-3', categoryId: 'cat-4', month: '2026-11', limit: 60 },
  { id: 'bud-4', categoryId: 'cat-5', month: '2026-11', limit: 50 },
  { id: 'bud-5', categoryId: 'cat-6', month: '2026-11', limit: 100 },
  { id: 'bud-6', categoryId: 'cat-8', month: '2026-11', limit: 80 },
];
