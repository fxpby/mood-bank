# P1 Account Detail View

## Goal

Replace the `/accounts/:account` placeholder with a read-only storage-jar detail view so users can open "明细" from Home or Quick Record completion and understand what changed, where it came from, and why it was counted without turning the app into a scorekeeper.

## What I Already Know

* P0 already has three accounts: `connection`, `self`, and `energy`.
* Home account cards already navigate to `/accounts/connection`, `/accounts/self`, and `/accounts/energy`.
* Quick Record completion already offers "打开明细".
* Account summaries are derived from `AccountImpact[]` in episodes and return-to-self practices.
* Drafts and placeholders must not create account impacts.
* User-facing copy should prefer "情感储蓄罐", "明细", "打开罐子", and "取一个支持自己的小动作"; avoid transactional accounting and redemption language.

## Requirements

* Implement a real read-only route for `/accounts/:account`.
* Show the account title:
  * `连接明细`
  * `自己明细`
  * `能量明细`
* Show qualitative status first and numeric value only as secondary detail.
* Include these sections:
  * `最近变化`
  * `来自哪些记录`
  * `为什么这样算`
  * `取一个支持自己的小动作`
* Source rows should link impact source ids back to the readable source context when available:
  * episode title/facts for `sourceType: "episode"`
  * return-to-self completion/anchor/body action for `sourceType: "return_to_self"`
  * fallback copy when the source cannot be found
* Empty state should be gentle and useful, not blank:
  * explain that no source has been stored for this jar yet
  * offer "记录互动" and "回到自己" actions
* Personal action menu is lightweight only:
  * show one recommended action and at most two alternatives
  * actions are not persisted in this task
  * choosing an action should show local UI confirmation only
* Account detail must not create, modify, or delete persisted data.

## Acceptance Criteria

* [ ] Clicking Home "明细" opens the corresponding account detail route.
* [ ] Clicking Quick Record completion "打开明细" opens a real detail screen instead of placeholder copy.
* [ ] Detail page lists recent impacts for the selected account, sorted newest first.
* [ ] Each source row shows reason copy, source type, source title/context, evidence when present, and date.
* [ ] Empty account detail shows low-pressure copy and routes to `/record` or `/return-to-self`.
* [ ] Choosing a suggested personal action changes only local UI state and does not write to storage.
* [ ] No relationship verdict, partner inference, diagnosis, reward-store, streak, cost, or redemption language is added.
* [ ] `npm run typecheck`, `npm test`, and `npm run build` pass.

## Out Of Scope

* Editable account detail.
* Account history charts.
* Persisted personal actions.
* Account detail delete/edit source actions.
* Topics, experiments, signal check, draft self-check, or rich incoming review.
* Any backend, sync, telemetry, AI, or network behavior.

## Technical Notes

* Add a route component such as `src/routes/AccountDetailPage.tsx`.
* Reuse `collectAccountImpacts` / `deriveAccountSummary` or add a small pure selector for source rows.
* Keep browser storage access inside `src/storage/storageAdapter.ts`; the detail route reads through `useAppStore()`.
* Existing route union already includes `/accounts/connection`, `/accounts/self`, `/accounts/energy`.
* Existing placeholder copy for account detail can stay as fallback only if an invalid account route appears.
