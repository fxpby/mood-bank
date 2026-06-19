# topic review anchor handoff

## Goal

Make Topic Detail smoother when a user turns a later reflection into an anchor. After saving a review note, the user should be able to copy that saved note into the anchor draft without retyping. After saving an anchor, the user should have a direct route back to Home where the latest anchor appears.

## What I Already Know

- `/topics/:id` already supports saving a review note through `actions.updateDiscoveryPointReviewNote(...)`.
- `/topics/:id` already supports saving a standalone anchor through `actions.saveAnchor(...)`.
- Topic-detail anchors are intentionally standalone unless a future PRD widens `Anchor.sourceType`.
- Home already displays the newest anchor in `state.anchors[0]`.

## Requirements

- After a successful review note save, expose a low-pressure action to use the saved note as the anchor draft.
- The action must be route-local only: set the existing `anchorText`, not write any durable anchor until the user taps `保存为锚点`.
- If the saved review note is blank/cleared, do not show the handoff action.
- After a successful anchor save, show a direct `回到首页看锚点` action.
- Do not change `Anchor`, `DiscoveryPoint`, store action signatures, storage schema, or account-impact rules.
- Preserve existing validation and honest storage-failure copy.

## Acceptance Criteria

- [ ] Saving a non-empty review note shows a way to put it into the anchor draft.
- [ ] Clicking that action updates the anchor textarea with the saved note.
- [ ] Saving the anchor still goes through `actions.saveAnchor(...)`.
- [ ] After anchor save, the page offers `回到首页看锚点`.
- [ ] Clearing a review note does not show the handoff action.
- [ ] `npm run typecheck`, `npm test`, and `npm run build` pass.

## Out Of Scope

- Linking topic-saved anchors back to topics.
- Auto-saving anchors from review notes.
- Marking topics reviewed when saving notes or anchors.
- Editing/deleting anchors.
- Any account impact from discovery point or anchor work.

## Technical Notes

- Likely file: `src/routes/TopicDetailPage.tsx`.
- Existing `navigate("/home")` can support the post-save Home action.
- This is a route-local UI affordance, not a new product data contract.
