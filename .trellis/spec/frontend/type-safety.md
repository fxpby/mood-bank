# Type Safety

> Type safety patterns for frontend product and storage code.

---

## Overview

The app uses TypeScript strict project checks through `tsc -b`. Product data contracts live in `src/domain/types.ts`; runtime validation for persisted state lives in `src/domain/validation.ts`.

Use typed result unions for operations that can fail. Do not throw from normal storage/write paths and do not let routes guess persistence status from exceptions.

---

## Type Organization

- Shared product contracts: `src/domain/types.ts`
- Pure derived types close to their functions, such as `AccountSummary` in `src/domain/accounts.ts`
- Store/action types: `src/store/AppStoreContext.tsx`
- Storage adapter types: `src/storage/storageAdapter.ts`
- Route union and route-state types: `src/utils/route.ts`

Keep route-local UI-only unions in the route file unless they are reused by domain/store code.

---

## Validation

Persisted app state is untrusted input. `StorageAdapter.load()` must parse JSON as `unknown` and pass it through `validateMinimumAppState`.

Minimum behavior:

- valid v1 state loads as `AppState`
- missing arrays default to empty arrays
- missing setup completion defaults to false
- legacy reserved `topics` entries normalize into readable `DiscoveryPoint` records with default kind/status/source
- unsupported future versions are rejected
- invalid JSON or invalid minimum shape returns fallback state with corrupted status

Discovery point validation defaults:

| Missing/invalid field | Default |
|---|---|
| `title` | `一个稍后再看的点` |
| `kind` | `discovery` |
| `status` | `stored_for_later` |
| `sourceType` | `manual` |
| `theme` | `undefined` |

---

## Common Patterns

### Result Unions

Use discriminated result unions for persistence and store writes:

```ts
type StoreWriteResult<T = undefined> =
  | { ok: true; savedAt: string; value?: T }
  | { ok: false; status: StorageStatus; error?: string; inMemoryOnly?: boolean };
```

Routes must check `result.ok` before showing success copy.

### Narrowing Route State

Browser history state can be unknown at runtime. Keep narrowing close to the route that reads it and map it into typed local state before use.

Route-state fields are transient handoffs, not durable data. When a route consumes a one-time field such as `returnToSelfAnchor`, initialize route-local state from the narrowed value, then remove that field from the current history entry so direct re-entry or refresh does not reuse stale intent:

```ts
const [routeAnchor] = useState(() => getReturnToSelfAnchor());

useEffect(() => {
  if (routeAnchor) {
    clearReturnToSelfAnchorState();
  }
}, [routeAnchor]);
```

### Dynamic Detail Routes

Dynamic detail routes supported by the app shell:

```ts
type AppRoute = "/record" | `/record/${string}` | "/topics" | `/topics/${string}` | ...;

const recordRoute = buildRecordRoute(episode.id);
const recordId = getRecordRouteId(window.location.pathname);
const route = buildTopicRoute(point.id);
const topicId = getTopicRouteId(window.location.pathname);
```

Rules:

- Build detail routes with `buildRecordRoute(id)` / `buildTopicRoute(id)`, not string concatenation in page components.
- `normalizeRoute("/record/<id>")` and `normalizeRoute("/topics/<id>")` must keep route ids URL-safe and return the typed template route.
- Detail pages should decode ids with `getRecordRouteId(...)` / `getTopicRouteId(...)` and handle missing/unknown ids with an honest empty state.
- Add route helper tests whenever dynamic route behavior changes.

---

## Forbidden Patterns

### Avoid `any`

Do not introduce `any` for product data. If external or browser data is unknown, use `unknown` and validate/narrow it.

### Avoid Blind Assertions

```ts
// Wrong: trusts persisted or browser data.
const state = JSON.parse(raw) as AppState;
```

```ts
// Correct: parse as unknown and validate.
const parsed = JSON.parse(raw) as unknown;
const validated = validateMinimumAppState(parsed);
```

### Avoid Optional Success Checks

```ts
// Wrong: success copy appears even if save failed.
actions.saveQuickRecord(input);
setMessage("已存下");
```

```ts
// Correct: success copy follows typed result.
const result = actions.saveQuickRecord(input);
setMessage(result.ok ? "已存下" : "这次还没有保存成功。");
```
