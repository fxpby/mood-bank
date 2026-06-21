# Repair Understanding Check

## Goal

Add a lightweight P2 branch for conflict, mismatch, or post-rupture moments where the user wants repair without turning the flow into blame, mind-reading, or a relationship verdict. The flow should help the user name what they want understood, what they may not yet understand, what part is theirs to own, and one next direction.

## Requirements

* Add a route `/repair-understanding`.
* The route follows existing P2 compact branch patterns: landing gate, short chip/text steps, completion summary, optional save to Topics, and related next-route actions.
* Capture these route-local fields:
  * what I want understood
  * what I may not yet understand
  * my part to own
  * one next direction: repair, boundary, wait, later topic, draft check, Return-To-Self, or healthy-love learning
  * optional private note
* Saving creates one `DiscoveryPoint` with:
  * `theme: "relationship_learning"`
  * `sourceType: "manual"`
  * `sourceTitle: "修复/理解轻检查"`
  * `kind: "topic"` only when next direction is later topic, otherwise `kind: "discovery"`
* Saving must not create account impacts, episodes, drafts, experiments, anchors, partner labels, or relationship verdicts.
* Copy must stay self-facing and repair-oriented:
  * repair means understanding + responsibility + boundary, not winning or self-erasure
  * "my part" must not become forced blame
  * "what I may not yet understand" must not infer the other person's psychology
* Completion can route to Boundary Clarity, Draft Check, Healthy Love, Return-To-Self, Topics, and Home.

## Acceptance Criteria

* [ ] `/repair-understanding` normalizes and renders.
* [ ] User can complete the flow without saving; no state is written.
* [ ] User can save one repair/understanding discovery point.
* [ ] Save is idempotent at route level: repeated save shows already-saved copy instead of duplicating.
* [ ] Saved point uses relationship-learning theme and no account impact.
* [ ] Unit tests cover summary/default copy, discovery-point payload, route normalization, and no account-summary movement.
* [ ] README and first-release PRD status/backlog are updated.

## Definition of Done

* `npm run typecheck`, `npm test`, `npm run build`, and `git diff --check` pass.
* Browser smoke validates direct route -> completion -> save -> Topics.
* Task is committed, archived, and journaled.
* Existing design artifacts `DESIGN.md` and `design-snapshots/` remain uncommitted.

## Technical Approach

* Add `src/domain/repairUnderstanding.ts` and focused tests.
* Add `src/routes/RepairUnderstandingPage.tsx` using existing `PageHeader`, `StepScreen`, `ChipGroup`, `CompletionCard`, and `SupportBoundaryCard` patterns.
* Add `/repair-understanding` to `AppRoute`, `normalizeRoute`, `App.tsx`, and route tests.
* Add route entries from relevant existing completion pages where repair is a natural next step, without changing their persisted behavior.
* Update docs and frontend state-management spec to document the save contract.

## Decision (ADR-lite)

**Context**: The full product backlog already includes a repair/understanding check. Existing P2 branches save compact reflections as discovery points and avoid new persisted models unless the data needs its own lifecycle.

**Decision**: Implement repair/understanding as a compact P2 branch that saves one relationship-learning discovery point.

**Consequences**: The feature becomes available without expanding storage schema. If repair work later needs multi-step history or linked episode review, that should be a separate PRD.

## Out of Scope

* Apology generation, scripted messages, or optimized reply wording.
* Predicting whether repair will work.
* Deciding who was right/wrong.
* Partner intent inference, attachment diagnosis, green/red-flag scoring, or stay/leave advice.
* Creating Connection, Self, or Energy impact directly from the check.
* Legal/safety advice or danger scoring.

## Technical Notes

* Relevant patterns:
  * `src/domain/healthyLove.ts`
  * `src/routes/HealthyLovePage.tsx`
  * `src/domain/boundaryClarity.ts`
  * `src/routes/BoundaryClarityPage.tsx`
  * `.trellis/spec/frontend/state-management.md`
* Full backlog source:
  * `.trellis/tasks/archive/2026-06/06-17-emotional-account-pwa/prd.md`
  * Acceptance row: "repair/understanding check that records what they want understood, what they may not yet understand, their part, and one next direction..."
