# return to self anchor prefill

## Goal

When the user chooses "带着这句回到自己" from Home, carry the visible anchor phrase into the Return-To-Self flow so the anchor step starts with that exact phrase selected.

## Requirements

- Home must pass the currently visible anchor text through route state when navigating to `/return-to-self`.
- Return-To-Self must read a typed `returnToSelfAnchor` route-state field and use it as the initial anchor text when it is a non-empty string.
- The prefilled anchor must appear in the anchor options and be selected by default.
- Return-To-Self should consume the prefill once and remove it from the current history entry after initialization.
- Direct visits to `/return-to-self` must keep the existing default anchor behavior.
- This must not skip the body step, auto-save anything, or create account impacts.

## Acceptance Criteria

- [ ] Home -> "带着这句回到自己" opens `/return-to-self` with the Home anchor selected in the anchor step.
- [ ] Direct `/return-to-self` still starts from the existing default anchor.
- [ ] Re-entering the same `/return-to-self` history entry after the handoff does not keep reusing stale route state.
- [ ] Blank or invalid route state is ignored.
- [ ] Typecheck, tests, and build pass.
- [ ] Browser check verifies the Home handoff and direct-route fallback.

## Definition of Done

- `npm run typecheck`, `npm test`, and `npm run build` pass.
- Forbidden product/network pattern scan is clean.
- Task is committed, archived, and recorded in the session journal.

## Technical Approach

- Extend `RouteState` in `src/utils/route.ts` with `returnToSelfAnchor?: string`.
- Update `HomePage` navigate prop typing to accept route state and pass `{ returnToSelfAnchor: latestAnchorText }`.
- Update `ReturnToSelfPage` to narrow `window.history.state` locally, initialize `anchor` / `anchorOptions` from the route-state anchor, and clear the one-time handoff field after initialization.

## Decision (ADR-lite)

**Context**: Home can show a standalone or fallback anchor. Navigating to Return-To-Self should preserve the user's chosen phrase without creating durable state or new data contracts.

**Decision**: Use existing browser history route state as a transient handoff.

**Consequences**: The flow feels continuous from Home while staying local, transient, and non-persistent. Refreshing or opening `/return-to-self` directly can safely fall back to existing defaults.

## Out of Scope

- Persisting a selected anchor outside the existing save flow.
- Starting Return-To-Self on the anchor step or skipping the body step.
- Adding route query parameters.
- Changing account impact, storage, validation, or anchor source contracts.

## Technical Notes

- Relevant files inspected:
  - `src/App.tsx`
  - `src/utils/route.ts`
  - `src/routes/HomePage.tsx`
  - `src/routes/ReturnToSelfPage.tsx`
  - `src/routes/QuickRecordPage.tsx`
  - `.trellis/spec/frontend/component-guidelines.md`
  - `.trellis/spec/frontend/type-safety.md`
  - `.trellis/spec/frontend/state-management.md`
  - `.trellis/spec/frontend/quality-guidelines.md`
- Existing `navigate(nextRoute, routeState)` already stores route state via `window.history.pushState`.
