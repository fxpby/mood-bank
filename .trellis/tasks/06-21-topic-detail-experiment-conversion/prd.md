# Topic Detail To Small Practice Conversion

## Goal

Add a small, low-pressure path from a saved discovery point to a saved small practice. This closes the current P1/P2 backlog gap where `/topics/:id` can be reviewed and anchored, but cannot yet turn a useful insight into one tiny experiment.

## What I Already Know

- README currently says discovery point detail cannot directly turn into a small practice.
- The main PRD backlog recommends Topic Detail -> Small Practice conversion after shared safety copy.
- `/topics/:id` already shows source context, detail rows, review note, anchor save, and status actions.
- `/experiments` and `/experiments/:id` already support creating and completing `PersonalExperiment` records.
- `actions.savePersonalExperiment(...)` already creates a local experiment with no account impacts on creation.
- Durable writes must stay behind `AppStoreContext`; route code must not access browser storage directly.

## Requirements

- Add a "转成小练习" section to `/topics/:id`.
- Prefill three editable fields from the discovery point:
  - focus: what this point suggests practicing.
  - tinyAction: one small action that can be tried once.
  - completionMarker: what counts as trying once.
- Let the user edit all three fields before saving.
- Save through `actions.savePersonalExperiment(...)`.
- On save success, navigate to `/experiments/:id` for the created practice.
- Show honest error copy if saving fails; do not show success/navigate when save fails.
- Creating the experiment must not change Connection, Self, or Energy summaries.
- Preserve existing topic detail review note, anchor save, source context, and status behavior.
- Record the experiment source as `discovery_point` with `sourceActionId` set to the discovery point id.

## Acceptance Criteria

- [ ] `/topics/:id` shows a low-pressure conversion section for an existing discovery point.
- [ ] The conversion section has editable focus, tiny action, and completion marker fields.
- [ ] Saving creates one `PersonalExperiment` and routes to `/experiments/:id`.
- [ ] Save failure shows honest error copy and does not navigate.
- [ ] Creating from a discovery point creates no account impacts.
- [ ] Experiment source supports `discovery_point` and old stored values still validate.
- [ ] Unknown topic ids still show the existing recoverable empty state and no writes.
- [ ] `npm run typecheck`, `npm test`, and `npm run build` pass.

## Definition Of Done

- Focused domain tests cover building a discovery-point-sourced experiment and no-impact creation.
- Route copy keeps the same "小练习 / 支持自己的小动作" tone and avoids task debt.
- No backend, login, sync, telemetry, AI calls, file import/export, reminders, streaks, due dates, or direct `localStorage` access is introduced.

## Out Of Scope

- Editing, pausing, retiring, or deleting experiments.
- Back-linking experiments into the source discovery point.
- Automatically marking the discovery point reviewed after conversion.
- Generating suggested actions with AI.
- Creating account impacts on experiment creation.
- Turning topic conversion into a task backlog, due date, or productivity workflow.

## Technical Notes

- Likely files:
  - `src/domain/types.ts`
  - `src/domain/validation.ts`
  - `src/domain/experiments.ts`
  - `src/domain/experiments.test.ts`
  - `src/routes/TopicDetailPage.tsx`
  - `src/styles/screens.css`
  - `README.md`
- Use existing `buildExperimentRoute(...)` for navigation.
- Source field currently supports `manual | personal_action`; extend to `manual | personal_action | discovery_point`.
- `sourceActionId` can carry the discovery point id without a new persisted link field.
