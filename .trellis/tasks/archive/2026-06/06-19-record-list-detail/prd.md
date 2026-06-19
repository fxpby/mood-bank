# P1 Record List Detail

## Goal

Turn `/record` from a latest-record placeholder into a usable record archive and add a minimal `/record/:id` detail view, so users can revisit saved episodes, see why storage jars moved, and jump to linked later topics without creating pressure to edit or delete anything yet.

## What I Already Know

* `/record` currently shows only the latest episode.
* `Episode[]` is already persisted in `AppState.episodes`.
* Account impacts are stored on each episode and copied with localized reason/evidence text.
* Quick Record can create source-linked `DiscoveryPoint` records with `sourceType: "episode"` and `sourceId`.
* The broader PRD defines `/record/:id` as P1 episode detail and says it should show linked topics under "这次看见的点".

## Assumptions

* This task should stay read-mostly: opening records and linked topics should not create account impacts.
* Record detail can show account impacts already stored on the episode; it should not recompute or persist derived summaries.
* Deleting/editing records and anchor creation are separate later tasks.

## Requirements

* `/record` should list saved episodes, newest first.
* Each list item should show source label, title, facts preview, date, and an "打开详情" action.
* Keep the existing empty state and new-record action.
* Add `/record/:id` route.
* Record detail should show:
  * title, source, created date
  * facts
  * interpretation when present
  * emotions/body sensations when present
  * connection and activation levels
  * next action
  * account impacts for this episode, with localized reason/evidence
  * linked discovery points where `sourceType === "episode"` and `sourceId === episode.id`
* Linked discovery points should navigate to their `/topics/:id` detail.
* Unknown record id should show an honest empty state and route back to `/record`.
* Do not add delete, edit, anchor creation, or account-impact recalculation in this task.

## Acceptance Criteria

* [ ] `/record` shows all saved episodes newest first.
* [ ] User can open a saved record detail from `/record`.
* [ ] Refreshing `/record/:id` keeps the detail page working.
* [ ] Record detail shows account impacts without transactional or diagnostic copy.
* [ ] Record detail shows linked later topics/discovery points and can open them.
* [ ] Unknown record id shows a recoverable empty state.
* [ ] Opening records or linked topics creates no account impact.
* [ ] `npm run typecheck`, `npm test`, and `npm run build` pass.

## Definition of Done

* Route helper tests cover `/record/:id`.
* Selector or domain tests cover linked topics for an episode and no-account-impact behavior if helpers are added.
* Manual browser verification covers record list -> detail -> refresh -> linked topic.
* Forbidden copy/network scan has no hits.

## Out Of Scope

* Editing records.
* Deleting records.
* Anchor creation from episode detail.
* Full episode review flow.
* Batch topic extraction from record detail.
* Account impact recalculation or mutation.

## Technical Notes

* Likely files:
  * `src/utils/route.ts`
  * `src/App.tsx`
  * `src/routes/RecordPage.tsx`
  * new `src/routes/RecordDetailPage.tsx`
  * `src/domain/selectors.ts`
  * `src/domain/selectors.test.ts`
  * `src/styles/screens.css`
* Existing specs:
  * `.trellis/spec/frontend/index.md`
  * `.trellis/spec/frontend/state-management.md`
  * `.trellis/spec/frontend/quality-guidelines.md`
  * `.trellis/spec/frontend/type-safety.md`
