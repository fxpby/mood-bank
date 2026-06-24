# Record detail edit episode

## Goal

Let the user correct a saved interaction record from Record Detail so the saved facts, interpretation, felt state, next action, and storage-jar impacts can stay accurate after the first high-activation entry.

## What I Already Know

- `/record/:id` currently shows record content, linked anchors, account impact rows, linked discovery points, and delete confirmation.
- `saveQuickRecord` creates an `Episode`, builds `accountImpacts` from `QuickRecordInput`, optionally creates one linked discovery point, and clears matching drafts.
- `deleteEpisodeFromState` already removes an episode and optionally linked anchors while preserving linked discovery points.
- Account summaries are derived from saved episode/practice/experiment-attempt impacts, not persisted.
- Editing must stay local-first and must not bypass `AppStoreContext` / `StorageAdapter`.

## Requirements

- Record Detail must support editing the selected saved episode.
- Editable fields:
  - `title`
  - `facts`
  - `interpretation`
  - `emotions`
  - `bodySensations`
  - `connectionLevel`
  - `activationLevel`
  - `nextAction`
  - `connectionEvidence`
  - `selfContactEvidence`
  - `energyEffect`
- Editing must preserve:
  - `id`
  - `spaceId`
  - `source`
  - `draftId`
  - `returnToSelfPracticeId`
  - `createdAt`
  - existing linked discovery points
  - existing anchors
- Editing must update:
  - `updatedAt`
  - `title` fallback to `一次互动` when blank
  - trimmed `facts`
  - trimmed `interpretation`
  - normalized emotion/body arrays
  - recomputed `accountImpacts` for the same episode id using current account-impact rules
- Editing must require at least one nonblank fact.
- Editing must not create a new episode, draft, discovery point, anchor, experiment, or account impact outside the selected episode.
- If a record edit changes facts/title, linked discovery point source snapshots (`sourceTitle` / `sourceSnippet`) remain unchanged in MVP. They represent what was saved into the discovery point at that time.
- If storage save fails, keep the user on Record Detail and show honest error copy; do not show success copy.
- Unknown episode ids return no-op success at domain/store level.

## UX Copy Constraints

- Frame editing as “整理这条记录”, not as correcting a score or rewriting history.
- Copy should say impacts are recalculated from this record’s saved fields.
- Avoid relationship verdicts, partner intent inference, diagnostic language, and transactional copy.
- Keep edit controls compact and consistent with Quick Record fields.

## Acceptance Criteria

- [x] User can open `/record/:id`, edit core record fields, save, and see updated content on the detail page.
- [x] Account impact rows update after editing evidence/next action/energy fields.
- [x] Account summaries update because they are derived from the edited episode impacts.
- [x] Linked discovery points and anchors remain after edit.
- [x] Editing does not create duplicate episodes or duplicate impacts.
- [x] Blank title falls back to `一次互动`.
- [x] Blank facts show validation error and do not save.
- [x] Unknown episode id edit returns no-op success.
- [x] Storage failure paths do not claim success.

## Out Of Scope

- Undo / version history.
- Bulk edit.
- Direct global account-balance editing.
- Editing return-to-self practices or experiment attempts.
- Editing linked discovery point source snapshots automatically.
- Creating new discovery points from Record Detail in this task.
- Importing external chat content, AI analysis, backend sync, login, telemetry, or push.

## Technical Notes

- Add `EpisodeUpdateInput` in `src/domain/types.ts`.
- Add `updateEpisodeInState(state, input, timestamp)` in `src/domain/episodes.ts`.
- Recompute impacts by calling `buildQuickRecordImpacts` with:
  - existing `episode.id`
  - existing `episode.spaceId`
  - current space type from `state.spaces`
  - edited fields
- Add `actions.updateEpisode(input)` in `AppStoreContext`.
- Add focused domain tests in `src/domain/episodes.test.ts`.
- Update `RecordDetailPage` with an edit section.
- Update README and the PRD status table.

## Definition Of Done

- `npm run typecheck`
- `npm test`
- `npm run build`
- `git diff --check`
- Browser smoke for editing a record and seeing impacts update.
