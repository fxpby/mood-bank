# Topics Filter Source And Theme

## Goal

Make `/topics` easier to review when many discovery points accumulate by adding lightweight theme/source/type filtering that matches the main PRD. This should improve retrieval without turning Topics into a task backlog or adding due dates, scores, search, or new persisted models.

## What I Already Know

- The main PRD says Topics should support filters by type, status, theme, and source.
- Current `/topics` only filters by all, discovery kind, and a few statuses.
- Topic cards already display kind, theme, source, and status.
- Theme/source are already stored on `DiscoveryPoint`; no schema change is needed.
- Durable writes must still go through `AppStoreContext`; filtering itself is route-local state only.
- UI/Figma redesign work is paused and out of scope.

## Requirements

- Add route-local filter state for:
  - type/kind: all, topic, discovery, question, action idea
  - status: all plus existing low-pressure status filters
  - theme: all plus all `DiscoveryPointTheme` values
  - source: all plus supported `DiscoveryPointSourceType` values
- Preserve the existing low-pressure copy and card actions.
- Manual creation form may keep its existing type/theme controls.
- Filtering must not persist anything, create account impacts, or update discovery-point status.
- Empty state copy should name that the current filter combination has no content.
- Avoid task-backlog language such as overdue, due, remaining, unfinished, or debt.

## Acceptance Criteria

- [x] User can filter Topics by type/kind.
- [x] User can filter Topics by status.
- [x] User can filter Topics by theme.
- [x] User can filter Topics by source.
- [x] Filters combine predictably with AND semantics.
- [x] Empty filtered state remains low-pressure and does not imply backlog/task failure.
- [x] Existing inline status updates and open-detail actions continue to work.
- [x] Typecheck, tests, build, and diff whitespace checks pass.

## Verification

- `npm run typecheck`
- `npm test`
- `npm run build`
- `git diff --check`
- Browser smoke on `http://127.0.0.1:5178/topics`: verify type/status/theme/source filter groups render, an unmatched type filter shows the gentle empty state, and matching type/source filters restore the topic list.

## Out Of Scope

- Search.
- Sort options.
- Saved filter preferences.
- Bulk status changes.
- Topic deletion.
- Visual redesign / Figma parity.
- New persisted topic model.

## Technical Notes

- Likely files:
  - `src/routes/TopicsPage.tsx`
  - `README.md`
  - `.trellis/tasks/archive/2026-06/06-17-emotional-account-pwa/prd.md`
- Existing copy:
  - `src/copy/topics.ts`
- Existing types:
  - `DiscoveryPointKind`
  - `DiscoveryPointStatus`
  - `DiscoveryPointTheme`
  - `DiscoveryPointSourceType`
