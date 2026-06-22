# Record Detail Delete Episode

## Goal

Let the user delete one saved interaction record from Record Detail with explicit confirmation. Deleting the record should remove its account impacts from derived summaries and remove anchors that directly point to that episode, while preserving linked later topics / discovery points so the user does not lose important reflections.

## What I Already Know

- The product PRD requires delete confirmation for emotionally meaningful records.
- Current `RecordDetailPage` has no delete entry.
- Account summaries are derived from source records, so removing an episode should automatically remove its account impacts.
- Linked topics should remain after source record deletion and show "来源记录已删除".
- Existing `ConfirmDialog` supports destructive confirmation.
- Durable writes must go through `AppStoreContext`; routes must not write storage directly.

## Requirements

- Add a typed store action:
  - `deleteEpisode(input: { id: string; deleteLinkedAnchors?: boolean }): StoreWriteResult`
- Delete behavior:
  - Remove the episode with the matching id from `state.episodes`.
  - Remove episode-linked anchors only when `deleteLinkedAnchors !== false`; this task's UI will delete linked anchors by default.
  - Preserve linked topics / discovery points.
  - Do not create account impacts, topics, experiments, drafts, or telemetry.
  - Unknown episode id returns no-op success.
  - Storage failure must show honest error copy and must not navigate away as if deletion succeeded.
- Record Detail UI:
  - Show a destructive delete section near the bottom of the detail page.
  - Confirmation copy must state that the record and account detail sources will be removed, while linked later topics remain.
  - After successful deletion, navigate back to `/record`.
  - Use warm, non-transactional product copy; avoid debt/accounting language.
- Topic Detail UI:
  - If a topic/discovery point references a deleted source episode, keep the stored source title/snippet and show "来源记录已删除".
  - Do not show a broken "打开来源记录" button for deleted source episodes.

## Acceptance Criteria

- [x] User can delete an existing saved episode from Record Detail after confirmation.
- [x] After deletion, the episode disappears from Record list/detail and derived account summaries no longer include its impacts.
- [x] Episode-linked anchors are removed when using the Record Detail delete action.
- [x] Episode-linked topics remain.
- [x] Topic Detail for a preserved linked topic shows "来源记录已删除" and does not navigate to a missing record.
- [x] Delete failure keeps the user on Record Detail with honest error copy.
- [x] Typecheck, tests, build, and diff whitespace checks pass.

## Verification

- `npm run typecheck`
- `npm test`
- `npm run build`
- `git diff --check`
- Browser smoke on `http://127.0.0.1:5178`: create a quick record with "保存一个话题", delete it from Record Detail, verify the record disappears, linked topic remains, Topic Detail shows "来源记录已删除", and "打开来源记录" is hidden.

## Out Of Scope

- Editing records.
- Deleting linked topics/discovery points from the record delete dialog.
- Recover/undo after deletion.
- Bulk delete.
- Export/copy/share actions.
- Full record form.

## Technical Notes

- Likely files:
  - `src/domain/types.ts`
  - `src/store/AppStoreContext.tsx`
  - `src/domain/selectors.ts`
  - `src/domain/selectors.test.ts`
  - `src/routes/RecordDetailPage.tsx`
  - `src/routes/TopicDetailPage.tsx`
  - `src/styles/screens.css`
  - `README.md`
  - `.trellis/tasks/archive/2026-06/06-17-emotional-account-pwa/prd.md`
