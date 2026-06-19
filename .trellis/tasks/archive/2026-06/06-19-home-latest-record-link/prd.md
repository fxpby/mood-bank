# Home Latest Record Link

## Goal

Let the Home "最近存下" preview open the latest record detail, so the dashboard summary can lead directly back to the full saved episode context.

## What I Already Know

- Home already derives `latestEpisode` with `selectLatestEpisode(state)`.
- Record list items can open record detail through `navigate(buildRecordRoute(episode.id))`.
- Home already imports and uses `buildRecordRoute(...)` for episode-linked anchors.
- Record Detail has an honest not-found state if a route id is missing or stale.
- This feature is navigation-only and must not persist data or affect account summaries.

## Requirements

- When `latestEpisode` exists, Home should provide a clear action from the "最近存下" preview to open its Record Detail.
- The action must use `buildRecordRoute(latestEpisode.id)` rather than string concatenation.
- The latest-record preview text and existing layout should remain compact.
- If there is no latest episode, Home should remain unchanged and show no latest-record section.
- No durable writes, account changes, schema changes, or storage behavior changes.

## Acceptance Criteria

- [ ] Home still shows latest record title and fact preview when an episode exists.
- [ ] Home latest record section includes an "打开详情" action.
- [ ] Clicking the action navigates to `/record/<latestEpisode.id>`.
- [ ] Home without episodes remains unchanged.
- [ ] No product copy uses transactional, diagnostic, reward, or relationship-verdict language.

## Definition of Done

- `npm run typecheck` passes.
- `npm test` passes.
- `npm run build` passes.
- Forbidden product-copy/network scan against `src` passes.
- Browser validation confirms the Home latest-record action opens Record Detail.

## Out of Scope

- Turning the entire latest-record card into a button.
- Editing or deleting records.
- Changing Record Detail content.
- Adding a separate latest-record selector.

## Technical Notes

- Likely files:
  - `src/routes/HomePage.tsx`
  - possibly `src/styles/screens.css`
- Reuse the existing `NotebookPen` icon and `.button--secondary` styling if it fits.
