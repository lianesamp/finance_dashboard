# Learning Glossary — Angular (coming from React)

## Step 1: Scaffold

- **Angular CLI (`ng`)**: Command-line tool that scaffolds, generates, builds, and tests Angular projects. React equivalent: `create-react-app` or `vite create`. Unlike CRA, the Angular CLI stays with you for the entire project lifecycle (generating components, running tests, building).

- **`angular.json`**: Project configuration file that defines build targets, file paths, budgets, and other settings. React equivalent: `vite.config.ts` or webpack config. Angular centralizes all this in one place.

- **`app.config.ts` (ApplicationConfig)**: The root configuration that registers app-wide providers (router, HTTP, animations). Replaces the old `AppModule`. React equivalent: wrapping `<App>` with context providers (`<BrowserRouter>`, `<QueryClientProvider>`, etc.), but as a flat array instead of nested JSX.

- **Standalone components**: Components that declare their own dependencies in an `imports` array instead of belonging to an NgModule. This is the default in Angular 22. React equivalent: React components are always standalone by nature — they import what they need.

- **Zoneless**: Angular 22 runs without `zone.js` by default. Previously, Angular used zone.js to monkey-patch every async API (setTimeout, fetch, etc.) to know when to check for changes. Now Signals drive change detection directly. React equivalent: React never had zones — it uses `setState`/`useState` to trigger re-renders.

- **Signals (`signal()`)**: A reactive primitive that holds a value and notifies Angular when it changes. React equivalent: `useState()`. Key difference: you read a signal by calling it like a function (`mySignal()`), and set it with `.set()` or `.update()`.

- **`provideRouter(routes)`**: Registers the Angular Router at the app level. React equivalent: `<BrowserRouter>` from react-router-dom.

- **`provideHttpClient()`**: Registers Angular's `HttpClient` service for making HTTP requests. React equivalent: there's no built-in — you use `fetch`, `axios`, or React Query.

- **`provideAnimationsAsync()`**: Enables Angular Material animations using lazy-loaded animation code. Required by Material components. React equivalent: no built-in — you'd use Framer Motion or CSS transitions.

- **`provideBrowserGlobalErrorListeners()`**: New in Angular 22. Registers global `error` and `unhandledrejection` listeners so uncaught errors go through Angular's error handler. React equivalent: `ErrorBoundary` only catches render errors; there's no built-in global JS error handler.

- **Vitest**: The test runner Angular 22 scaffolds by default (replacing Karma). If you've used Vitest with Vue/Vite, it's the same tool. React equivalent: Jest (or Vitest if using Vite).

- **Strict mode (`--strict`)**: Enables stricter TypeScript and Angular compiler checks (`noImplicitReturns`, `noFallthroughCasesInSwitch`, `strictInputAccessModifiers`, etc.). React equivalent: `"strict": true` in tsconfig.json.

- **Smart vs presentational components**: Smart components (pages) manage state and talk to services. Presentational (dumb) components receive data via `input()` and emit events via `output()`. React equivalent: container components vs presentational components (same pattern), using props and callbacks.
