# Directory Structure

> Frontend source organization for the local-first emotional account PWA.

---

## Overview

The app is a single Vite + React frontend. Keep product behavior split by boundary rather than by route-only feature folders:

- `src/routes/` owns page-level flows and route composition.
- `src/components/` owns shared presentational UI.
- `src/domain/` owns pure product rules, types, defaults, selectors, and tests.
- `src/store/` owns React context actions and the write boundary.
- `src/storage/` owns persistence adapters and storage tests.
- `src/copy/` owns stable UI copy tables.
- `src/styles/` owns global styles, design tokens, and screen-level CSS.
- `src/utils/` owns small framework-neutral helpers such as route normalization.

Do not put `localStorage`, network calls, account derivation, or product scoring logic directly inside route components.

---

## Directory Layout

```text
src/
├── App.tsx
├── main.tsx
├── components/
├── copy/
├── domain/
├── routes/
├── storage/
├── store/
├── styles/
└── utils/
```

---

## Module Organization

### Routes

Route components receive navigation as a prop and render one user-facing screen or flow:

```tsx
type QuickRecordPageProps = {
  navigate: (route: AppRoute) => void;
};
```

Routes may call store actions through `useAppStore()`, but they should not reach into browser storage directly.

### Domain

Pure rules live under `src/domain/`. Domain functions must be deterministic, easy to unit test, and free of React/browser dependencies.

Examples:

- account impact derivation
- minimum app-state validation
- default app-state creation
- selectors for active space, latest records, and current market

### Storage

Persistence is isolated under `src/storage/`. The current adapter is localStorage-backed, but callers depend on the `StorageAdapter` interface so IndexedDB, encryption, import/export, or sync can be added later without rewriting routes.

---

## Naming Conventions

- React components: `PascalCase.tsx`
- Pure domain modules: `camelCase.ts`
- Tests: colocated `*.test.ts`
- User-facing copy tables: grouped by product concept under `src/copy/`
- CSS: `tokens.css`, `global.css`, and screen-level CSS in `screens.css`

---

## Examples

- `src/domain/accounts.ts` for deterministic account impact and summary rules.
- `src/storage/storageAdapter.ts` for the storage boundary.
- `src/store/AppStoreContext.tsx` for app-level write actions and storage error propagation.
- `src/routes/QuickRecordPage.tsx` for route-local form state that commits through store actions.
