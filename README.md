# Finance Dashboard

A personal finance tracking application built with **Angular 22**, showcasing modern Angular patterns: Signals, standalone components, zoneless change detection, Reactive Forms, and Angular Material 3.

## Features

- **Dashboard** — Monthly balance overview with income/expense bar chart and spending-by-category doughnut chart
- **Transactions** — Full CRUD with filters (month, category, search), sorting (date/amount), and debounced search
- **Categories** — Manage spending categories with icons and colors; live preview in the dialog
- **Budgets** — Set monthly limits per category with progress bars, 80% warnings, and over-budget alerts

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Angular 22 (standalone, zoneless) |
| UI | Angular Material 3 (Material Design tokens) |
| State | Signals (`signal`, `computed`, `toSignal`) |
| Forms | Typed Reactive Forms with custom validators |
| Charts | ng2-charts 11 + Chart.js 4 |
| Routing | Lazy-loaded routes with `loadComponent` |
| Tests | Vitest 5 (58 unit tests) |
| Language | TypeScript 6, strict mode |

## Architecture

```
src/app/
├── components/      # Presentational (dumb) components — input()/output() only
├── models/          # TypeScript interfaces (Transaction, Category, Budget)
├── mock-data/       # Seed data (swappable for a real API)
├── pages/           # Smart components — inject services, wire dialogs
└── services/        # Business logic with Signals (CategoriesService, TransactionsService, BudgetsService)
```

**Smart vs Presentational**: Pages inject services and manage dialogs. Components receive data via `input.required()` and emit events via `output()`. Business logic lives in services, not components.

## Getting Started

### Prerequisites

- Node.js ^22.22.3, ^24.15.0, or >=26.0.0
- Angular CLI 22 (`npm install -g @angular/cli@22`)

### Install & Run

```bash
npm install
ng serve
```

Open [http://localhost:4200](http://localhost:4200).

### Run Tests

```bash
ng test              # Watch mode
ng test --watch=false # Single run (CI)
```

### Build for Production

```bash
ng build
```

Output: `dist/finance_dashboard/browser/`

## Deployment

SPA rewrite configs are included for:

- **Vercel** — `vercel.json`
- **Netlify** — `netlify.toml`
- **Apache** — `.htaccess` (copied to dist via angular.json assets)

All configs redirect unknown routes to `index.html` so client-side routing works on refresh.

## Learning

See [LEARNING.md](LEARNING.md) for a glossary of Angular concepts with React/Vue/Laravel comparisons, organized by implementation step.

## License

MIT
