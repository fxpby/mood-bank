# Topic detail edit delete discovery point

## Goal

Let the user correct or remove a saved discovery point from Topic Detail without turning Topics into a task backlog or changing any source records, small practices, anchors, drafts, or storage-jar summaries.

## What I Already Know

- Topic Detail currently lets the user review a discovery point, save a review note, save an anchor, create a small practice, and update review status.
- Topics are stored in `AppState.topics` as `DiscoveryPoint[]`.
- Discovery points are not account impacts. Creating or reviewing them must not change Connection / Self / Energy summaries.
- Existing source context is preserved even when a source episode is deleted; deleted episode sources show missing-source copy.
- The user wants continued product development, not the paused Figma/UI parity task.

## Requirements

- Topic Detail must support editing the discovery point itself.
- Editable fields:
  - `title`
  - `kind`
  - `theme`
  - `note`
  - `exploreQuestion`
- Editing must preserve source metadata:
  - `sourceType`
  - `sourceId`
  - `sourceTitle`
  - `sourceSnippet`
- Editing must preserve `spaceId`, `createdAt`, and current `status`.
- Blank title must save as the existing fallback title `一个稍后再看的点`.
- Optional text fields must trim whitespace and clear to `undefined` when blank.
- Topic Detail must support deleting the discovery point from “稍后再看”.
- Delete must require an explicit confirmation dialog.
- Delete must only remove the selected `DiscoveryPoint` from `state.topics`.
- Delete must not remove:
  - source episode or return-to-self practice
  - anchors
  - drafts
  - personal experiments created from the discovery point
  - experiment attempts
  - account impacts or derived summaries
- If deletion succeeds, navigate back to `/topics`.
- If storage save fails, keep the user on Topic Detail and show honest error copy; do not show success copy.
- Unknown topic ids return no-op success at domain/store level.

## UX Copy Constraints

- Use warm product language: `发现点`, `稍后再看`, `存下`, `小练习`.
- Avoid transactional copy such as `记账`, `对账`, `消费`, `余额不足`, `还债`, `兑换`.
- Do not imply deleting a discovery point deletes or changes the original event.
- Confirmation copy should explicitly say this only removes the discovery point from “稍后再看”; source records and created practices stay in place.

## Acceptance Criteria

- [ ] User can open `/topics/:id`, edit title/kind/theme/note/explore question, save, and see updated detail content.
- [ ] Edited discovery point appears updated on `/topics`.
- [ ] Editing preserves source context and current status.
- [ ] Blank optional fields are cleared instead of saved as whitespace.
- [ ] Blank title falls back to `一个稍后再看的点`.
- [ ] User can delete a discovery point only after confirming.
- [ ] Successful delete returns to `/topics` and the deleted point is absent.
- [ ] Deleting a source-linked point leaves its source record and any created small practice intact.
- [ ] Storage failure paths do not claim success.
- [ ] Domain tests cover edit/delete behavior and unchanged derived storage-jar summaries.

## Out Of Scope

- Bulk delete.
- Undo / recycle bin.
- Deleting linked source records.
- Deleting linked personal experiments or attempts.
- Recomputing or creating account impacts.
- Search, sort, or new filtering behavior.
- Visual redesign or Figma parity changes.
- Backend, login, sync, telemetry, AI analysis, or imported chat parsing.

## Technical Notes

- Add typed inputs in `src/domain/types.ts`.
- Add pure helpers in `src/domain/topics.ts`:
  - `updateDiscoveryPointInState(state, input, timestamp)`
  - `deleteDiscoveryPointFromState(state, input)`
- Add store actions in `src/store/AppStoreContext.tsx`:
  - `updateDiscoveryPoint(input)`
  - `deleteDiscoveryPoint(input)`
- Reuse `ConfirmDialog` for deletion.
- Keep durable writes behind `commitState`.
- Update README Topics usage section and P1/P2 implementation status if needed.

## Definition Of Done

- `npm run typecheck`
- `npm test`
- `npm run build`
- `git diff --check`
- Browser smoke on a local dev server for edit and delete flows.
