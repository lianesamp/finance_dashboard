import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'transactions',
    loadComponent: () =>
      import('./pages/transactions/transactions').then((m) => m.Transactions),
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./pages/categories/categories').then((m) => m.Categories),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
