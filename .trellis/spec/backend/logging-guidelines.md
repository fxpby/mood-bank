# Backend Logging Guidelines

> Logging and telemetry guidance for the current project.

---

## Current State

There is no backend logger, server log stream, telemetry pipeline, analytics SDK, or remote monitoring endpoint.

The P0 privacy boundary is local-first:

- no telemetry
- no backend sync
- no network reporting
- no AI calls
- no push

---

## Rule

Do not add logging or telemetry dependencies for product behavior unless a future PRD explicitly changes the privacy boundary.

Forbidden in P0 product code:

- `console.log` / debug logs left in source
- analytics SDKs
- remote error reporting
- `fetch` / `XMLHttpRequest` / `navigator.sendBeacon` for logging
- sending relationship text, drafts, emotions, or storage state off-device

---

## What To Use Instead

Use local UI state and user-visible copy:

- storage warnings through `StorageWarning`
- typed write failures through store action results
- tests for expected failure behavior

For development debugging, remove temporary logs before committing.

---

## Review Checklist

- [ ] No product telemetry was added.
- [ ] No debug logs remain in `src/`.
- [ ] No relationship content can leave the browser.
- [ ] Storage failures are visible to the user instead of silently logged.
