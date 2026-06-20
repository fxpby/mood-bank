# P2 Empowerment Shift Branch

## Goal

Add a compact optional `/empowerment-shift` branch that helps the user notice a drama-triangle stance and move toward an empowered stance: Victim -> Creator, Rescuer -> 引导者, Persecutor -> Challenger. The branch should restore a small sense of owned choice without diagnosing the user, labeling the other person, or bypassing hurt.

## Requirements

- Add a short optional route at `/empowerment-shift`.
- Keep the flow chip-first and low-cognitive:
  - Gate: "只看姿态，不给自己贴标签".
  - Current stance: powerless / rescuing / attacking-control / not sure.
  - Empowered shift: Creator / 引导者 / Challenger, with the recommended target derived from the current stance.
  - One sentence prompt for the selected empowered stance.
  - One user-owned next action.
  - Completion summary.
- Save completion as one `DiscoveryPoint` with `theme: "action_experiment"` and `sourceType: "manual"`.
- Saving this branch must not create Connection, Self, or Energy impacts in this first build.
- Add contextual entry point:
  - Draft Check completion offers "换到赋能三角" when stance is `victim`, `rescuer`, or `persecutor`.
- Use "引导者", not "教练".
- Use existing route/page/store patterns. No new persistence model.
- Show honest storage failure copy. Do not show success copy when save fails.

## Acceptance Criteria

- [ ] `/empowerment-shift` is recognized by route normalization and renders after setup.
- [ ] User can complete the branch and see a summary with current stance, empowered stance, prompt response, and owned next action.
- [ ] User can save the summary as an action-experiment discovery point.
- [ ] Saved discovery point uses manual source, readable Chinese note copy, and no account impacts.
- [ ] Draft Check exposes the contextual entry only for drama-triangle stances.
- [ ] `npm run typecheck`, `npm test`, `npm run build`, and `git diff --check` pass.

## Definition of Done

- Focused unit tests cover the domain helper and account-impact non-regression.
- Route helper tests include `/empowerment-shift`.
- The implementation stays local-first and single-device.
- No backend, login, sync, telemetry, AI call, push, direct `localStorage`, partner labeling, attachment diagnosis, trauma-source claim, self-worth score, or relationship verdict is added.

## Technical Approach

- Create `src/domain/empowermentShift.ts` for typed chips, copy maps, summary construction, and `DiscoveryPointInput` construction.
- Create `src/domain/empowermentShift.test.ts` for pure behavior and no-account-impact regression.
- Create `src/routes/EmpowermentShiftPage.tsx` using `StepScreen`, `ChipGroup`, `CompletionCard`, `PageHeader`, and `useAppStore`.
- Add route plumbing in `src/App.tsx`, `src/utils/route.ts`, and `src/utils/route.test.ts`.
- Add lightweight CSS classes in `src/styles/screens.css`, reusing existing P2 branch primitives.
- Add contextual navigation button to `DraftCheckPage`.

## Decision (ADR-lite)

Context: The main PRD describes TED as a way to move from drama-triangle positions toward more agency. Earlier notes allowed Self +1 for completing an empowerment shift, but current P2 branch contracts prefer no account movement unless the impact rule is explicit and transparent.

Decision: Implement this as a compact route that saves a structured `DiscoveryPoint` only. It does not directly move any storage jar.

Consequences: The shift can be reviewed later through Topics and can inspire future experiments, but it does not create hidden scoring for insight or agency. A future PRD can add transparent Self-account movement if the product needs it.

## Out of Scope

- Labeling the other person as Victim, Rescuer, or Persecutor.
- Diagnosing the user's personality, attachment style, trauma source, self-worth, or relationship health.
- Turning empowerment into blame, forced positivity, or pressure to forgive.
- Persisting a dedicated empowerment model.
- Creating account impacts, streaks, rewards, or partner-behavior exchanges.
- Generating, copying, or sending messages.

## Technical Notes

- Main PRD reference: `.trellis/tasks/archive/2026-06/06-17-emotional-account-pwa/prd.md`, "Empowerment Shift" and "P2 Empowerment Shift Branch".
- Existing P2 branch patterns: `src/domain/oldEcho.ts`, `src/routes/OldEchoPage.tsx`, `src/domain/boundaryClarity.ts`, `src/routes/BoundaryClarityPage.tsx`, `src/domain/selfCompassion.ts`, `src/routes/SelfCompassionPage.tsx`.
- Store contract: `actions.saveDiscoveryPoint(...)` must be the only durable write used by this branch.
