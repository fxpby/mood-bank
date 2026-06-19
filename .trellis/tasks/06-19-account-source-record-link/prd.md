# Account Source Record Link

## Goal

Let users open the source record behind an account-detail source row when that row comes from an episode, so the storage-jar movement can be traced back to the full saved context without recalculating or rewriting anything.

## What I Already Know

- Account Detail rows already show source label, title, context, reason, evidence, value, and date.
- `AccountDetailSourceRow.impact.sourceType` can be `"episode"`, `"return_to_self"`, or `"trigger_completion"`.
- Episode-sourced impacts include `impact.sourceId`, and `buildRecordRoute(...)` already encodes record ids.
- Record Detail has an honest not-found state for stale or missing record ids.
- Topic Detail, Home latest record, Home anchor source, and Record list already use typed record navigation.
- This task is read-only navigation and must not change account derivation or persisted data.

## Requirements

- Account Detail rows with `row.impact.sourceType === "episode"` and a `sourceId` must show an action to open the source record.
- The action must use `buildRecordRoute(row.impact.sourceId)`.
- Rows from Return-To-Self and Trigger completion must not show a record-source action in this task.
- The existing account row copy and layout should remain intact.
- No durable writes, account impact changes, selector behavior changes, or schema changes.

## Acceptance Criteria

- [ ] Episode-sourced account rows show an "打开来源记录" action.
- [ ] Clicking the action navigates to `/record/<sourceId>`.
- [ ] Return-To-Self and Trigger rows do not show the source-record action.
- [ ] Account Detail empty state remains unchanged.
- [ ] No transactional, diagnostic, reward, or relationship-verdict copy is introduced.

## Definition of Done

- `npm run typecheck` passes.
- `npm test` passes.
- `npm run build` passes.
- Forbidden product-copy/network scan against `src` passes.
- Browser validation confirms an episode-sourced account row opens Record Detail.

## Out of Scope

- Return-To-Self practice detail routes.
- Trigger completion detail routes.
- Editing/deleting account rows or source records.
- Changing account derivation, sorting, or reason/evidence copy.

## Technical Notes

- Likely file:
  - `src/routes/AccountDetailPage.tsx`
  - possibly `src/styles/screens.css`
- `AccountDetailRow` currently does not receive `navigate`; pass it in rather than importing navigation globally.
- Use `buildRecordRoute(...)` rather than string concatenation.
