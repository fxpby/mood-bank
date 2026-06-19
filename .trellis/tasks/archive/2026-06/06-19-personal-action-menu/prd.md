# P1 Personal Action Menu

## Goal

Replace the `/experiments` placeholder with a lightweight "取一个支持自己的小动作" page. The page should help a user choose one tiny self-owned action without turning care into a task list, streak, reward system, or relationship test.

## What I Already Know

* Bottom navigation already has `练习` pointing to `/experiments`, but the route currently falls through to `PlaceholderPage`.
* Account detail pages already include a local-only personal action menu with one recommended action and two alternatives.
* The full PRD defines Personal Action Menu and Experiments as P1 support loops:
  * Personal action menu: one recommended card, at most two alternatives, "换一个", "稍后".
  * Choosing action copy: "已放进今天的小动作".
  * Completion copy: "完成一点就算。不是为了表现，是为了把自己带回来。"
  * Experiments should avoid streaks, missed-day copy, task pressure, and relationship-test framing.
* App state currently only has reserved arrays for `experiments` and `personalActions`; no durable action model exists yet.

## Assumptions

* This increment should implement a useful lightweight page, not the full experiment creation/completion model.
* Choosing or completing an action is route-local only in this task. No persisted data, account impacts, streaks, reminders, or completion history.
* The page can reuse the existing account-detail action-menu visual pattern and copy constraints.
* Because the user previously emphasized choice difficulty, the page should show one recommended action and at most two alternatives at a time.

## Requirements

* Replace `/experiments` placeholder with a real `ExperimentsPage` route.
* Page title: `取一个支持自己的小动作` or equivalent.
* Keep bottom nav label `练习`.
* Show a small "today context" section derived from existing state:
  * today's market label or note
  * optionally active space name
  * no diagnosis or score
* Show one recommended action and at most two alternatives.
* Provide `换一个` to rotate to another small set of actions.
* Provide `稍后` or `先回首页` without shame.
* When user chooses an action:
  * show copy `已放进今天的小动作：...`
  * show action helper
  * offer `完成一点` and `换一个`
* When user taps `完成一点`:
  * show completion copy: `完成一点就算。不是为了表现，是为了把自己带回来。`
  * offer `回到自己`, `记录一下`, and `完成`
* Action library should be deterministic and local, with categories that match existing product language:
  * lower activation
  * self-kindness / inner judge
  * boundaries
  * expression
  * receiving care
  * delayed checking / draft before sending
* Selection and completion must not persist data or create account impacts in this increment.
* The page must not include:
  * streaks
  * due dates
  * rewards that imply partner behavior
  * scores
  * missed-day or productivity/task shame
  * AI recommendations or network behavior

## Acceptance Criteria

* [ ] `/experiments` opens a real page instead of placeholder copy.
* [ ] User sees one recommended action and no more than two alternatives.
* [ ] User can choose an action and see "已放进今天的小动作".
* [ ] User can tap "完成一点" and see completion copy.
* [ ] User can rotate actions with "换一个".
* [ ] User can route to Return-To-Self and Quick Record from completion.
* [ ] Completing or choosing an action creates no persisted data and no account impacts.
* [ ] No streak, reward, due-date, score, or task-shame language appears.
* [ ] `npm run typecheck`, `npm test`, and `npm run build` pass.

## Definition Of Done

* Focused domain test covers deterministic recommendation/set rotation and no account-summary change if state is unchanged.
* Browser verification covers `/experiments`, choose action, complete action, rotate action, Return-To-Self link, Record link, and 360px layout.
* Forbidden copy/network scan has no hits.
* Commit content is reported after completion.

## Out Of Scope

* Full experiment creation flow.
* Durable `PersonalAction` or `PersonalExperiment` data model.
* Completion attempts or history.
* Account impacts from action completion.
* Topic-to-experiment conversion.
* Reminders, push, streaks, calendars, or analytics.

## Technical Notes

* Likely files:
  * `src/App.tsx`
  * new `src/routes/ExperimentsPage.tsx`
  * new `src/domain/personalActions.ts`
  * new `src/domain/personalActions.test.ts`
  * `src/styles/screens.css`
  * optional `.trellis/spec/frontend/state-management.md`
* Existing patterns:
  * `src/routes/AccountDetailPage.tsx` has a route-local personal-action menu.
  * `src/routes/SignalCheckPage.tsx` and `src/routes/DraftCheckPage.tsx` show route-local step/confirmation patterns.
  * `src/domain/selectors.ts` already exposes active space and today's market.
