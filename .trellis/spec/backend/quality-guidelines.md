# Backend Quality Guidelines

> Quality gates for backend-related changes.

---

## Current State

No backend exists today. Backend quality checks therefore focus on preventing accidental architecture expansion.

Use frontend quality gates for current product changes:

```bash
npm run typecheck
npm test
npm run build
```

---

## Forbidden Patterns

Do not introduce backend infrastructure without a new PRD:

- API route handlers
- server processes
- database clients or migrations
- authentication providers
- sync workers
- telemetry or analytics endpoints
- cloud functions

Do not add dependencies for these concerns speculatively.

---

## Required Before Adding Backend

A future backend PRD must define:

- why local-first browser storage is no longer enough
- exact data that leaves the device
- privacy and deletion semantics
- API routes and payload contracts
- authentication model
- persistence schema and migration plan
- offline/sync conflict behavior
- tests and acceptance criteria

After that implementation exists, update every file in `.trellis/spec/backend/` with real source-backed conventions.

---

## Review Checklist

- [ ] Does this change add a backend runtime or dependency?
- [ ] If yes, is there a PRD explicitly approving it?
- [ ] Does any relationship content leave the browser?
- [ ] Are local-first claims in README/UI still accurate?
- [ ] Do existing frontend checks still pass?

If any answer is unclear, stop and clarify product scope before coding.
