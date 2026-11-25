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

## Step 3: Services + Signals + Unit Tests

- **`@Service()` decorator**: New in Angular 22, replaces `@Injectable({ providedIn: 'root' })`. It automatically registers the service as a singleton at the root level (available everywhere). React equivalent: there's no decorator — you'd create a context + provider, or use a state management library (Zustand, Redux). Laravel equivalent: services bound in a ServiceProvider.

- **Dependency Injection (DI) + `inject()`**: Angular's DI system creates and provides instances of services automatically. `inject(TransactionsService)` in BudgetsService tells Angular: "give me the existing TransactionsService instance." You don't create instances yourself (`new TransactionsService()`) — Angular manages their lifecycle. React equivalent: `useContext()` to access shared state, but Angular DI is much more powerful — it supports hierarchical injectors, scoped providers, and constructor-level injection. Laravel equivalent: `app()->make(Service::class)` or type-hinting in controller constructors.

- **`signal()` for mutable state**: `signal<Transaction[]>(initialData)` creates a reactive container. Read with `mySignal()`, write with `.set(newValue)` or `.update(fn)`. React equivalent: `const [state, setState] = useState(initialData)`. Key difference: signals are not bound to components — services can own them, and any component reading them in its template will auto-update.

- **`.asReadonly()`**: Exposes a signal that can be read but not written to. The service owns the writable signal (`_transactions`), but consumers only get the read-only version (`transactions`). React equivalent: exporting only the state value from a custom hook, not the setter. This enforces that only the service can modify its own data.

- **`computed()`**: Creates a derived signal that recalculates when its dependencies change. `totalIncome = computed(() => ...)` automatically updates when `monthTransactions()` changes. React equivalent: `useMemo(() => ..., [deps])`. Key difference: `computed()` auto-tracks dependencies (no dependency array needed), while `useMemo` requires you to list them manually.

- **`structuredClone()`**: A native JS function that deep-copies an object. We use it to clone mock data so each test/service gets its own copy. Not Angular-specific — works in any modern JS. React equivalent: same function, or spread/`JSON.parse(JSON.stringify(...))`.

- **`crypto.randomUUID()`**: Native browser API that generates a UUID v4 string. Used for generating unique IDs for new transactions/categories/budgets. Not Angular-specific — works in any modern browser.

- **`TestBed` (testing)**: Angular's testing utility that creates a mini Angular environment for tests. `TestBed.configureTestingModule({})` sets up providers, then `TestBed.inject(Service)` gets an instance. React equivalent: there's no built-in — you'd just call `renderHook(() => useMyHook())` with Testing Library. The key idea: Angular services live inside the DI system, so you need TestBed to create them in tests.

- **Test-first approach**: We wrote the tests before implementing the services. Each test describes the expected behavior: "totalIncome for November should be 3400", "filtering by category should show only matching transactions." Then we implemented the services to make all tests pass. This is a form of TDD (Test-Driven Development).

## Step 4: Transactions Page (Smart + Presentational)

- **`input()` and `input.required()`**: Angular's signal-based way to receive data from a parent component. `transactions = input.required<Transaction[]>()` declares a required input. The parent passes it via `[transactions]="data"` in the template. React equivalent: props (`function MyComponent({ transactions }: Props)`). Vue equivalent: `defineProps<{ transactions: Transaction[] }>()`. Key difference: `input()` returns a signal, so you read it with `transactions()`.

- **`output()`**: Angular's way to emit events from a child to its parent. `edit = output<Transaction>()` declares an output; the child calls `this.edit.emit(transaction)` and the parent listens with `(edit)="onEdit($event)"`. React equivalent: callback props (`onEdit: (tx: Transaction) => void`). Vue equivalent: `defineEmits(['edit'])`. The `$event` variable contains the emitted value.

- **Smart vs presentational in action**: `Transactions` (page) is smart — it injects services, manages filters, and handles events. `TransactionList` is dumb — it only receives `input()` data and emits `output()` events. It doesn't know about services or where data comes from. This makes `TransactionList` reusable and easy to test in isolation.

- **RxJS `Subject` + `debounceTime()`**: A `Subject` is like an event emitter you can push values into (`subject.next(value)`) and subscribe to. `debounceTime(300)` waits 300ms after the last emission before passing the value through — prevents firing a search on every keystroke. React equivalent: you'd write a custom `useDebounce` hook with `useEffect` + `setTimeout`. RxJS makes this declarative with pipe operators.

- **`distinctUntilChanged()`**: An RxJS operator that only emits when the value changes. If the user types "abc", deletes "c", then types "c" again (back to "abc"), it won't re-emit. React equivalent: comparing `prevValue !== newValue` in your debounce hook.

- **`takeUntilDestroyed()`**: An Angular RxJS helper that automatically unsubscribes from an Observable when the component is destroyed. Without this, you'd have a memory leak — the subscription would keep running after navigating away. React equivalent: returning a cleanup function from `useEffect`. Vue equivalent: `onUnmounted(() => subscription.unsubscribe())`.

- **`DestroyRef`**: Angular's way to hook into a component's destruction lifecycle. `inject(DestroyRef)` gives you a reference that `takeUntilDestroyed()` uses internally. React equivalent: the cleanup function returned by `useEffect`.

- **`mat-table`**: Angular Material's data table component. You define columns with `<ng-container matColumnDef="name">` and rows with `*matHeaderRowDef` / `*matRowDef`. React/MUI equivalent: `<Table>` / `<TableHead>` / `<TableBody>`. Note: `mat-table` still uses the older `*matCellDef="let tx"` syntax (structural directives), not the new `@for` control flow — this is by design from Angular Material.

- **`[property]="expression"` (property binding)**: Square brackets bind a component property to an expression. `[dataSource]="transactions()"` passes the signal's value to the table. React equivalent: `dataSource={transactions}` in JSX. Vue equivalent: `:data-source="transactions"`.

- **`(event)="handler($event)"` (event binding)**: Parentheses listen for DOM or component events. `(click)="onAdd()"` listens for clicks, `(selectionChange)="onMonthChange($event.value)"` listens for Material select changes. React equivalent: `onClick={() => onAdd()}`. Vue equivalent: `@click="onAdd"`.

- **`$any()` type assertion in templates**: `$any($event.target).value` casts the event target to bypass strict template type checking. It's the template equivalent of `(event.target as HTMLInputElement).value`. Use sparingly — it's a workaround for cases where Angular's template type checker can't infer the type.

- **`CurrencyPipe` and `DatePipe`**: Angular's built-in pipes for formatting values in templates. `{{ tx.amount | currency: 'EUR' }}` renders "€1,234.56". `{{ tx.date | date: 'mediumDate' }}` renders "Nov 3, 2026". React equivalent: `Intl.NumberFormat` / `Intl.DateTimeFormat` or libraries like `date-fns`. Pipes are Angular's way to transform display values directly in templates.

## Step 5: Transaction Dialog (Reactive Forms + Validation)

- **Reactive Forms (`FormGroup` / `FormControl`)**: Angular's programmatic form model. You define form structure in TypeScript, not in the template. `new FormGroup({ description: new FormControl('') })` creates a form with one field. React equivalent: `react-hook-form`'s `useForm()` or Formik's `useFormik()`. Vue equivalent: VeeValidate. Key advantage: the form is fully typed and testable without rendering any DOM.

- **`Validators`**: Built-in validation functions. `Validators.required`, `Validators.min(0.01)`, etc. You pass them as the second argument to `FormControl`. React equivalent: Zod/Yup schemas with react-hook-form. The CLAUDE.md says "validate with Zod or framework equivalent" — Reactive Forms + Validators is Angular's idiomatic way.

- **Custom validator (`notFutureDate`)**: A function that receives an `AbstractControl` and returns `ValidationErrors | null`. Returns `{ futureDate: true }` if the date is in the future, `null` if valid. This pattern is composable — you can stack multiple validators on one control.

- **`nonNullable: true`**: Makes a FormControl non-nullable — its value is always the initial type, never `null`. Without it, `FormControl<string>` has type `string | null`. With it, the type is just `string`. This avoids null checks when reading form values.

- **`form.getRawValue()`**: Returns all form values including disabled controls. Preferred over `form.value` because `form.value` skips disabled controls. The return type is fully typed based on your FormGroup definition.

- **`form.markAllAsTouched()`**: Marks every control as "touched", which triggers validation error display. Useful when the user clicks "Save" without interacting with any field — all errors show at once. React equivalent: `formState.touchedFields` / `trigger()` in react-hook-form.

- **`MatDialog` / `MatDialogRef`**: Angular Material's dialog service. `dialog.open(TransactionDialog, { data })` opens a dialog and returns a `MatDialogRef`. `dialogRef.afterClosed()` returns an Observable that emits the result when the dialog closes. React equivalent: MUI's `<Dialog>` component with `open`/`onClose` props, but Angular's approach is imperative (service-based) rather than declarative (JSX-based).

- **`MAT_DIALOG_DATA`**: An injection token that provides data to the dialog component. The parent passes `{ data: { categories, transaction } }`, and the dialog injects it with `inject(MAT_DIALOG_DATA)`. React equivalent: passing props to a dialog component.

- **Component testing (dialog)**: Testing a dialog component requires providing `MAT_DIALOG_DATA` and `MatDialogRef` as mock providers in `TestBed`. We test: form initial state, edit mode population, each validation rule, error messages in the DOM, and the submit button disabled state. This is an integration test — it renders actual DOM and checks Material error elements.

## Step 6: Categories Page

- **`@empty` block**: Used with `@for` to show fallback content when the array is empty. `@for (cat of categories(); track cat.id) { ... } @empty { <p>No categories</p> }`. React equivalent: `{items.length === 0 ? <Empty /> : items.map(...)}`. Vue equivalent: `v-if="items.length === 0"` on a separate element. The `@empty` block is cleaner — it's declarative and colocated with the loop.

- **`MatCardModule`**: Angular Material's card component for content containers. Used here to display each category as a card in a CSS Grid layout. React equivalent: MUI's `<Card>` component.

- **Reusing patterns**: The CategoryDialog follows the exact same pattern as TransactionDialog — `MAT_DIALOG_DATA` for input, `MatDialogRef.close(result)` for output, `FormGroup` for form state. The CategoriesPage follows the same pattern as TransactionsPage — smart component that opens dialogs, dumb list that emits events. Recognizing and applying patterns is a key skill in Angular development.

## Step 7: Dashboard Page with Charts

- **ng2-charts / Chart.js**: ng2-charts is a thin Angular wrapper around Chart.js. Chart.js is the actual charting engine (renders to `<canvas>`). ng2-charts provides the `BaseChartDirective` so you can use `<canvas baseChart>` in Angular templates. React equivalent: `react-chartjs-2` (same idea — a React wrapper for Chart.js). Vue equivalent: `vue-chartjs`.

- **`provideCharts(withDefaultRegisterables())`**: Registered in `app.config.ts`. This tells Chart.js to register all its built-in chart types (bar, line, doughnut, etc.), scales, and plugins. Without this, Chart.js wouldn't know how to draw anything. React equivalent: calling `Chart.register(...)` at the top of your app.

- **`BaseChartDirective`**: The ng2-charts directive you add to a `<canvas>`. You bind `type`, `[data]`, and `[options]` as properties. `type="doughnut"` or `type="bar"` selects the chart type. React equivalent: `<Doughnut data={...} options={...} />` from react-chartjs-2.

- **`ChartData<'doughnut'>` and `ChartOptions<'doughnut'>`**: TypeScript types from Chart.js that ensure your data/options match the chart type. The generic parameter (`'doughnut'`, `'bar'`) constrains the allowed dataset properties. This gives you autocompletion and compile-time checks. React equivalent: same types — Chart.js types are framework-agnostic.

- **`computed()` for chart data**: We use `computed()` to derive `chartData` from service signals (`spendingByCategory`, `categoryMap`). Whenever the service data changes (e.g., user switches month), the chart data recomputes and the chart re-renders. This is reactive by default — no manual subscription needed. React equivalent: `useMemo()` with the data as a dependency.

- **Chart.js `callback` option**: In the bar chart, `ticks.callback: (value) => \`€${value}\`` formats Y-axis labels with the Euro sign. Chart.js options are deeply customizable — colors, legends, scales, tooltips, animations. The options object is plain JS/TS, same across all frameworks.

## Step 8: Budgets with Progress Bars and Warnings

- **`MatProgressBarModule`**: Angular Material's progress bar component. `<mat-progress-bar [value]="75" [color]="'warn'">` renders a horizontal bar filled to 75%. The `color` property accepts `'primary'`, `'accent'`, or `'warn'`. React equivalent: MUI's `<LinearProgress variant="determinate" value={75} />`.

- **Reactive budget statuses**: The `BudgetsService.budgetStatuses` signal is a `computed()` that derives from both `budgets` and `transactionsService.spendingByCategory()`. When you add a transaction or change the month, the budget percentages and warning flags update automatically through the signal dependency chain: transactions → spendingByCategory → budgetStatuses → template. No manual refresh needed. This is the power of signals — derived state stays in sync.

- **`MatDividerModule`**: A simple horizontal line to visually separate sections. `<mat-divider />` renders a `<hr>`-like element styled to match Material Design. Used here to separate Categories from Budgets on the same page.

- **`DecimalPipe`**: Angular's built-in pipe for number formatting. `{{ percentage | number: '1.0-0' }}` formats a number with at least 1 integer digit and 0 decimal places (e.g., 78.6 → "79"). React equivalent: `Math.round(percentage)` or `Intl.NumberFormat`.

## Step 9: Filling Test Gaps

- **Edge-case testing for computed signals**: Since Angular signals derive state reactively, edge-case tests verify the *boundaries* of that reactivity. For example: does `budgetStatuses` flag `warning: true` at exactly 80%? Does `spendingByCategory` update when a transaction is deleted? These tests confirm the signal dependency chain works correctly at boundary conditions — something easily missed with happy-path tests only.

- **CRUD reactivity tests**: Unlike React (where you'd test that `setState` triggers a re-render), Angular signal tests verify that *computed* values update after *source signal* mutations. Example: calling `deleteTransaction()` updates `_transactions` → triggers `monthTransactions` → triggers `spendingByCategory`. You assert the final computed value, and the intermediate chain is implicitly tested.

- **`toBeCloseTo(expected, numDigits)`**: Vitest/Jest matcher for floating-point comparison. `expect(80.0).toBeCloseTo(80, 1)` passes if the difference is less than `10^(-1) / 2 = 0.05`. Essential for financial amounts where floating-point arithmetic (e.g., `85.50 + 32.40`) can produce rounding artifacts. React testing-library uses the same matcher from Jest.

- **`structuredClone()` in services**: Each `beforeEach` creates a fresh service with `structuredClone(MOCK_DATA)`, so CRUD mutations in one test don't leak into the next. Without this, test order would matter — a classic pitfall. React equivalent: re-creating state in each test's `renderHook()` call. The `structuredClone` built-in is like `JSON.parse(JSON.stringify(...))` but handles more types (Dates, Maps, etc.).
