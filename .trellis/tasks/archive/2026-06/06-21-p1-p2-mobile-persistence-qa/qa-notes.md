# P1/P2 Mobile Persistence QA Notes

Date: 2026-06-21

## Scope

- Mobile viewport target: 360px wide.
- Routes: `/home`, `/record/new`, `/topics`, `/topics/:id`, `/experiments`, `/experiments/:id`, `/accounts/self`, `/settings`, and `/emotion-calibration`.
- Checks: route rendering, text wrapping, touch target sanity, save persistence after refresh, reset/delete confirmation, and forbidden transactional copy.

## Route Checks

Viewport was set to 360x780 in the in-app browser.

| Route | Result | Notes |
|---|---|---|
| `/home` | Pass | Trigger-first home rendered; "校准一个情绪" visible before account summary; no horizontal overflow. |
| `/record/new` | Pass | Quick record chips and fields rendered; existing draft recovery did not break layout; no horizontal overflow. |
| `/topics` | Pass | Existing dense list rendered; filters and card actions remained reachable; no horizontal overflow. |
| `/topics/topic_fa45100b-8ef1-4673-b6c1-b5705f6358a8` | Pass | Newly saved QA topic opened in detail view; action sections rendered; no horizontal overflow. |
| `/experiments` | Pass | Recommended actions, manual three-sentence form, and saved practice list rendered; no horizontal overflow. |
| `/experiments/experiment_773a19f2-f77b-4c37-86ac-bf92f410406b` | Pass | Newly saved QA experiment opened in detail view; edit/status/attempt sections rendered; no horizontal overflow. |
| `/accounts/self` | Pass | Self detail showed readable reasons and personal action menu; no English evidence keys; no horizontal overflow. |
| `/settings` | Pass | Local-only copy, storage status, disabled export/import placeholders, and delete entry rendered; no horizontal overflow. |
| `/emotion-calibration` | Pass | P2 branch landing rendered with "开始校准" and "先回到自己"; no horizontal overflow. |

## Persistence Checks

- Topic persistence: created `QA移动持久化发现 1782005876140` through the `/topics` manual form. It remained visible after page reload.
- Topic detail route: opened the new topic at `/topics/topic_fa45100b-8ef1-4673-b6c1-b5705f6358a8`; title and detail sections rendered.
- Experiment persistence: created `QA移动持久化练习 1782005954025` through the `/experiments` manual three-sentence form. It navigated to detail view and remained visible after reload.
- Experiment detail route: verified `/experiments/experiment_773a19f2-f77b-4c37-86ac-bf92f410406b` after reload; title, edit/status/attempt sections rendered.

## Reset/Delete Checks

- `/settings` delete path opens a labelled confirmation dialog: "删除本地数据？".
- Dialog copy explains that records, discovery points, anchors, drafts, return-to-self practices, and settings will be deleted and cannot be recovered in-app.
- Dialog exposes explicit cancel and confirm actions: "先不删" and "删除本地数据".
- QA clicked "先不删" only. The dialog closed and the app stayed on `/settings`; no data was deleted.

## Findings

- No small code/CSS/copy defects were found during this pass.
- Visible route copy checked during the pass did not include forbidden transactional terms: `兑换`, `消费`, `余额不足`, `还债`, `对账`, `记账`.
- No larger design-heavy issue was added from this QA pass. Existing UI redesign work remains intentionally paused.
