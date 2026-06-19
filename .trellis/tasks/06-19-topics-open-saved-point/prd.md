# open saved topic after create

## Goal

After a user manually saves a discovery point on `/topics`, provide an immediate way to open the newly saved point. This keeps "稍后再看" usable when the user has just captured something and wants to add a review note or save an anchor without hunting for the item in the list.

## What I Already Know

- `/topics` already has a manual creation form and `actions.saveDiscoveryPoint(...)` returns the saved `DiscoveryPoint`.
- `/topics/:id` detail already exists and can show context, review notes, status actions, and anchor saving.
- Navigation helpers already include `buildTopicRoute(point.id)`.
- Discovery point saves must not change Connection / Self / Energy summaries.

## Requirements

- Store the most recently created discovery point in route-local state after a successful manual save.
- Show a small success area with existing success copy plus an `打开刚存的点` action.
- The action must navigate to `/topics/:id` using `buildTopicRoute`.
- Clear the saved-point shortcut when the user reopens/closes the compose form or hits a save error.
- Do not add or change store actions, storage schema, topic status rules, account-impact rules, or topic detail behavior.

## Acceptance Criteria

- [ ] Creating a manual discovery point shows `打开刚存的点`.
- [ ] Clicking that action opens the newly created topic detail.
- [ ] Save failures do not show the open shortcut.
- [ ] Status updates still work as before.
- [ ] No new localStorage access, network behavior, telemetry, backend, login, sync, or push behavior is added.
- [ ] `npm run typecheck`, `npm test`, and `npm run build` pass.

## Out Of Scope

- Batch creation changes.
- Source-linked topic changes.
- Topic detail redesign.
- Linking anchors back to topics.
- Account-impact behavior for discovery points.

## Technical Notes

- Likely file: `src/routes/TopicsPage.tsx`.
- Existing `saveDiscoveryPoint` result value can supply the id for `buildTopicRoute`.
- This is a route-local UX affordance, not a new product data contract.
