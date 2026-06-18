# P1 Topics Discovery Points

## Goal

Replace the `/topics` placeholder with a lightweight "稍后再看" surface where users can store and gently review discovery points, later topics, questions, and small action ideas without turning them into a task backlog.

## What I Already Know

* The archived P0 PRD defines Topics / Discovery Points as the home for things that do not need to be processed immediately.
* Current navigation already exposes `/topics` through the bottom tab labelled `发现`.
* Current `/topics` route is an honest placeholder and does not write data.
* `AppState` already has a `topics` array, but it currently uses a generic `ReservedItem` shape and has no store actions.
* Trigger and Quick Record already include copy/actions around "保存一个话题" / "把话题放进稍后", so a real retrieval surface is now valuable.

## Requirements

* Implement a real `/topics` page titled `稍后再看`.
* Page helper copy: `这里存放还不需要马上想完的点。`
* Show a compact mobile-first layout with:
  * header
  * filter chips
  * scrollable list
  * primary action `存一个发现点`
* Support manual creation of a discovery point from the Topics page.
* Creation form should be low-friction:
  * required title
  * kind: `话题` / `发现点` / `探寻问题` / `行动想法`
  * optional theme: `情绪` / `边界` / `旧感觉` / `关系学习` / `表达` / `自我照顾` / `行动实验`
  * optional short note
  * optional explore question
* New items default to status `stored_for_later` and source `manual`.
* List items should show:
  * title
  * kind chip
  * theme chip when present
  * source copy
  * note or explore question when present
  * status copy
* Filters for MVP:
  * `全部`
  * `发现点`
  * `想理解`
  * `想分享`
  * `先放着`
  * `已回看`
  * `不用了`
* Allow lightweight status changes from each row:
  * `想理解`
  * `想分享`
  * `先放着`
  * `看过一次`
  * `不用了`
* Empty state should invite one saved point, not a full organization system.
* Saving or reviewing topics must not create account impacts in this task.
* UI must avoid overdue, backlog, streak, completion-rate, diagnosis, relationship verdict, or partner-inference language.

## Acceptance Criteria

* [ ] `/topics` renders a real page instead of placeholder copy.
* [ ] User can add a manual discovery point with title and optional metadata.
* [ ] Added point persists across refresh.
* [ ] Topic list shows newest first.
* [ ] Filters narrow the list correctly.
* [ ] Status actions update only the selected topic.
* [ ] Saving/reviewing a topic creates no Connection / Self / Energy impacts.
* [ ] Storage failure does not show false success copy.
* [ ] `npm run typecheck`, `npm test`, and `npm run build` pass.

## Definition Of Done

* Typed domain model for topic/discovery point data.
* Store actions for create/update status use the existing storage boundary.
* Focused unit tests cover persistence behavior and no account impact side effects.
* Browser check confirms `/topics` works on the running app.
* Commit message and summary provided at wrap-up.

## Technical Approach

* Replace `ReservedItem[]` topics with a typed `DiscoveryPoint[]` while leaving `experiments` and `personalActions` reserved for later.
* Add `saveDiscoveryPoint` and `updateDiscoveryPointStatus` actions to `AppStoreContext`.
* Add a route component `src/routes/TopicsPage.tsx`.
* Keep all durable writes inside store actions; page uses route-local form/filter state.
* Keep validation backwards-compatible enough for existing v1 local state by defaulting missing topic fields where possible.

## Decision

**Context**: The full PRD includes batch capture, source linking, detail pages, review notes, conversions to actions/experiments, and source episode integration.

**Decision**: This task implements only the manual list + creation + lightweight status update loop. It gives the bottom-nav Topics tab real value while avoiding a large reflection system.

**Consequences**: Later work can add source linking, batch capture, detail pages, and conversions without changing the basic data model. This first slice keeps topic review non-pressuring and local-first.

## Out Of Scope

* Batch capture from rich incoming messages or episodes.
* Topic detail route.
* Editable title/body after creation.
* Source episode integration.
* Review notes history.
* Conversion to personal actions or experiments.
* AI clustering, automatic theme detection, or trauma-source inference.
* Due dates, reminders, streaks, progress bars, or backlog language.

## Technical Notes

* Relevant existing files:
  * `src/App.tsx`
  * `src/domain/types.ts`
  * `src/domain/validation.ts`
  * `src/store/AppStoreContext.tsx`
  * `src/routes/PlaceholderPage.tsx`
  * `src/styles/screens.css`
* Product reference:
  * `.trellis/tasks/archive/2026-06/06-17-emotional-account-pwa/prd.md`
  * section `Topics / Discovery Points Page-Level Flow`
