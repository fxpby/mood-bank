# P2 Seeing Evidence Branch

## Goal

Add a compact optional `/seeing-evidence` branch that helps the user recognize observable "being seen / being understood / mutual listening" evidence without turning warmth into future proof, people-reading, or relationship verdicts. First build scope is evidence recognition, not practicing how to see the other person.

## Requirements

- Add a short optional route at `/seeing-evidence`.
- Keep the flow chip-first and low-cognitive:
  - Gate: seeing is not mind-reading, not obligation, and not future proof.
  - Focus: what felt seen, understood, respected, witnessed, mutual, or not sure.
  - Evidence: what was observable in this moment.
  - Calibration: what this evidence can mean and cannot prove.
  - Capacity: whether the user has capacity to respond/listen now.
  - Next direction.
  - Completion summary.
- Save completion as one `DiscoveryPoint` with `theme: "relationship_learning"` and `sourceType: "manual"`.
- Saving this branch must not create Connection, Self, or Energy impacts in this first build.
- Add contextual entry points:
  - Rich Incoming completion offers "看见被看见的证据" when received shape/thread/emotion includes being seen, warmth, gratitude, moved, settled, or mutual care.
  - Draft Check completion offers "看见被看见的证据" when the draft state/motivation/content suggests warmth, repair, expression, or over-explaining pressure.
- Use existing route/page/store patterns. No new persistence model.
- Show honest storage failure copy. Do not show success copy when save fails.

## Acceptance Criteria

- [x] `/seeing-evidence` is recognized by route normalization and renders after setup.
- [x] User can complete the branch and see a summary with focus, observable evidence, calibration, capacity, and next direction.
- [x] User can save the summary as a relationship-learning discovery point.
- [x] Saved discovery point uses manual source, readable Chinese note copy, and no account impacts.
- [x] Rich Incoming and Draft Check expose contextual entry buttons without blocking existing actions.
- [x] `npm run typecheck`, `npm test`, `npm run build`, and `git diff --check` pass.

## Definition of Done

- Focused unit tests cover the domain helper and account-impact non-regression.
- Route helper tests include `/seeing-evidence`.
- The implementation stays local-first and single-device.
- No backend, login, sync, telemetry, AI call, push, direct `localStorage`, people-reading, partner profile, empathy score, true-love proof, stay/leave advice, or account impact is added.

## Technical Approach

- Create `src/domain/seeingEvidence.ts` for typed chips, copy maps, summary construction, and `DiscoveryPointInput` construction.
- Create `src/domain/seeingEvidence.test.ts` for pure behavior and no-account-impact regression.
- Create `src/routes/SeeingEvidencePage.tsx` using `StepScreen`, `ChipGroup`, `CompletionCard`, `PageHeader`, and `useAppStore`.
- Add route plumbing in `src/App.tsx`, `src/utils/route.ts`, and `src/utils/route.test.ts`.
- Add lightweight CSS classes in `src/styles/screens.css`, reusing existing P2 branch primitives.
- Add contextual navigation buttons to `RichIncomingPage` and `DraftCheckPage`.

## Decision (ADR-lite)

Context: The main PRD contains a broader Seeing / Being Seen practice that could include receiving being seen, seeing the other person, hard conversation checks, and listening micro-actions. Implementing all of that now risks turning the MVP into a relationship course or people-reading tool.

Decision: First build only the "being-seen evidence" side. The branch helps the user name observable evidence and calibrate what it can and cannot prove. It saves one discovery point and creates no account movement.

Consequences: This gives the app a concrete relationship-learning micro-skill while preserving room for later "seeing the other person" listening practice. Future account movement must still come from Quick Record or another source-owned evidence flow with explicit impact rules.

## Out of Scope

- Seeing-the-other-person practice, illuminator stance training, or hard-conversation two-layer check.
- People-reading, personality tests, partner psychological profile, empathy score, or relationship verdict.
- Treating being seen as proof of future commitment, compatibility, or safety.
- Forcing the user to keep listening/responding when capacity is low.
- Persisting a dedicated `SeeingPractice` model.
- Creating account impacts, drafts, anchors, episodes, or experiments from this branch.

## Technical Notes

- Main PRD reference: `.trellis/tasks/archive/2026-06/06-17-emotional-account-pwa/prd.md`, "P2 Seeing / Being Seen Branch" and "Flow 15: Seeing / Being Seen Practice".
- Research reference: `.trellis/tasks/archive/2026-06/06-17-emotional-account-pwa/research/seeing-and-being-seen-product-mapping.md`.
- Existing P2 branch patterns: `src/domain/empowermentShift.ts`, `src/routes/EmpowermentShiftPage.tsx`, `src/domain/selfCompassion.ts`, `src/routes/SelfCompassionPage.tsx`.
- Store contract: `actions.saveDiscoveryPoint(...)` must be the only durable write used by this branch.
