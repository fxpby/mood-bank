# Account Detail Personal Action Completion

## Goal

Close the Account Detail personal action loop so a user can choose one small support action and explicitly mark it as done from the account detail page. Choosing alone remains no-impact; only explicit completion creates a transparent small-practice attempt using the existing experiment rules.

## What I Already Know

- The main PRD backlog says to close the Account Detail personal action completion loop or explicitly keep it non-persistent.
- `AccountDetailPage` currently shows one recommended action plus alternatives, but selection is route-local only.
- `/experiments` already supports saving a selected personal action as a `PersonalExperiment`.
- `/experiments/:id` already records attempts and applies transparent Self/Energy impacts:
  - completed: Self +1 and Energy +1
  - partial: Self +1
  - noticed: Self +1
  - not suitable: no impact
- The spec says choosing a personal action creates no account impact; only completion can create a small Self or Energy signal.
- Durable writes must go through `AppStoreContext`; no route-level browser storage.

## Product Decision

Use the existing experiment model instead of inventing a separate persisted "intention" model. When a user taps "完成一点" from Account Detail:

1. Create a small practice from the selected action with `source: "personal_action"` and `sourceActionId`.
2. Immediately record one `completed` attempt on that new practice.
3. Show honest success copy and a link to the new practice detail.

This gives the action a real source-owned record while avoiding a new model, streaks, balances, or reward-store framing.

## Requirements

- Account Detail personal action menu still shows at most one recommendation plus two alternatives.
- Selecting an action changes route-local state only; no durable write and no account impact.
- After selection, show actions:
  - "完成一点" to create a small practice and completed attempt.
  - "存成小练习" to create the practice without an attempt.
  - "记录一下" to open Quick Record with a prefill.
  - "换一个" to clear selection.
- Completion must:
  - call `actions.savePersonalExperiment(...)`.
  - then call `actions.savePersonalExperimentAttempt(...)` only after the experiment save succeeds.
  - show success copy only when both writes succeed.
  - route/link to `/experiments/:id`.
- Save-as-practice must create no account impacts.
- Completed action must create only existing experiment attempt impacts; no Connection impact.
- Storage failure must show honest error copy and must not claim the action was saved/completed.
- Keep copy warm and non-transactional. Do not use "兑换", "消费", "余额不足", streak, reward, debt, or task-failure language.

## Acceptance Criteria

- [ ] Account Detail still supports choosing/refeshing/skipping a personal action without durable impact.
- [ ] Selected action can be saved as a small practice and opens the created practice detail.
- [ ] Selected action can be marked completed, creating a practice and one completed attempt.
- [ ] Completed action creates transparent Self/Energy impact via existing experiment attempt rules and never creates Connection impact.
- [ ] Failure in either write path shows honest error copy and does not show completion success.
- [ ] User can open Quick Record with a selected-action prefill.
- [ ] `npm run typecheck`, `npm test`, and `npm run build` pass.

## Definition Of Done

- Domain/helper tests cover personal-action experiment input and completed-action impact behavior.
- README and main PRD status matrix are updated.
- `.trellis/spec/frontend/state-management.md` records that Account Detail completion uses the experiment model, not a new intention model.

## Out Of Scope

- A standalone persisted intention model.
- Editing, pausing, retiring, or deleting experiments.
- Partial/noticed/not-suitable outcome selection directly on Account Detail; those remain available on experiment detail.
- Completing partner-facing behavior, relationship tasks, apology extraction, or reassurance-seeking loops.
- Connection impact from Account Detail personal action completion.
- Streaks, due dates, reminders, reward store, or redemption mechanics.

## Technical Notes

- Likely files:
  - `src/domain/personalActions.ts`
  - `src/domain/personalActions.test.ts`
  - `src/routes/AccountDetailPage.tsx`
  - `src/styles/screens.css`
  - `README.md`
  - `.trellis/spec/frontend/state-management.md`
  - `.trellis/tasks/archive/2026-06/06-17-emotional-account-pwa/prd.md`
- Reuse `buildPersonalActionQuickRecordPrefill(...)`.
- Add a helper for creating `PersonalExperimentInput` from a `PersonalAction`.
- Use `buildExperimentRoute(...)` for navigation after save.
