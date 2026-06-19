# Home Anchor Source Link

## Goal

Let the Home "今天的锚点" preview open the source record when the newest anchor came from an episode, so a user can move from a stabilizing phrase back to the context that created it without adding an anchor-management screen.

## What I Already Know

- Home currently reads `state.anchors[0]?.text` directly and displays a fallback sentence when no anchors exist.
- Record Detail can now save anchors with `sourceType: "episode"` and `sourceId` set to the current episode id.
- `buildRecordRoute(...)` already creates typed record detail routes.
- Home already receives `navigate(route)` and has a latest-record preview, but that preview is currently not a button.
- Anchors are support phrases, not evidence rows or tasks; anchor saving must not affect account summaries.

## Requirements

- Home must still show a fallback anchor sentence when no anchors exist.
- When the newest anchor has `sourceType: "episode"` and a `sourceId`, Home should show a small action to open the source record.
- The source action must navigate with `buildRecordRoute(anchor.sourceId)`.
- Anchors without an episode source must remain plain support text with no source action.
- The copy must not imply proof, contract, reward, or relationship verdict.
- No durable writes, account impact changes, schema changes, or storage adapter changes.

## Acceptance Criteria

- [ ] Home renders the latest anchor text as before.
- [ ] Episode-linked latest anchors show an "打开来源记录" action.
- [ ] Clicking that action navigates to `/record/<sourceId>`.
- [ ] Standalone or return-to-self anchors do not show the source-record action.
- [ ] Empty-anchor fallback still renders and does not show a source action.
- [ ] No account summaries or persisted data change.

## Definition of Done

- Existing checks pass: `npm run typecheck`, `npm test`, `npm run build`.
- Forbidden product-copy/network scan against `src` passes.
- Browser validation confirms Home latest anchor can navigate back to Record Detail.

## Out of Scope

- Anchor list/detail page.
- Return-To-Self source navigation.
- Topic-linked anchor source navigation.
- Deleting, editing, or reordering anchors.
- Persisting derived Home preview models.

## Technical Notes

- Likely file: `src/routes/HomePage.tsx`.
- Possible tests only if a selector/helper is introduced. If kept UI-only, browser validation is enough.
- Use `buildRecordRoute(...)` rather than route string concatenation.
