# P2 Self-Compassion Pause Branch

## Goal

Add a compact `/self-compassion` branch for shame, harsh self-talk, perfectionism, post-conflict self-attack, partial/not-suitable experiment outcomes, and moments when the user feels "too much" or "not enough". The branch should help the user see pain without over-identifying, remember common humanity, soften inner-critic language, choose one self-kindness action, and choose one responsible next action.

## Requirements

- Add a short optional route at `/self-compassion`.
- Keep the flow chip-first and low-cognitive:
  - Gate: self-compassion is not self-esteem scoring, forced positivity, or accountability bypass.
  - Mindfulness / 静观: name the pain.
  - Common humanity / 共通人性: select one reminder.
  - Inner critic rewrite: optional harsh sentence and caring-but-honest rewrite.
  - Self-kindness / 善待自己: select one conservative self-kindness action.
  - Responsible next action.
  - Completion summary.
- Save completion as one `DiscoveryPoint` with `theme: "self_care"` and `sourceType: "manual"`.
- Saving this branch must not create Connection, Self, or Energy impacts.
- Add contextual entry points:
  - Old Echo completion offers "自我关怀一下".
  - Draft Check offers "自我关怀一下" when old echo / inner judge / self-proving / over-explaining pressure is present.
  - Experiment detail offers "自我关怀一下" after partial, noticed-only, or not-suitable outcomes.
  - Return-To-Self completion offers "自我关怀一下" as a low-pressure follow-up.
- Use existing route/page/store patterns. No new persistence model.
- Show honest storage failure copy. Do not show success copy when save fails.

## Acceptance Criteria

- [x] `/self-compassion` is recognized by route normalization and renders after setup.
- [x] User can complete the branch and see a summary with pain, reminder, critic/rewrite, kindness action, and responsible next action.
- [x] User can save the summary as a self-care discovery point.
- [x] Saved discovery point uses self-care theme, manual source, readable Chinese note copy, and no account impacts.
- [x] Old Echo, Draft Check, Experiment Detail, and Return-To-Self expose contextual entry buttons without blocking existing actions.
- [x] `npm run typecheck`, `npm test`, `npm run build`, and `git diff --check` pass.

## Definition of Done

- Focused unit tests cover the domain helper and account-impact non-regression.
- Route helper tests include `/self-compassion`.
- The implementation stays local-first and single-device.
- No backend, login, sync, telemetry, AI call, push, direct `localStorage`, therapy claim, biological claim, self-worth/self-esteem score, trauma-source claim, or forced positivity is added.

## Technical Approach

- Create `src/domain/selfCompassion.ts` for typed chips, copy maps, summary construction, and `DiscoveryPointInput` construction.
- Create `src/domain/selfCompassion.test.ts` for pure behavior and no-account-impact regression.
- Create `src/routes/SelfCompassionPage.tsx` using `StepScreen`, `ChipGroup`, `CompletionCard`, `PageHeader`, and `useAppStore`.
- Add route plumbing in `src/App.tsx`, `src/utils/route.ts`, and `src/utils/route.test.ts`.
- Add lightweight CSS classes in `src/styles/screens.css`, reusing existing page/screen primitives.
- Add contextual navigation buttons to `OldEchoPage`, `DraftCheckPage`, `ExperimentDetailPage`, and `ReturnToSelfPage`.

## Decision (ADR-lite)

Context: Self-compassion is useful but P2. The app should support a short pause without becoming therapy, a meditation course, or another way to score the user's worth.

Decision: Implement the branch as a compact route that saves a structured `DiscoveryPoint` only.

Consequences: The pause can be reviewed later through Topics and can feed future practices, but it does not yet create direct account movement. That keeps the first version safe and avoids hidden scoring.

## Out of Scope

- Self-compassion score.
- Self-esteem, self-worth, attractiveness, lovability, or "am I enough" score.
- Biological claims such as cortisol, oxytocin, nervous-system rewiring, or guaranteed relief.
- Trauma treatment, parts therapy, inner-child healing, exposure therapy, or crisis workflow.
- Long meditation timer or course.
- Copy that uses self-compassion to skip accountability.

## Technical Notes

- Main PRD reference: `.trellis/tasks/archive/2026-06/06-17-emotional-account-pwa/prd.md`, "Self-Compassion Pause" and "Self-Compassion Pause Page-Level Flow".
- Research reference: `.trellis/tasks/archive/2026-06/06-17-emotional-account-pwa/research/self-compassion-product-mapping.md`.
- Existing P2 branch patterns: `src/domain/oldEcho.ts`, `src/routes/OldEchoPage.tsx`, `src/domain/boundaryClarity.ts`, `src/routes/BoundaryClarityPage.tsx`.
- Store contract: `actions.saveDiscoveryPoint(...)` must be the only durable write used by this branch.
