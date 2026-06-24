# Record Detail Batch Discovery Capture

## Goal

Add batch capture to Record Detail so one saved episode can preserve multiple "这次看见的点" at once. This supports the product need that one emotional event may reveal several separate clues, and the user should be able to save them before forgetting without turning them into tasks or account impacts.

## Requirements

- On `/record/:id`, under `这次看见的点`, support switching between single save and batch save.
- Batch save supports 1-8 route-local rows.
- Each batch row supports:
  - required short title
  - optional kind
  - optional theme
  - optional note
  - optional explore question
- Blank-title rows are ignored.
- If all rows are blank, show validation copy and do not write to storage.
- All batch-saved discovery points from Record Detail must include the current episode source snapshot:
  - `sourceType: "episode"`
  - `sourceId: detail.episode.id`
  - `sourceTitle: detail.episode.title`
  - `sourceSnippet: detail.episode.facts`
- Saving must call `actions.saveDiscoveryPoints(...)` once for the full batch, not loop over `actions.saveDiscoveryPoint(...)`.
- Successful batch save resets the batch form and shows count-aware copy that the points were linked to this record.
- The latest created point can still be opened from the success action.
- Saved points must appear in the existing linked discovery-point list for the record.

## Acceptance Criteria

- [ ] User can switch between `存一个` and `批量保存` inside Record Detail.
- [ ] User can add and remove batch rows, with at least one row always present and a maximum of eight rows.
- [ ] Saving with all blank titles shows validation copy and creates no discovery points.
- [ ] Saving a mixed batch creates only titled rows.
- [ ] Every created row is linked to the current episode and preserves the episode title/facts as source metadata.
- [ ] Batch-created points appear in the Record Detail linked list and open Topic Detail normally.
- [ ] Batch-created points do not change Connection / Self / Energy summaries.
- [ ] Existing single save behavior still works.

## Definition of Done

- Tests cover the batch helper source-default behavior and account-summary neutrality.
- `npm run typecheck` passes.
- `npm test` passes.
- `npm run build` passes.
- README and Trellis spec notes are updated if the behavior changes user-visible or reusable contracts.

## Technical Approach

- Reuse the existing Topics batch capture pattern and `MAX_BATCH_DISCOVERY_POINTS`.
- Extend `buildBatchDiscoveryPointInputs(...)` with optional default source metadata so source-linked batch inputs can be built in one place.
- Keep batch row state route-local in `RecordDetailPage`.
- Keep Record Detail batch rows simpler than Topics batch rows: no row-level source snippet field, because the source snapshot is the episode facts.
- Preserve existing linked-topic derivation through `selectEpisodeDetail(...)`; no new persisted relationship table is needed.

## Decision (ADR-lite)

**Context**: `/topics` already supports manual batch discovery capture, while `/record/:id` only supports saving one episode-linked point. A saved episode can surface several separate "看见的点", so users need a faster capture path that keeps source context.

**Decision**: Add a Record Detail-local batch mode using the existing discovery point model and multi-save store action. Batch-created points are ordinary `DiscoveryPoint` records with episode source metadata.

**Consequences**: This keeps the model simple and local-first. It does not add AI extraction, automatic account impact, tasks, reminders, or a separate episode-topic join model. The trade-off is that batch rows are intentionally minimal; deeper editing continues in Topic Detail after saving.

## Out of Scope

- AI extraction or automatic splitting of record text.
- Inferring themes, causes, attachment style, diagnoses, or relationship verdicts.
- Creating account impacts from saved discovery points.
- Due dates, reminders, overdue states, streaks, or task backlog language.
- Deleting linked discovery points when the source episode is deleted.
- Editing linked discovery points inline from Record Detail after save.

## Technical Notes

- Relevant files inspected:
  - `src/routes/RecordDetailPage.tsx`
  - `src/routes/TopicsPage.tsx`
  - `src/domain/topics.ts`
  - `src/domain/topics.test.ts`
  - `src/styles/screens.css`
  - `.trellis/spec/frontend/state-management.md`
- Existing `actions.saveDiscoveryPoints(...)` already persists multiple discovery points in one store action.
- Existing discovery point contract says saving discovery points must not affect derived storage-jar summaries.
