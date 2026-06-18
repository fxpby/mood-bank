# Hook Guidelines

> Hook conventions for the frontend app.

---

## Overview

The app currently uses React built-in hooks and one project hook, `useAppStore()`. There is no data-fetching hook layer in P0 because the product has no backend, sync, telemetry, or AI calls.

Keep hooks small and local unless state truly belongs to the app store.

---

## Custom Hook Patterns

The primary shared hook is:

```ts
const { state, status, storageStatus, actions } = useAppStore();
```

Use it from route components that need persisted app state or write actions. Presentational components should receive data and callbacks through props when practical.

If a new custom hook is introduced, it should:

- start with `use`
- hide repeated UI coordination, not product rules
- return typed values and callbacks
- avoid direct browser storage access
- avoid network behavior in P0

---

## Data Fetching

No data-fetching hooks are allowed in P0 product code. The app is local-first and all durable state comes from the storage adapter.

Future server-state libraries should not be introduced until there is an explicit backend/sync PRD.

---

## Naming Conventions

- `useAppStore` for app state and actions
- `useMemo` for derived route display data when needed
- `useCallback` for action functions passed through context or stable child props
- route-local helper functions may stay plain functions if they do not need React state/lifecycle

---

## Common Mistakes

### Wrong: Product Rules Inside Effects

```tsx
useEffect(() => {
  const summary = calculateAndPersistSummary(state);
  actions.saveSummary(summary);
}, [state, actions]);
```

### Correct: Pure Selector or Domain Function

```tsx
const summaries = useMemo(() => deriveAllAccountSummaries(state), [state]);
```

### Wrong: Effect-Based Storage Write From a Display Component

```tsx
useEffect(() => {
  window.localStorage.setItem("draft", value);
}, [value]);
```

### Correct: Explicit Store/Adapter Boundary

```tsx
const result = actions.saveDraft(input);
```
