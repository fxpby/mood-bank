# Topics Batch Discovery Capture

## Goal

Add a lightweight batch capture path on `/topics` so users can save several discovery points from one dense moment before they forget them.

## What I Already Know

* The main PRD explicitly calls for batch-saving 1-8 discovery points from dense events without requiring long notes or immediate analysis.
* `/topics` currently supports manual single-point creation, local text search, filters, status changes, and topic detail review.
* `AppActions.saveDiscoveryPoints(input[])` already exists and writes multiple discovery points in one commit.
* `src/domain/topics.ts` already has `addDiscoveryPointsToState(...)` with tests for multiple discovery points.
* Product boundaries require no due dates, no overdue/debt language, no AI parsing, and no account impact from saving discovery points by default.

## Requirements

* Add a batch capture mode to `/topics`, reachable near the existing single-point creation entry.
* Batch mode supports 1-8 rows.
* Each row should keep cognitive load low:
  * required short title
  * optional theme
  * optional source snippet
  * optional note
  * optional explore question
* Users can add and remove rows before saving.
* At least one non-empty title is required to save.
* Blank rows are ignored; no placeholder discovery points are created.
* More than three rows should show supportive copy: "先存住就好，之后可以慢慢看。"
* Save uses one `actions.saveDiscoveryPoints(...)` call so the batch is atomic from the UI perspective.
* Success copy should say how many points were saved and that they are not todos.
* Saving a batch must not create account impacts, due dates, reminders, search history, AI analysis, or inferred themes.

## Acceptance Criteria

* [x] User can switch from single-point creation to batch creation on `/topics`.
* [x] User can add up to 8 rows and remove rows while keeping at least one row visible.
* [x] Save is blocked with friendly copy if every title is blank.
* [x] Saving ignores blank rows and persists only titled rows.
* [x] Saved rows appear newest-first in Topics.
* [x] Batch save calls the existing multi-point store action, not a loop of separate single saves.
* [x] Saving creates no account impacts.
* [x] Unit tests cover blank-row filtering and no-impact behavior for batch inputs.
* [x] `npm run typecheck`, `npm test`, and `npm run build` pass.

## Out Of Scope

* AI extraction from pasted chat or notes.
* Semantic grouping, automatic theme inference, or importance ranking.
* Source-linked batch capture from Record Detail.
* Due dates, reminders, backlog debt, or review pressure.
* UI/Figma redesign.

## Technical Notes

* Likely files:
  * `src/routes/TopicsPage.tsx`
  * `src/domain/topics.test.ts`
  * `src/styles/screens.css`
  * `README.md`
  * `.trellis/tasks/archive/2026-06/06-17-emotional-account-pwa/prd.md`
  * `.trellis/spec/frontend/state-management.md`
* Batch form state remains route-local. Durable write goes through `actions.saveDiscoveryPoints(...)`.
