# Experiment Lifecycle Controls

## Goal

Add lightweight lifecycle controls to small practices so a user can keep a practice as an idea, keep it active, pause it, retire it, edit its three core sentences, or save learning from it as a discovery point. The goal is to reduce clutter and pressure without adding streaks, due dates, reminders, rewards, or failure language.

## What I Already Know

- Main PRD backlog recommends adding experiment pause / retire / edit / save-as-idea controls without streaks or penalties.
- Current `PersonalExperiment` stores only `focus`, `tinyAction`, `completionMarker`, source metadata, attempts, and timestamps.
- `/experiments` creates manual or personal-action practices and lists all saved practices newest-first.
- `/experiments/:id` records attempts and applies existing transparent Self/Energy impacts.
- Creating or editing a practice must not create account impacts.
- Attempts remain the only experiment path that can create Self/Energy impacts.
- Durable writes must go through `AppStoreContext`.
- Storage failure copy must be honest.

## Product Decision

Use a small `status` field on `PersonalExperiment`:

- `idea`: saved for later, not currently being practiced.
- `active`: available for recording attempts.
- `paused`: intentionally resting; no penalty and can be resumed.
- `retired`: no longer needed; still readable with history.

Do not add a separate archive model, reminder model, streak model, or deletion flow in this task.

## Requirements

- New experiments default to `active` unless explicitly saved as `idea`.
- Existing stored experiments without `status` validate as `active`.
- Experiments list should show status labels and allow filtering by active / ideas / paused / retired / all, with active first by default.
- Experiment detail should allow:
  - editing `focus`, `tinyAction`, and `completionMarker`.
  - changing status to idea / active / paused / retired with no account impact.
  - saving the current learning as a discovery point.
- Paused, idea, and retired practices must not create negative impacts, penalties, missed-day states, or overdue copy.
- Retired practices remain readable with attempts; they are not deleted.
- Recording an attempt should remain available for active practices. For non-active practices, UI should nudge the user to resume first instead of silently recording.
- Saving a discovery point from a practice should use `theme: "action_experiment"`, `kind: "discovery"` or `action_idea`, and should not create account impacts.
- All writes must go through `AppStoreContext` actions.
- Failed writes must not show success copy.

## Acceptance Criteria

- [x] `PersonalExperiment` has a typed lifecycle status and validation defaults legacy records to active.
- [x] Manual practice creation can save as active or idea.
- [x] Experiments list shows and filters lifecycle statuses without hiding history permanently.
- [x] Experiment detail can edit the three core sentences and status.
- [x] Experiment detail can save one discovery point from practice learning without account impact.
- [x] Recording attempts still uses existing attempt rules and never creates Connection impact.
- [x] Non-active practices do not imply failure, streak loss, debt, or overdue states.
- [x] Storage failures show honest error copy.
- [x] `npm run typecheck`, `npm test`, `npm run build`, and `git diff --check` pass.

## Definition Of Done

- Domain helpers and validation tests cover lifecycle status, edit, status update, and discovery-point conversion.
- Store actions expose edit/status/discovery-point writes through `AppStoreContext`.
- Experiment list/detail UI is updated with low-pressure copy.
- README and main PRD status/backlog are updated.
- `.trellis/spec/frontend/state-management.md` records lifecycle semantics.

## Out Of Scope

- Deleting experiments.
- Due dates, reminders, streaks, completion rates, penalties, or missed-day copy.
- Reward store or partner-facing rewards.
- Multi-step archive management.
- Editing past attempts or account impacts.
- Changing existing attempt impact rules.
- Backend, sync, login, telemetry, or AI-generated experiment advice.

## Technical Notes

Likely files:

- `src/domain/types.ts`
- `src/domain/validation.ts`
- `src/domain/validation.test.ts`
- `src/domain/experiments.ts`
- `src/domain/experiments.test.ts`
- `src/store/AppStoreContext.tsx`
- `src/routes/ExperimentsPage.tsx`
- `src/routes/ExperimentDetailPage.tsx`
- `src/styles/screens.css`
- `README.md`
- `.trellis/spec/frontend/state-management.md`
- `.trellis/tasks/archive/2026-06/06-17-emotional-account-pwa/prd.md`

Implementation should prefer small pure helpers in `src/domain/experiments.ts`:

- `updateExperimentInState(...)` or specific edit/status helpers.
- `buildExperimentDiscoveryPointInput(...)`.
- `getExperimentsByLifecycle(...)` or status copy constants if needed.
