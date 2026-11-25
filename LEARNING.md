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

## Step 2: Routing + Shell

- **`loadComponent` (lazy loading)**: Each route loads its component only when navigated to, using a dynamic `import()`. This creates separate JS chunks (visible in the build output). React equivalent: `React.lazy(() => import('./Dashboard'))` with `<Suspense>`. In Vue: `() => import('./Dashboard.vue')` in vue-router.

- **`<router-outlet>`**: A placeholder directive in the template where Angular renders the matched route's component. React equivalent: `<Outlet />` from react-router v6. Vue equivalent: `<router-view />`.

- **`routerLink` directive**: Used in templates to navigate between routes without a full page reload. `[routerLink]="'/dashboard'"` creates an SPA link. React equivalent: `<Link to="/dashboard">`. Vue equivalent: `<router-link to="/dashboard">`.

- **`routerLinkActive` directive**: Adds a CSS class to an element when its `routerLink` matches the current route. `routerLinkActive="active-link"` adds the class `active-link`. React equivalent: `<NavLink className={({isActive}) => ...}>`. Vue equivalent: vue-router adds `.router-link-active` automatically.

- **`pathMatch: 'full'`**: For the redirect route (`''` → `'dashboard'`), this ensures only an exact empty path redirects. Without it, every route would match (since `''` is a prefix of everything).

- **Wildcard route (`**`)**: Catches any URL that doesn't match a defined route. Must be the last route in the array. Same concept in react-router (`path="*"`) and vue-router (`path: '/:pathMatch(.*)*'`).

- **`@for` (built-in control flow)**: Angular 22's template syntax for loops. `@for (item of items; track item.id) { ... }` replaces the old `*ngFor` directive. The `track` expression is required — it tells Angular how to identify each item for efficient DOM updates (like React's `key` prop in `.map()`). Vue equivalent: `v-for` with `:key`.

- **`{{ title() }}`  (interpolation + signal read)**: Double curly braces render an expression in the template. When reading a signal, you call it as a function: `title()`, not `title`. React equivalent: `{title}` in JSX (no function call needed with `useState`).

- **`MatSidenavModule` / `MatToolbarModule`**: Angular Material components imported per-module. Each Material component has its own module you import in the component's `imports` array. React equivalent: importing `<Drawer>` or `<AppBar>` from MUI, but MUI doesn't require module imports — just component imports.

- **Change detection (zoneless + OnPush)**: In Angular 22, there's no zone.js and OnPush is the default. Angular only re-renders a component when: (1) a signal it reads in the template changes, (2) an `input()` changes, or (3) an event handler fires inside it. React equivalent: this is similar to `React.memo` — components only re-render when their props/state change. The key difference: in React you opt-in to skipping renders (`memo`), in Angular 22 it's the default behavior.

- **CSS system variables (`--mat-sys-*`)**: Angular Material 3 exposes design tokens as CSS custom properties. `--mat-sys-primary`, `--mat-sys-surface`, etc. follow Material Design 3's color system. React/MUI equivalent: `theme.palette.primary.main`.
