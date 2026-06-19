# prefill quick record from personal action

## Goal

When a user completes one Personal Action on `/experiments`, tapping `记录一下` should open Quick Record with the completed action already carried in. This reduces retyping and preserves the user's just-finished self-support action as an optional source record.

## What I Already Know

- `/experiments` currently keeps Personal Action selection and completion route-local.
- Quick Record already supports typed route-state prefill through `quickRecordPrefill`.
- Trigger Support already uses the same route-state mechanism to send a `QuickRecordPrefill` into `/record/new`.
- The prior Personal Action Menu scope explicitly excludes a durable `PersonalAction` / `Experiment` model for now.

## Requirements

- Add a pure helper that maps a completed `PersonalAction` into `QuickRecordPrefill`.
- The prefill must include a short title and factual text describing the completed action.
- The prefill must not create a durable experiment record by itself.
- The prefill must avoid automatically choosing an account-impacting next action; the user can still edit the Quick Record form before saving.
- `/experiments` `记录一下` must navigate to `/record/new` with the generated prefill.
- Existing route-local selection/completion behavior must remain unchanged.

## Acceptance Criteria

- [ ] Completing an action and tapping `记录一下` opens Quick Record with a prefilled title and facts.
- [ ] The prefill uses the existing `quickRecordPrefill` route-state shape.
- [ ] No new localStorage access, network calls, telemetry, backend, login, sync, or push behavior is added.
- [ ] No durable Personal Action / Experiment persistence model is introduced.
- [ ] Unit tests cover the Personal Action -> Quick Record prefill helper.
- [ ] `npm run typecheck`, `npm test`, and `npm run build` pass.

## Out Of Scope

- Persisting selected Personal Actions.
- Creating experiment history, streaks, rewards, or completion counters.
- Adding new account-impact rules for Personal Actions.
- Saving topics or anchors directly from `/experiments`.

## Technical Notes

- Likely files:
  - `src/domain/personalActions.ts`
  - `src/domain/personalActions.test.ts`
  - `src/routes/ExperimentsPage.tsx`
- Applicable specs:
  - `.trellis/spec/frontend/index.md`
  - `.trellis/spec/frontend/component-guidelines.md`
  - `.trellis/spec/frontend/state-management.md`
  - `.trellis/spec/frontend/type-safety.md`
  - `.trellis/spec/frontend/quality-guidelines.md`
  - `.trellis/spec/guides/index.md`
