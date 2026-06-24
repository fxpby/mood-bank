# Topics Text Search

## Goal

Add lightweight local text search to the Topics list so saved discovery points, questions, and action ideas remain findable as the list grows.

## What I Already Know

* The main PRD says Topics is the place for discovery points, questions, topics, and action ideas, with low-pressure filters and no due dates or task-debt language.
* Current `/topics` supports filters by type, status, theme, and source.
* Current domain filtering lives in `src/domain/topics.ts`; the page state lives in `src/routes/TopicsPage.tsx`.
* Discovery points can include title, note, explore question, source title, and source snippet. These fields are enough for transparent local search without AI analysis.

## Requirements

* Add a small text search input to `/topics`.
* Search should combine with existing type/status/theme/source filters.
* Search should match user-visible discovery-point text:
  * title
  * note
  * explore question
  * source title
  * source snippet
* Search should be local, deterministic, case-insensitive, and whitespace-tolerant.
* Search should not infer themes, summarize text, rank psychological importance, or change discovery point state.
* Empty states should distinguish "no topics yet" from "no results for this filter/search".
* Add focused unit coverage for search filtering.
* Update docs/PRD status copy where implemented behavior is listed.

## Acceptance Criteria

* [x] User can type into a search field on `/topics`.
* [x] Search results update together with existing filters.
* [x] Search matches title, note, explore question, source title, and source snippet.
* [x] Searching does not write local state or create account impact.
* [x] Filtered/search empty state uses low-pressure copy and does not mention overdue, unfinished debt, or failure.
* [x] Unit tests cover search matching and combined filters.
* [x] `npm run typecheck`, `npm test`, and `npm run build` pass.

## Out Of Scope

* AI parsing, summarization, semantic search, or automatic theme inference.
* Sorting/ranking by emotional importance.
* Search history, saved searches, backend indexing, sync, or telemetry.
* Any UI/Figma redesign work.

## Technical Notes

* Likely files:
  * `src/domain/topics.ts`
  * `src/domain/topics.test.ts`
  * `src/routes/TopicsPage.tsx`
  * `README.md`
  * `.trellis/tasks/archive/2026-06/06-17-emotional-account-pwa/prd.md`
* Follow existing local-first AppStore actions. Search remains derived UI state and must not be persisted.
