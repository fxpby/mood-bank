# P1 Topic Detail Review

## Goal

Add a low-pressure detail / review surface for saved later topics and discovery points, so items captured from Trigger, Quick Record, or manual entry can be opened, understood in context, and gently marked without turning into a task backlog.

## What I Already Know

* `/topics` is a real list backed by `AppState.topics`.
* Trigger and Quick Record can now create source-linked discovery points.
* The broader PRD defines `/topics/:id` as a P1 route for viewing a topic, linked source context, review notes, and status actions.
* Current `DiscoveryPoint` fields already support title, kind, status, source type, source id/title/snippet, theme, note, and explore question.
* There are no durable PersonalAction or Experiment entities yet; converting a topic into action/experiment should not be implemented in this task.

## Assumptions

* This task should stay local-first and deterministic.
* Opening/reviewing a topic should not change Connection / Self / Energy summaries unless a future PRD adds an explicit rule.
* Route can be normalized as `/topics/:id` while keeping existing in-app navigation simple.

## Requirements

* Add a topic detail route for `/topics/:id`.
* Topics list cards should offer a clear way to open a topic detail.
* Detail view should show:
  * topic title
  * kind, status, source, optional theme
  * source title/snippet if present
  * note and explore question if present
  * created/updated dates
* Detail view should allow status updates using existing discovery point status action.
* Detail view should include gentle actions:
  * back to `/topics`
  * mark "看过一次"
  * "先放着"
  * "不用了"
* Unknown topic id should show an honest empty state and route back to `/topics`.
* Storage failure must not show false success copy.
* No account impact should be created by opening or updating a topic status.

## Acceptance Criteria

* [ ] User can open a topic from `/topics`.
* [ ] `/topics/:id` renders the selected topic details.
* [ ] Source-linked topics show source context when available.
* [ ] User can update topic status from the detail page.
* [ ] Refreshing `/topics/:id` keeps the detail page working.
* [ ] Unknown topic id shows a recoverable empty state.
* [ ] Topic detail/status updates do not change derived account summaries.
* [ ] `npm run typecheck`, `npm test`, and `npm run build` pass.

## Definition of Done

* Tests added/updated for route normalization and no-account-impact behavior where applicable.
* Manual browser verification covers list -> detail -> status update -> refresh.
* No forbidden copy, network calls, telemetry, or direct `localStorage` outside the adapter.

## Out Of Scope

* Editing title/note/explore question.
* Deleting topics.
* Creating PersonalAction or Experiment records.
* Batch capture.
* Episode detail backlinks.
* Account impact rules for review.

## Technical Notes

* Likely files:
  * `src/utils/route.ts`
  * `src/App.tsx`
  * `src/routes/TopicsPage.tsx`
  * new `src/routes/TopicDetailPage.tsx`
  * `src/domain/topics.test.ts`
  * `src/copy/topics.ts`
* Existing specs:
  * `.trellis/spec/frontend/index.md`
  * `.trellis/spec/frontend/state-management.md`
  * `.trellis/spec/frontend/quality-guidelines.md`
  * `.trellis/spec/frontend/type-safety.md`
