# Frontend Development Guidelines

> Frontend guidance for the local-first emotional account PWA.

---

## Overview

This repository is a Vite + React + TypeScript mobile-first PWA. Frontend code owns the full P0 product runtime: routing, UI, local state, browser persistence, deterministic domain rules, and tests.

Core constraints:

- Keep the app local-first and single-device unless a future PRD changes that.
- Keep durable writes behind `AppStoreContext` and `StorageAdapter`.
- Keep domain rules pure and tested.
- Do not add backend calls, telemetry, AI calls, login, sync, or push in P0/P1 frontend work.
- Preserve the user-facing product language and avoid transactional or diagnostic copy.

Evidence:

- `src/App.tsx` and `src/utils/route.ts` define the route shell.
- `src/routes/` contains page-level flows.
- `src/domain/` contains pure product rules and tests.
- `src/storage/storageAdapter.ts` is the only browser storage boundary.
- `src/store/AppStoreContext.tsx` is the app write boundary.

---

## Guidelines Index

| Guide | Description | Status |
|-------|-------------|--------|
| [Directory Structure](./directory-structure.md) | Module organization and file layout | Active |
| [Component Guidelines](./component-guidelines.md) | Component patterns, props, composition | Active |
| [Hook Guidelines](./hook-guidelines.md) | Custom hooks, data fetching patterns | Active |
| [State Management](./state-management.md) | Local state, global state, server state | Active |
| [Quality Guidelines](./quality-guidelines.md) | Code standards, forbidden patterns | Active |
| [Type Safety](./type-safety.md) | Type patterns, validation | Active |

---

## Required Checks

Run these before committing frontend changes:

```bash
npm run typecheck
npm test
npm run build
```
