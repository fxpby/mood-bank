# Quality Guidelines

> Code and product quality standards for frontend development.

---

## Overview

The P0 app is a private local-first tool for emotionally activated use. Quality is measured by:

- deterministic behavior
- honest persistence semantics
- low-cognitive mobile flows
- no relationship verdicts or partner inference
- no hidden network behavior
- clear separation between source records and derived summaries

---

## Forbidden Patterns

### Network and Remote Behavior in P0

Do not add backend sync, login, telemetry, push, AI calls, `fetch`, `XMLHttpRequest`, or `navigator.sendBeacon` in P0 product code.

### Browser Storage Outside Adapter

Do not call `window.localStorage` outside `src/storage/storageAdapter.ts`.

### Relationship Verdicts

Do not compute or display:

- relationship health score
- partner intent or attachment diagnosis
- self-worth / lovability score
- safety score
- "who owes whom" style conclusions

### Transactional Copy

Avoid user-facing copy that turns intimacy into accounting or debt, especially:

- `记账`
- `对账`
- `消费`
- `余额不足`
- `还债`
- `兑换`

Allowed warmer product language includes:

- `情感储蓄罐`
- `存下`
- `打开罐子`
- `取一个支持自己的小动作`
- `明细`

### Placeholder Writes

Placeholder routes must not write data, create account impacts, or imply that the feature is implemented.

---

## Required Patterns

### Account Impact Transparency

Connection / Self / Energy movement must come from source-owned evidence:

- Quick Record can create connection impact only from explicit observable connection evidence or self-contact evidence.
- Return-To-Self can create Self and Energy impacts, never Connection.
- Trigger completion is no-write in P0 when it routes into Quick Record, preventing duplicate Self impact.
- Drafts never create account impacts.

### Storage Failure Honesty

If saving fails, UI must not say the item was saved. Show storage warning/error copy and keep the user from trusting false persistence.

### Mobile-First Layout

Primary touch targets should be at least 44px. Chinese text must wrap cleanly in chips, buttons, cards, nav items, and completion actions on narrow mobile widths.

### Accessibility

Buttons, inputs, dialogs, chips, and navigation must have visible focus states. Dialogs need labels and explicit confirm/cancel actions.

---

## Testing Requirements

Run these before shipping P0 changes:

```bash
npm run typecheck
npm test
npm run build
```

Required test coverage:

- pure domain rules in `src/domain/*.test.ts`
- storage load/save/reset and validation behavior in `src/storage/*.test.ts`
- regression tests for account impact edge cases and storage failure semantics when changed

Manual checks:

- narrow mobile viewport around 360px width
- setup and settings local-only copy
- Home trigger-first hierarchy
- Trigger -> Quick Record persistence without duplicate Self impact
- Return-To-Self partial/full completion
- Quick Record draft recovery
- reset confirmation and post-reset setup route

---

## Code Review Checklist

- [ ] No new network or telemetry behavior.
- [ ] No direct browser storage outside the adapter.
- [ ] No persisted derived storage-jar summaries.
- [ ] No placeholder route writes.
- [ ] No transactional or diagnostic user-facing copy.
- [ ] Save/reset failure states use honest copy.
- [ ] New product rules have focused unit tests.
- [ ] Mobile text wrapping and touch targets were checked.
