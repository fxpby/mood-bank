# P2 Old Echo / Inner Critic Branch

## Goal

Add a compact optional branch that helps users notice when a current trigger feels larger than the present event because an old echo or inner critic is active. The branch should support "觉察即看见" while staying non-diagnostic, light, and safe.

## Context

- The main PRD lists "Old echo / inner critic" as a P2 light branch.
- User emphasized that healing starts with seeing not only current behavior but also possible old wound activation, repeated awareness, practice during waves, and internal judge awareness.
- Existing P2 emotion calibration already includes `old_echo` as a signal and can save a discovery point.
- Existing draft self-check already includes "旧感觉被碰到" and "内部审判者很响" in its state check.
- P2 branches should be optional, chip-first, compact, save structured output, and never diagnose trauma source, object constancy, attachment type, self-worth, or the other person.

## Requirements

- Add an `OldEchoPage` route for a compact branch.
- Branch should include:
  - pacing gate with "轻轻看一下", "先回到自己", and no pressure to continue
  - present fact / mosquito input
  - touched need chips
  - protective program chips
  - optional inner critic text input
  - present-self response / next action chips
  - completion summary
- User can save the result as a discovery point.
- Save result should:
  - use existing `actions.saveDiscoveryPoint`
  - create no account impacts
  - use theme `old_echo`
  - avoid claiming the source is known or diagnosed
- User can route to Return-To-Self at gate and completion.
- User can route to Quick Record from completion.
- Add contextual entry points:
  - Emotion Calibration completion when signal is `old_echo`, emotion is shame, or impulse is control/over-explain/check/attack.
  - Draft Check recommendation when state is `old_echo` or `inner_judge`.
- Unknown or missing active space should show honest save error and no success copy.
- No backend, telemetry, AI calls, sync, push, direct storage, file IO, or browser API side effects.

## Acceptance Criteria

- [x] `/old-echo` normalizes and renders after setup.
- [x] Flow can move through gate, fact, need, protective program, optional critic, response, and completion.
- [x] Completion can save one discovery point with theme `old_echo`.
- [x] Save success/failure copy is honest.
- [x] Saving the branch creates no account impact.
- [x] Emotion Calibration links to the branch for old-echo/shame/high-risk impulse contexts.
- [x] Draft Check links to the branch when old echo or inner judge is selected.
- [x] Flow offers Return-To-Self and does not block other P0/P1 flows.
- [x] Copy avoids diagnosis, trauma-source determination, inner-parts treatment claims, self-worth scoring, and partner inference.
- [x] `npm run typecheck`, `npm test`, and `npm run build` pass.

## Out of Scope

- Persisting a dedicated `OldEchoCheck` model.
- Trauma source detection or childhood memory retrieval.
- Attachment diagnosis, object-constancy assessment, self-worth scoring, or relationship verdicts.
- IFS therapy, parts unburdening, exposure work, safety planning, or crisis support.
- Full P2 branch library.
- UI redesign or Figma parity work.

## Technical Notes

- Likely files:
  - `src/domain/oldEcho.ts`
  - `src/domain/oldEcho.test.ts`
  - `src/routes/OldEchoPage.tsx`
  - `src/routes/EmotionCalibrationPage.tsx`
  - `src/routes/DraftCheckPage.tsx`
  - `src/utils/route.ts` and tests
  - `src/App.tsx`
  - `src/styles/screens.css`
  - `.trellis/spec/frontend/state-management.md`
- Use existing `DiscoveryPoint` as structured output for this first P2 pass.
- Use `StepScreen`, `ChipGroup`, and `CompletionCard` primitives for consistency.
