# High Activation Routing Coverage

## Goal

Improve trigger-first continuity by passing transient high-activation context from additional completed source flows into optional P2 reflection branches. When a user enters a deeper branch from a high-activation moment, the branch should continue to show the existing Return-to-Self nudge before analysis.

## What I Already Know

- Existing route-state support already exists:
  - `buildHighActivationBranchState(...)`
  - `getBranchActivationContext(...)`
  - `BranchActivationNudge`
- Current covered sources are `draft_check`, `signal_check`, and `emotion_calibration`.
- README / main PRD say high-activation route context is useful but only partially covered.
- Rich Incoming can route to Seeing Evidence, Healthy Love, Repair / Understanding, Draft Check, and Return-to-Self from completion.
- Quick Record can route to Seeing Evidence when the saved record has warmth or high connection; it already identifies `highActivation`.

## Requirements

- Extend high-activation route-state source typing to include:
  - `rich_incoming`
  - `quick_record`
- Update `BranchActivationNudge` source copy for those sources.
- In Rich Incoming completion, when the user's selected state indicates overload / pressure / rumination / wanting escape or reply-now urgency, pass high-activation route state to P2 branch routes:
  - `/seeing-evidence`
  - `/healthy-love`
  - `/repair-understanding`
  - `/draft-check` if relevant later route state supports it; if not, keep direct navigation unchanged.
- In Quick Record completion, when the saved record is high activation and the user opens Seeing Evidence from the warmth CTA, pass high-activation route state to `/seeing-evidence`.
- Keep direct entry behavior unchanged. Branch pages should still render normally when route state is absent.
- Do not persist high-activation context in `AppState`, storage, discovery points, account impacts, telemetry, or search history.

## Acceptance Criteria

- [x] `buildHighActivationBranchState("rich_incoming")` and `"quick_record"` are valid.
- [x] Malformed branch route state remains ignored.
- [x] BranchActivationNudge displays source-specific copy for Rich Incoming and Quick Record.
- [x] Rich Incoming passes branch activation state to supported P2 branch CTAs only when route-local selections indicate overload or high activation.
- [x] Quick Record passes branch activation state to Seeing Evidence when saved record activation is high.
- [x] Existing Draft Check, Signal Check, and Emotion Calibration behavior stays unchanged.
- [x] Typecheck, tests, and build pass.

## Definition of Done

- Focused route-state tests updated.
- Source route behavior implemented with no durable writes.
- README / state-management spec updated if the user-visible status table or route-state contract changes.
- Browser smoke verifies at least one newly covered source route shows the P2 nudge.

## Technical Approach

- Add the new source literals to `BranchActivationSource`.
- Update `BranchActivationNudge` copy map.
- Add a small route-local predicate in Rich Incoming for high-activation selections.
- Pass a `RouteState | undefined` argument when navigating from source flows to P2 routes.
- Reuse the existing P2 pages' nudge support rather than editing each destination page.

## Decision (ADR-lite)

**Context**: The existing high-activation routing pattern is intentionally transient and non-persistent. It is already accepted by P2 branch pages, so adding source coverage should not create new durable models.

**Decision**: Extend the existing route-state pattern to Rich Incoming and Quick Record rather than introducing global state, storage flags, or per-branch special cases.

**Consequences**: This keeps the behavior consistent and low-risk. The main limitation is that the nudge depends on explicit source-route navigation; direct URL entry remains unmodified by design.

## Out of Scope

- Persisting activation level or branch context.
- Forcing Return-to-Self before a branch can continue.
- Adding scores, risk levels, clinical claims, or safety workflows.
- Refactoring P2 branches into shared components.
- Redesigning UI or Figma matching.

## Technical Notes

- Relevant files inspected:
  - `src/utils/route.ts`
  - `src/utils/route.test.ts`
  - `src/components/BranchActivationNudge.tsx`
  - `src/routes/RichIncomingPage.tsx`
  - `src/routes/QuickRecordPage.tsx`
  - `.trellis/spec/frontend/component-guidelines.md`
  - `.trellis/spec/frontend/state-management.md`
- Existing branch destinations already read `BranchActivationNudge` from `window.history.state`.
