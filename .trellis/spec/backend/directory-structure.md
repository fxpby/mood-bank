# Backend Directory Structure

> Current backend directory guidance.

---

## Current State

There is no backend directory in this repository.

Current app structure is frontend-only:

```text
src/
├── components/
├── copy/
├── domain/
├── routes/
├── storage/
├── store/
├── styles/
└── utils/
```

`public/` contains PWA assets and `manifest.webmanifest`. `dist/` is build output and is ignored.

---

## Rule

Do not add any of these directories as part of ordinary P0/P1 frontend work:

- `server/`
- `backend/`
- `api/`
- `functions/`
- `supabase/`
- `prisma/`
- `db/`

Adding a backend is a product architecture change. It requires a new PRD that defines the API surface, persistence model, privacy implications, migration path, and updated acceptance criteria.

---

## Where Backend-Like Concerns Live Today

| Concern | Current Owner |
|---|---|
| Durable browser persistence | `src/storage/storageAdapter.ts` |
| Runtime validation for persisted state | `src/domain/validation.ts` |
| App-level write actions | `src/store/AppStoreContext.tsx` |
| Product rules and derived summaries | `src/domain/accounts.ts`, `src/domain/selectors.ts` |
| Tests for persistence/domain behavior | `src/storage/*.test.ts`, `src/domain/*.test.ts` |

---

## Anti-Pattern

Do not create an API boundary just to share logic between routes. Extract pure logic into `src/domain/` or route-neutral helpers under `src/utils/` instead.
