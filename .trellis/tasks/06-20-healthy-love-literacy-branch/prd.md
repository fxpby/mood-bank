# P2 Healthy Love Literacy Branch

## Goal

Add a compact optional `/healthy-love` branch that helps the user distinguish care, attachment alarm, control, novelty chasing, repair, boundary needs, and ordinary care in one concrete relationship moment. The branch should support learning how to love and be loved without becoming a course, compatibility test, partner scorecard, or stay/leave advisor.

## Requirements

- Add a short optional route at `/healthy-love`.
- Keep the flow chip-first and low-cognitive:
  - Gate: "这可能是学习怎么爱/被爱的一刻"; only this moment, no verdict on the relationship.
  - Moment phase: attraction/resonance, disillusionment/difference seen, self-reflection, repair/negotiation, integration/insight, ordinary care/maintenance, or not sure.
  - Leaning/motivation: care/concern, attachment alarm, controlling outcome, novelty chasing, repair, boundary need, ordinary care, or not sure.
  - Optional one-sentence note: "这一刻我真正想要/害怕/练习的是..."
  - Freedom-preserving action: pause, ask one honest question, name one boundary, receive warmth without escalating, let topic wait, repair my part, one self-care action while still caring, or save later.
  - Completion summary.
- Save completion as one `DiscoveryPoint` with `theme: "relationship_learning"` and `sourceType: "manual"`.
- Saving this branch must not create Connection, Self, or Energy impacts.
- Add contextual entry points:
  - Draft Check completion offers "学习怎么爱/被爱" when motivation, recommendation, or risk suggests repair, boundary, anxious certainty-seeking, proving self, rescuing, attacking, or over-explaining.
  - Rich Incoming completion offers "学习怎么爱/被爱" when received shape or emotion suggests warmth, being seen, mutual care, values, or meaningful connection.
  - Emotion Calibration completion offers "学习怎么爱/被爱" when the calibrated emotion signal involves loss/care, vulnerability, values, or impulses toward control, rescue, or over-explaining.
  - Boundary Clarity completion offers "学习怎么爱/被爱" after the summary as a non-blocking adjacent branch.
- Use existing route/page/store patterns. No new persistence model.
- Show honest storage failure copy. Do not show success copy when save fails.

## Acceptance Criteria

- [ ] `/healthy-love` is recognized by route normalization and renders after setup.
- [ ] User can complete the branch and see a summary with moment phase, leaning/motivation, optional note, freedom-preserving action, and calibration reminder.
- [ ] User can save the summary as a relationship-learning discovery point.
- [ ] Saved discovery point uses manual source, readable Chinese note copy, and no account impacts.
- [ ] Draft Check, Rich Incoming, Emotion Calibration, and Boundary Clarity expose contextual entry buttons without blocking existing actions.
- [ ] `npm run typecheck`, `npm test`, `npm run build`, and `git diff --check` pass.

## Definition of Done

- Focused unit tests cover the domain helper and account-impact non-regression.
- Route helper tests include `/healthy-love`.
- The implementation stays local-first and single-device.
- No backend, login, sync, telemetry, AI call, push, direct `localStorage`, true-love test, compatibility score, partner green/red flag score, attachment diagnosis, relationship verdict, or stay/leave advice is added.

## Technical Approach

- Create `src/domain/healthyLove.ts` for typed chips, copy maps, summary construction, and `DiscoveryPointInput` construction.
- Create `src/domain/healthyLove.test.ts` for pure behavior and no-account-impact regression.
- Create `src/routes/HealthyLovePage.tsx` using `StepScreen`, `ChipGroup`, `CompletionCard`, `PageHeader`, and `useAppStore`.
- Add route plumbing in `src/App.tsx`, `src/utils/route.ts`, and `src/utils/route.test.ts`.
- Add lightweight CSS classes in `src/styles/screens.css`, reusing existing P2 branch primitives.
- Add contextual navigation buttons to `DraftCheckPage`, `RichIncomingPage`, `EmotionCalibrationPage`, and `BoundaryClarityPage`.

## Decision (ADR-lite)

Context: The main PRD and love-related research describe a broad relationship-learning area: love versus attachment, control, novelty, phase awareness, repair literacy, care literacy, and growth signals. Implementing all of that now would turn the MVP into a course or relationship judgment engine.

Decision: First build only a compact moment-level literacy calibration. It names the current phase and leaning, then asks for one freedom-preserving action. The output is one discovery point and no account movement.

Consequences: The app gains a useful relationship-learning micro-skill while avoiding premature scoring or advice. Future tasks can connect repeated discovery points to experiments or richer education, but this task only preserves the insight for later review.

## Out of Scope

- True-love tests, compatibility scores, partner green/red flag scoring, or relationship health scoring.
- Advice about whether to stay, leave, forgive, confront, or keep repairing.
- Deterministic relationship-stage doctrine.
- Claiming novelty loss, conflict, or disillusionment means love is gone.
- Pressuring the user to repair when boundary, rest, outside support, or waiting is more appropriate.
- Diagnosing the user's or partner's attachment style.
- Persisting a dedicated `RelationshipLearningCheck` model.
- Creating account impacts, episodes, drafts, anchors, experiments, or partner-behavior exchanges from this branch.

## Technical Notes

- Main PRD reference: `.trellis/tasks/archive/2026-06/06-17-emotional-account-pwa/prd.md`, "Healthy Love And Repair Literacy" and "P2 Healthy Love Literacy Branch".
- Research reference: `.trellis/tasks/archive/2026-06/06-17-emotional-account-pwa/research/love-better-product-mapping.md`.
- Existing P2 branch patterns: `src/domain/seeingEvidence.ts`, `src/routes/SeeingEvidencePage.tsx`, `src/domain/empowermentShift.ts`, `src/routes/EmpowermentShiftPage.tsx`, `src/domain/boundaryClarity.ts`, `src/routes/BoundaryClarityPage.tsx`.
- Store contract: `actions.saveDiscoveryPoint(...)` must be the only durable write used by this branch.
