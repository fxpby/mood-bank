# Record detail save discovery point

## Goal

Let the user save a small "seen point" directly from a saved record detail page when reviewing one episode surfaces new threads, questions, or insights. The entry should preserve source context and avoid turning Topics into a task backlog.

## What I already know

- The user previously emphasized that one event can reveal many points and those points need a lightweight capture入口 for later review.
- `/record/:id` already shows linked discovery points under `这次看见的点`, but currently only lists existing linked topics; it cannot create a new linked point from the record detail page.
- `DiscoveryPoint` already supports `sourceType: "episode"`, `sourceId`, `sourceTitle`, and `sourceSnippet`.
- `actions.saveDiscoveryPoint(input)` is the existing durable write path and creates no account impacts by default.
- `/topics` has a manual creation form; `/topics/:id` can edit/review/delete/convert points.
- Current frontend spec says Topics are low-pressure discovery points, not task backlog items, and durable writes must go through `AppStoreContext`.

## Requirements

- Record Detail must let the user save one new linked discovery point from the current episode.
- The entry should live near the existing `这次看见的点` section, because it is a follow-up from reviewing this record.
- Fields:
  - required short title
  - kind: `discovery`, `topic`, `question`, `action_idea`
  - optional theme
  - optional note
  - optional explore question
- Saved point must include source metadata:
  - `sourceType: "episode"`
  - `sourceId: episode.id`
  - `sourceTitle: episode.title`
  - `sourceSnippet: episode.facts`
  - `spaceId: episode.spaceId`
- Saving a point must not modify the episode, anchors, experiments, account impacts, account summaries, or existing linked topics.
- Blank title must show route-local validation copy and must not save.
- Storage failure must show honest error copy and no success copy.
- Success should clear the form, show low-pressure confirmation, and optionally offer to open the newly saved topic detail.
- Existing linked topics list should reflect the new point after save via derived state.

## UX Copy Constraints

- Use language like `存一个看见的点`, `稍后再看`, `不需要现在想完`.
- Do not use backlog/task/debt/overdue language.
- Do not imply the discovered point creates an account impact or relationship conclusion.
- Keep the form lightweight and consistent with Topics manual creation.

## Acceptance Criteria

- [x] User can open `/record/:id`, fill a short title, save a linked discovery point, and see it appear in `这次看见的点`.
- [x] Saved point opens in Topic Detail and shows the source record context.
- [x] Saved point preserves source snapshot title/snippet even if the episode is edited later.
- [x] Saving the point creates no account impacts and does not change derived storage-jar summaries.
- [x] Blank title shows validation copy and does not save.
- [x] Storage failure does not show success copy.
- [x] README and main PRD status/backlog mention Record Detail can save linked discovery points.

## Out Of Scope

- Batch capture multiple points from one record.
- AI extracting points from record text.
- Auto-suggested topics, emotion tagging, or relationship interpretation.
- Editing the episode when saving the point.
- Account impact rules for discovery-point saves.
- New persisted model beyond `DiscoveryPoint`.
- UI/Figma redesign work.

## Technical Notes

- Likely files:
  - `src/routes/RecordDetailPage.tsx`
  - `src/domain/topics.test.ts` or `src/domain/selectors.test.ts`
  - `README.md`
  - `.trellis/tasks/archive/2026-06/06-17-emotional-account-pwa/prd.md`
  - `.trellis/spec/frontend/state-management.md` only if the existing topic contract needs clarification.
- Reuse existing `actions.saveDiscoveryPoint` and `DiscoveryPointInput`.
- Reuse `discoveryPointKindCopy` / `discoveryPointThemeCopy` and `ChipGroup` from Topics page.
- Existing selector `selectEpisodeDetail` should automatically include the newly linked topic because it filters by `sourceType === "episode"` and `sourceId === episode.id`.

## Definition Of Done

- `npm run typecheck`
- `npm test`
- `npm run build`
- `git diff --check`
- Browser smoke: create one linked point from Record Detail, see it listed, open its detail, verify source context.
