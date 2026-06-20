# P2 Boundary Clarity Branch

## Goal

Add a compact P2 `/boundary-clarity` branch for moments involving guilt, resentment, anger, over-responsibility, rescuing, pressure to reply, fear of disappointing someone, or unclear limits. The branch should help the user separate boundary from control, split "mine / not mine", name one real limit or request, and choose one user-owned next action.

## Requirements

- Add a short, optional Boundary Clarity route at `/boundary-clarity`.
- Keep the flow chip-first and low-cognitive:
  - Gate: distinguish boundary from control and state that this is not legal/safety planning.
  - Boundary signal.
  - Responsibility split: one "mine" chip and one "not mine" chip.
  - Real limit/request with optional one-sentence text.
  - Boundary form.
  - Say-no / receive-no practice side.
  - User-owned next action.
  - Completion summary.
- Save completion as a `DiscoveryPoint` with `theme: "boundary"` and `sourceType: "manual"`.
- Saving this branch must not create Connection, Self, or Energy impacts.
- Add contextual entry points:
  - Draft Check recommendation `boundary_expression` shows "看看边界".
  - Emotion Calibration shows "看看边界" for boundary signal, anger, or boundary-sentence action.
  - Old Echo completion shows "看看边界" when the selected response is a boundary sentence.
- Use existing route/page/store patterns. No new persistence model.
- Show honest storage failure copy. Do not show success copy when save fails.

## Acceptance Criteria

- [ ] `/boundary-clarity` is recognized by route normalization and renders after setup.
- [ ] User can complete the branch and see a summary with signal, mine, not-mine, limit/request, form/practice, and next action.
- [ ] User can save the summary as a discovery point.
- [ ] Saved discovery point uses boundary theme, manual source, readable Chinese note copy, and no account impacts.
- [ ] Draft Check, Emotion Calibration, and Old Echo expose contextual entry buttons without blocking their existing actions.
- [ ] `npm run typecheck`, `npm test`, `npm run build`, and `git diff --check` pass.

## Definition of Done

- Focused unit tests cover the domain helper and account-impact non-regression.
- Route helper tests include `/boundary-clarity`.
- The implementation stays local-first and single-device.
- No backend, login, sync, telemetry, AI call, push, import/export, direct `localStorage`, relationship verdict, partner inference, attachment diagnosis, trauma-source claim, boundary score, or legal/safety plan is added.

## Technical Approach

- Create `src/domain/boundaryClarity.ts` for typed chips, copy maps, summary construction, and `DiscoveryPointInput` construction.
- Create `src/domain/boundaryClarity.test.ts` for pure behavior and no-account-impact regression.
- Create `src/routes/BoundaryClarityPage.tsx` using `StepScreen`, `ChipGroup`, `CompletionCard`, `PageHeader`, and `useAppStore`.
- Add route plumbing in `src/App.tsx`, `src/utils/route.ts`, and `src/utils/route.test.ts`.
- Add lightweight CSS classes in `src/styles/screens.css`, reusing existing page/screen primitives.
- Add contextual navigation buttons to `DraftCheckPage`, `EmotionCalibrationPage`, and `OldEchoPage`.

## Decision (ADR-lite)

Context: Boundary clarity is useful but P2. It should support reflection without creating a new durable model or implying that boundary work itself changes relationship connection.

Decision: Implement the branch as a short route that saves a compact structured `DiscoveryPoint` only.

Consequences: The feature can be reviewed later through Topics and can feed future experiments, but it cannot yet track completed boundary actions or account impacts. That avoids premature scoring and keeps the MVP safe.

## Out of Scope

- Boundary score.
- Long boundary scripts or courses.
- Legal advice, emergency support planning, domestic-violence planning, or danger assessment.
- Tactics for making another person respect a boundary.
- Punishment, ultimatum, testing, surveillance, or manipulation scripts.
- Claiming that a clear boundary guarantees connection.
- Any Connection impact from this branch.

## Technical Notes

- Main PRD reference: `.trellis/tasks/archive/2026-06/06-17-emotional-account-pwa/prd.md`, "Boundary Clarity Check" and "Boundary Clarity Page-Level Flow".
- Existing save-as-discovery-point patterns: `src/domain/oldEcho.ts`, `src/routes/OldEchoPage.tsx`, `src/domain/emotionCalibration.ts`, `src/routes/EmotionCalibrationPage.tsx`.
- Store contract: `actions.saveDiscoveryPoint(...)` must be the only durable write used by this branch.
