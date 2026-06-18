# State Management

> State contracts for the local-first emotional account PWA.

---

## Overview

The app uses React context for app-level local state and route-local React state for in-progress form steps. There is no server state in P0.

The authoritative persisted object is `AppState`. It is loaded and saved through `StorageAdapter`, then exposed to routes through `AppStoreProvider`.

---

## State Categories

### Route-Local State

Use route-local `useState` for transient UI state:

- current step in a flow
- selected chips before save
- text input drafts before the debounced draft write
- local validation errors

### App Store State

Use `AppStoreContext` for state that must survive route changes or refresh:

- setup state and emotional spaces
- daily markets
- episodes
- return-to-self practices
- anchors
- drafts
- storage status and last save/reset error

### Derived State

Do not persist derived storage-jar summaries. They must be computed from saved source records:

```ts
const summaries = deriveAllAccountSummaries(state);
```

`deriveAllAccountSummaries` collects account impacts from episodes and return-to-self practices only. Drafts and placeholders must not contribute to summaries.

Account detail screens are also derived read models:

```ts
const detail = selectAccountDetail(state, "self");
```

`selectAccountDetail` must derive rows from `AccountImpact[]` plus readable source context from `episodes` and `returnToSelfPractices`. It must not persist detail rows, cached summaries, or route-local action choices. Suggested personal actions on detail pages are transient UI state only unless a future PRD adds an explicit durable action model.

---

## Write Contract

All durable writes go through `AppActions` in `src/store/AppStoreContext.tsx`.

Required action behavior:

| Action | May Persist | Notes |
|---|---:|---|
| `completeSetup` | Yes | Replaces initial state with setup state. |
| `updateDailyMarket` | Yes | Upserts today's market by date key. |
| `saveQuickRecord` | Yes | Creates an episode and clears a matching draft id after successful state construction. |
| `saveReturnToSelfPractice` | Yes | Creates a practice and optional anchor. Never creates connection impact. |
| `saveTriggerCompletion` | No in P0 | Returns no-write result so Trigger -> Quick Record does not double-count Self. |
| `saveDiscoveryPoint` | Yes | Creates a manual or source-linked discovery point. Must not create account impacts by default. |
| `updateDiscoveryPointStatus` | Yes | Updates one discovery point status. Unknown ids return no-op success. Must not create account impacts. |
| `saveDraft` | Yes | Saves route draft data only; drafts never create account impacts. |
| `deleteDraft` | Yes | No-op success if the draft is already absent. |
| `resetLocalData` | Yes | Resets storage only after adapter reset succeeds. |

If storage save fails, return `{ ok: false, inMemoryOnly: true }` and do not update `state` as if the write were durable. UI copy must not claim the record was saved.

---

## Storage Contract

Only `src/storage/storageAdapter.ts` may call `window.localStorage`.

The adapter must return typed result objects:

```ts
type LoadResult =
  | { ok: true; state: AppState; status: "available" }
  | { ok: false; fallbackState: AppState; status: StorageStatus; error?: string };

type StorageWriteResult =
  | { ok: true }
  | { ok: false; status: StorageStatus; error?: string };
```

Validation/error behavior:

| Condition | Expected Result |
|---|---|
| Storage unavailable | `ok: false`, `status: "unavailable"`, fallback initial state on load. |
| Empty storage | `ok: true`, initial state. |
| Invalid JSON or invalid minimum shape | `ok: false`, `status: "corrupted"`, fallback initial state. |
| Future schema version | `ok: false`, `status: "unsupported_version"`, fallback initial state. |
| Save/reset throws | `ok: false`, `status: "unavailable"` with error text. |

---

## Common Mistakes

### Wrong: Persisting Summaries

```ts
// Wrong: this makes stored summaries authoritative.
state.accountSummaries = deriveAllAccountSummaries(state);
```

### Correct: Derive at Read Time

```ts
const summaries = deriveAllAccountSummaries(state);
```

### Wrong: Storage in Routes

```ts
// Wrong: bypasses storage validation and error copy.
window.localStorage.setItem("mood-bank:v1:app-state", JSON.stringify(nextState));
```

### Correct: Commit Through Store Action

```ts
const result = actions.saveQuickRecord(input);
```

### Discovery Point Contract

`topics` in `AppState` stores `DiscoveryPoint[]`, not task backlog items. The Topics page may use route-local state for filters and form fields, but durable changes must go through:

```ts
actions.saveDiscoveryPoint(input);
actions.updateDiscoveryPointStatus({ id, status });
```

Saving or reviewing a discovery point must not change Connection / Self / Energy summaries unless a future PRD adds an explicit account-impact rule. Tests should assert that topic helpers leave derived storage-jar summaries unchanged.
