# Backend Development Guidelines

> Backend guidance for this project as it exists today.

---

## Overview

This repository currently has no backend runtime. It is a frontend-only Vite + React PWA with local browser persistence through `src/storage/storageAdapter.ts`.

Do not create backend folders, APIs, databases, migrations, auth, sync, telemetry, or AI service calls unless a future PRD explicitly changes the product boundary. The P0 product contract is local-first and single-device.

Evidence:

- `package.json` only defines Vite, React, TypeScript, and Vitest scripts.
- `src/` contains frontend routes, components, domain rules, store, and storage adapter modules.
- `README.md` states there is no backend, login, cloud sync, telemetry, push, or AI analysis.

---

## Guidelines Index

| Guide | Description | Status |
|-------|-------------|--------|
| [Directory Structure](./directory-structure.md) | Backend boundary and non-applicable directories | Active |
| [Database Guidelines](./database-guidelines.md) | No database/ORM/migration contract | Active |
| [Error Handling](./error-handling.md) | No API error surface; frontend typed result boundary | Active |
| [Quality Guidelines](./quality-guidelines.md) | Backend-related forbidden patterns and review checks | Active |
| [Logging Guidelines](./logging-guidelines.md) | No backend logging/telemetry contract | Active |

---

## Decision

Backend specs are intentionally explicit "not applicable yet" specs. Their job is to stop future agents from inventing a backend from generic scaffolding.

If backend work becomes real later, create a dedicated PRD first and update these specs with source-backed conventions after the backend architecture exists.
