# Database Guidelines

> Database guidance for the current frontend-only app.

---

## Current State

The project has no backend database, ORM, migrations, server-side models, or remote persistence. P0 data is saved in the current browser through `localStorage`, isolated behind `src/storage/storageAdapter.ts`.

The storage key is:

```ts
export const APP_STATE_STORAGE_KEY = "mood-bank:v1:app-state";
```

Persisted data must match the `AppState` contract in `src/domain/types.ts` and pass `validateMinimumAppState()` before use.

---

## No Database Contract

Do not add:

- Prisma, Drizzle, TypeORM, Sequelize, or database clients
- SQL migrations
- remote document stores
- user accounts or auth tables
- sync queues
- analytics event tables

These are out of scope until a future backend/sync PRD exists.

---

## Local Persistence Pattern

Use the frontend storage contract instead of database patterns:

| Database Concept | Current Equivalent |
|---|---|
| schema | `AppState` and `APP_STATE_SCHEMA_VERSION` in `src/domain/types.ts` |
| migration/validation | `validateMinimumAppState()` in `src/domain/validation.ts` |
| repository/DAO | `StorageAdapter` in `src/storage/storageAdapter.ts` |
| transaction | atomic in-memory next-state construction before adapter save |
| read model | selectors and derived domain functions |

---

## Validation Requirements

Storage load must handle:

- empty storage -> initial state
- corrupted JSON -> fallback state with corrupted status
- unsupported future version -> fallback state with unsupported-version status
- missing arrays -> default empty arrays

Reference tests:

- `src/storage/storageAdapter.test.ts`
- `src/domain/validation.test.ts`

---

## Anti-Pattern

Do not persist derived storage-jar summaries as if they were database rows. Summaries are derived from source records and practices through `deriveAllAccountSummaries(state)`.
