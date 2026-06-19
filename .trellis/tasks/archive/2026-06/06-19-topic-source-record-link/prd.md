# Topic Source Record Link

## Goal

Let a user open the original interaction record from a source-linked topic detail page, completing the two-way review loop between Record Detail and Topic Detail.

## Requirements

- Topic Detail must show an "打开来源记录" action when the selected discovery point has `sourceType: "episode"` and a valid `sourceId`.
- The action navigates to the existing `/record/:id` detail route using `buildRecordRoute(...)`.
- Topics without an episode source must not show a broken source-record action.
- The existing source context rows remain visible.
- No durable data is changed by opening the source record.
- No account summaries, anchors, topic statuses, or notes are changed.
- Unknown/missing source records may still route to Record Detail's existing honest empty state.

## Acceptance Criteria

- [ ] Episode-linked Topic Detail pages show an "打开来源记录" button.
- [ ] Clicking the button navigates to `/record/<sourceId>`.
- [ ] Non-episode topics do not show the button.
- [ ] Refreshing the source record route still works through existing route normalization.
- [ ] Typecheck, tests, build, forbidden-copy scan, and browser route check pass.

## Definition of Done

- Topic Detail UI updated with a conditional source-record action.
- Route helper usage follows existing `buildRecordRoute(...)` pattern.
- Focused tests added if route helper behavior changes; otherwise existing route tests are sufficient.
- Trellis task, archive, and journal records committed after work commit.

## Technical Approach

- Import `buildRecordRoute` in `TopicDetailPage`.
- Add a small helper that returns a source record route only when `point.sourceType === "episode"` and `point.sourceId` is present.
- Render a secondary button in the "它从哪里来" panel when the helper returns a route.
- Keep this as navigation-only UI with no `AppActions` call.

## Decision (ADR-lite)

Context: Record Detail already links to source-linked topics, but Topic Detail does not link back to its source record.

Decision: Add a conditional source-record button only for episode-linked discovery points.

Consequences: The review loop becomes navigable without changing persistence or introducing generic source-detail routes for trigger/draft/rich incoming sources.

## Out of Scope

- Source detail routes for trigger, draft check, rich incoming, or emotion calibration.
- New source metadata or schema changes.
- Editing source records from Topic Detail.
- Account impacts or topic status automation.
- Backend, login, sync, telemetry, push, or network calls.

## Technical Notes

- Relevant files inspected:
  - `src/routes/TopicDetailPage.tsx`
  - `src/routes/RecordDetailPage.tsx`
  - `src/utils/route.ts`
  - `src/domain/selectors.ts`
- Existing behavior:
  - Record Detail shows linked topics and navigates with `buildTopicRoute(point.id)`.
  - `buildRecordRoute(id)` already encodes record ids.
  - Record Detail already handles unknown record ids with an honest empty state.
