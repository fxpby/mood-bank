# P2 Connection Continuity Branch

## Goal

Add a compact optional `/connection-continuity` branch for moments when connection, care, or self-contact feels like it disappeared under silence, ambiguity, delay, conflict, warmth-afterglow, or distance. The branch should help users separate felt connection collapse from observable facts without diagnosing attachment style, object constancy, relationship permanence, or the other person.

## Requirements

- Add a short optional route at `/connection-continuity`.
- Keep the flow chip-first and low-cognitive:
  - Gate: "连接感现在很响"; this is not a relationship verdict.
  - Felt state: connection still exists but feels farther away, feels gone, wants confirmation, wants to cut off, push-pull, self-disconnected, or not sure.
  - Evidence split:
    - optional short input for facts that show connection/self-contact has existed.
    - optional short input for what the current moment still cannot prove.
  - User-owned next action: delay 10 minutes, look at one saved warm evidence, write facts not conclusions, return to self, save later topic, or close.
  - Completion summary.
- Save completion as one `DiscoveryPoint` with `theme: "relationship_learning"` and `sourceType: "manual"`.
- Saving this branch must not create Connection, Self, or Energy impacts.
- Add contextual entry points:
  - Signal Check completion offers "看连接感" when checking target/reaction suggests cold connection, ignored, send again, future certainty, anxiety easing, connection-gone, cut-off, refreshing, or over-explaining.
  - Draft Check completion offers "看连接感" when state/motivation/tolerance/after-send suggests connection alarm, hope response, ease anxiety, send more, checking, watch reply, rumination, or collapse.
  - Emotion Calibration completion offers "看连接感" when signal/impulse suggests care-loss, need safety, vulnerability, control, check repeat, over-explain, withdraw, or freeze.
  - Healthy Love completion offers "看连接感" when the user wants attachment certainty, control, or a pause.
- Use existing route/page/store patterns. No new persistence model.
- Show honest storage failure copy. Do not show success copy when save fails.

## Acceptance Criteria

- [x] `/connection-continuity` is recognized by route normalization and renders after setup.
- [x] User can complete the branch and see a summary with felt state, evidence-that-existed, cannot-prove line, next action, and calibration reminder.
- [x] User can save the summary as a relationship-learning discovery point.
- [x] Saved discovery point uses manual source, readable Chinese note copy, and no account impacts.
- [x] Signal Check, Draft Check, Emotion Calibration, and Healthy Love expose contextual entry buttons without blocking existing actions.
- [x] `npm run typecheck`, `npm test`, `npm run build`, and `git diff --check` pass.

## Definition of Done

- Focused unit tests cover the domain helper and account-impact non-regression.
- Route helper tests include `/connection-continuity`.
- The implementation stays local-first and single-device.
- No backend, login, sync, telemetry, AI call, push, direct `localStorage`, attachment diagnosis, object-constancy score, connection permanence score, relationship verdict, or stay/leave advice is added.

## Technical Approach

- Create `src/domain/connectionContinuity.ts` for typed chips, copy maps, summary construction, and `DiscoveryPointInput` construction.
- Create `src/domain/connectionContinuity.test.ts` for pure behavior and no-account-impact regression.
- Create `src/routes/ConnectionContinuityPage.tsx` using `StepScreen`, `ChipGroup`, `CompletionCard`, `PageHeader`, and `useAppStore`.
- Add route plumbing in `src/App.tsx`, `src/utils/route.ts`, and `src/utils/route.test.ts`.
- Add lightweight CSS classes in `src/styles/screens.css`, reusing existing P2 branch primitives.
- Add contextual navigation buttons to `SignalCheckPage`, `DraftCheckPage`, `EmotionCalibrationPage`, and `HealthyLovePage`.

## Decision (ADR-lite)

Context: The main PRD and attachment-continuity research describe object-constancy instability as a product need, but clinical labels and stable attachment typing would be unsafe and too heavy for MVP.

Decision: Implement only moment-level connection-continuity awareness. The branch asks what the connection feels like now, separates remembered facts from what the present moment cannot prove, and chooses one stabilizing action. It saves one discovery point and creates no account movement.

Consequences: Users can preserve the important "connection feels gone" insight without the app diagnosing them or making relationship claims. Future tasks can link saved warm evidence or anchors more directly, but this task only saves the reflection.

## Out of Scope

- Attachment style labels or diagnosis.
- Object constancy score, connection permanence score, or relationship health score.
- Claims that connection is definitely safe, gone, permanent, or doomed.
- Partner intent inference, read-receipt/online-status monitoring, or response-speed interpretation.
- Advice about whether to stay, leave, confront, chase, withdraw, or test.
- Persisting a dedicated `ConnectionContinuityCheck` model.
- Creating account impacts, episodes, drafts, anchors, experiments, or partner-behavior exchanges from this branch.

## Technical Notes

- Main PRD reference: `.trellis/tasks/archive/2026-06/06-17-emotional-account-pwa/prd.md`, "Connection Continuity And Object Constancy Awareness" and "P2 Connection-Continuity Branch".
- Research reference: `.trellis/tasks/archive/2026-06/06-17-emotional-account-pwa/research/attachment-continuity-awareness.md`.
- Existing P2 branch patterns: `src/domain/healthyLove.ts`, `src/routes/HealthyLovePage.tsx`, `src/domain/seeingEvidence.ts`, `src/routes/SeeingEvidencePage.tsx`, `src/domain/emotionCalibration.ts`, `src/routes/EmotionCalibrationPage.tsx`.
- Store contract: `actions.saveDiscoveryPoint(...)` must be the only durable write used by this branch.
