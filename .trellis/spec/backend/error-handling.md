# Backend Error Handling

> Error handling guidance for the current no-backend project.

---

## Current State

There is no HTTP API, server command handler, backend exception boundary, or API error response format in this repository.

Error handling that may look "backend-like" happens in frontend persistence:

- `src/storage/storageAdapter.ts` catches browser storage failures and returns typed result unions.
- `src/store/AppStoreContext.tsx` converts storage failures into app store status.
- `src/components/StorageWarning.tsx` shows honest user-facing copy.

---

## Typed Result Contract

Storage operations must return result objects instead of throwing through route components:

```ts
type StorageWriteResult =
  | { ok: true }
  | { ok: false; status: StorageStatus; error?: string };
```

Store actions expose `StoreWriteResult` so routes must check `result.ok` before showing success copy.

---

## Error Matrix

| Condition | Expected Handling |
|---|---|
| `localStorage` unavailable | Adapter returns `status: "unavailable"` and store enters warning/error state. |
| Load reads invalid JSON | Adapter returns fallback initial state with `status: "corrupted"`. |
| Load reads future schema version | Adapter returns fallback initial state with `status: "unsupported_version"`. |
| Save fails | Store returns failed result with `inMemoryOnly: true`; UI must not claim the item was saved. |
| Reset fails | Store keeps current state and shows reset error copy. |

---

## API Error Responses

Not applicable. Do not create an API response format until the project has an API PRD and backend runtime.

---

## Common Mistakes

### Wrong: Throwing From Normal Save Flow

```ts
throw new Error("Failed to save");
```

### Correct: Return Typed Failure

```ts
return { ok: false, status: "unavailable", error: "Failed to save local data." };
```

### Wrong: Success Copy Without Checking Result

```ts
actions.saveQuickRecord(input);
setMessage("已存下");
```

### Correct: Check `result.ok`

```ts
const result = actions.saveQuickRecord(input);
setMessage(result.ok ? "已存下" : "这次还没有保存成功。");
```
