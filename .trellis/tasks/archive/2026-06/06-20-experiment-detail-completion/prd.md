# P1 Experiment Detail Completion

## Goal

Turn the lightweight `/experiments` personal-action menu into a fuller P1 small-practice loop: users can create one small practice, open `/experiments/:id`, and record an attempt as completed, partially done, noticed only, or not suitable. The feature should keep the existing "support yourself, not a task list" tone and avoid streaks, scores, reminders, or relationship-test framing.

## What I Already Know

- The broad PRD defines `/experiments` as P1 list/create and `/experiments/:id` as P1 detail/completion.
- Current `/experiments` is a route-local personal action menu; choosing/completing an action does not persist anything.
- `docs/figma-no-route-screens.md` records "小练习详情 - 动作闭环" as a no-route screen that maps to `/experiments/:id`.
- App state currently has `experiments: ReservedItem[]`; it can be upgraded to typed local practice data through validation normalization.
- Durable writes must go through `AppStoreContext` and `StorageAdapter`; no direct storage access in routes.
- The app remains local-first with no backend, telemetry, AI calls, login, sync, push, reminders, streaks, or analytics.

## Requirements

- Add a typed `PersonalExperiment` model for local practice ideas:
  - focus: what the user wants to practice
  - tinyAction: a small action that can be tried once today
  - completionMarker: what counts as one attempt
  - source: manual or personal action
  - attempts: local attempt records
- Add attempt outcomes:
  - completed
  - partial
  - noticed
  - not_suitable
- Keep all experiment data local in the existing app state.
- Update `/experiments` so users can:
  - see existing small practices newest first
  - create a small practice in three short fields
  - create from one recommended personal action with minimal choice load
  - open `/experiments/:id`
- Add `/experiments/:id` detail so users can:
  - see practice intention, tiny action, and completion marker
  - record one attempt with an outcome and optional note
  - see recent attempts
  - go to Quick Record with a prefill if they want to reflect more
  - route to Return-To-Self when needed
- Unknown experiment ids should show a recoverable empty state.
- Saving failures must not show success copy.
- Creating an experiment should not create account impacts.
- Recording an attempt may create transparent Self/Energy impacts only for completed/partial/noticed outcomes; not-suitable should not be treated as failure or negative score.

## Acceptance Criteria

- [x] `/experiments` lists saved small practices and can create a new practice.
- [x] `/experiments` can create a practice from a recommended personal action.
- [x] `/experiments/:id` is normalized, refresh-safe, and renders the selected practice.
- [x] Unknown `/experiments/:id` shows a recoverable empty state and no writes.
- [x] Detail page can record completed, partial, noticed, and not-suitable attempts.
- [x] Attempts persist locally and appear newest first on the detail page.
- [x] Save failures show honest error copy and do not show success copy.
- [x] Creating a practice creates no account impacts.
- [x] Attempt impacts are transparent and limited to Self/Energy where appropriate.
- [x] No streak, reminder, due-date, score, reward, productivity shame, or partner-behavior framing appears.
- [x] No backend, telemetry, AI calls, login, sync, push, or direct storage access is introduced.
- [x] `npm run typecheck`, `npm test`, and `npm run build` pass.

## Out of Scope

- Calendar reminders, push notifications, streaks, analytics, achievement systems, or gamified rewards.
- Multi-device sync, export/import, backend storage, encryption migration, or IndexedDB migration.
- Topic-to-experiment conversion from topic detail.
- Editing/deleting experiments or attempts.
- Figma 1:1 UI redesign.
- Full P2 practice library/course system.

## Technical Notes

- Likely files:
  - `src/domain/types.ts`
  - `src/domain/defaults.ts`
  - `src/domain/validation.ts`
  - `src/domain/personalActions.ts`
  - new `src/domain/experiments.ts`
  - new `src/domain/experiments.test.ts`
  - `src/store/AppStoreContext.tsx`
  - `src/utils/route.ts` and tests
  - `src/routes/ExperimentsPage.tsx`
  - new `src/routes/ExperimentDetailPage.tsx`
  - `src/styles/screens.css`
- Existing personal action recommendation can seed experiments; preserve one recommendation plus at most two alternatives.
- Use route helpers like existing record/topic dynamic routes: `buildExperimentRoute(id)` and `getExperimentRouteId(pathname)`.
- Validation should normalize legacy `ReservedItem[]` experiments into readable `PersonalExperiment` records where possible.
