# Record Detail Anchor Entry

## Goal

Let a user see or save one stabilizing anchor directly from Record Detail, so returning to an episode can surface the supportive sentence that came from that moment without making the record feel like a task or changing account movement.

## What I Already Know

- Record Detail already shows the episode, account movements, and linked topics.
- Topic Detail can save standalone anchors into `state.anchors`.
- Return-To-Self can save anchors with `sourceType: "return_to_self"`.
- `Anchor.sourceType` currently allows `"episode" | "return_to_self"`, so episode-linked anchors can use existing schema.
- Home reads the newest anchor from `state.anchors[0]`.
- Durable writes must go through `AppStoreContext`; no direct storage access from route components.

## Requirements

- Record Detail must include an anchor section after the episode content and before or near linked follow-up content.
- If the episode itself has an `anchor`, show it as the saved phrase for that record.
- If existing anchors are linked to the episode through `sourceType: "episode"` and `sourceId`, show the newest linked anchor.
- If no linked anchor exists, initialize an editable anchor input from `episode.anchor` when present, otherwise from a concise safe default derived from the episode context.
- The user can edit the anchor sentence before saving.
- Saving a non-empty anchor must persist through the existing `saveAnchor` store action with `sourceType: "episode"` and `sourceId: episode.id`.
- Empty or whitespace-only anchor text must not save; show gentle validation copy.
- Saving an anchor must not update episode content, account impacts, topics, derived summaries, or daily market state.
- The UI copy must frame anchors as memory support, not proof, contract, reward, diagnosis, or relationship verdict.

## Acceptance Criteria

- [ ] Record Detail shows an anchor panel for found records.
- [ ] Existing episode-linked anchors are visible newest-first or newest-only.
- [ ] A non-empty anchor can be saved from Record Detail and appears as the newest app anchor.
- [ ] Saved anchors include `sourceType: "episode"` and the current episode id.
- [ ] Blank anchor input does not persist and shows validation.
- [ ] Saving an anchor does not change account rows, linked topics, or episode fields.
- [ ] Not-found Record Detail remains unchanged.

## Definition of Done

- Tests added/updated for episode-linked anchor persistence or selector behavior where appropriate.
- `npm run typecheck` passes.
- `npm test` passes.
- `npm run build` passes.
- Forbidden product-copy scan against `src` passes.
- Browser validation on a record detail route confirms the anchor panel saves and renders.

## Out of Scope

- Anchor list/detail management.
- Deleting anchors.
- Linking topic-saved anchors back to topics.
- AI-generated anchor suggestions.
- Account impact changes from anchor saving.
- Schema migration or backend/sync work.

## Technical Notes

- Likely files:
  - `src/domain/selectors.ts`
  - `src/domain/selectors.test.ts`
  - `src/routes/RecordDetailPage.tsx`
  - possibly `src/styles/screens.css`
- Existing `saveAnchor(input)` already accepts `AnchorInput`; `AnchorInput.sourceType` follows `Anchor["sourceType"]`.
- Existing `Anchor.sourceType` supports `"episode"`, so no type widening is required.
- Keep the feature route-local and deterministic.
