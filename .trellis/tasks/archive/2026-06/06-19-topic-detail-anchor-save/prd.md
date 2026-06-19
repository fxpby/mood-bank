# Topic Detail Anchor Save

## Goal

Let a user save one supportive sentence from a topic detail review as an anchor, so a later insight can become a small phrase available on Home and Return-To-Self without turning the topic into a task.

## Requirements

- Topic detail must include a lightweight "保存为锚点" area near the review note flow.
- The anchor text should initialize from the current review note when available, otherwise from the topic title.
- The user can edit the anchor sentence before saving.
- Saving creates one `Anchor` record through the app store boundary.
- Saved anchors should appear newest-first in `state.anchors`, matching Return-To-Self saved anchors.
- Empty or whitespace-only anchor text must not save; show gentle validation copy.
- Save success and save failure copy must be visible and honest.
- Saving an anchor must not update topic status, topic note, account impacts, or derived storage-jar summaries.
- Missing topic behavior remains unchanged.

## Acceptance Criteria

- [ ] Topic detail shows a short anchor-saving section.
- [ ] Saving a non-empty anchor persists it locally.
- [ ] Home's "今天的锚点" can show the newly saved anchor because it is newest-first.
- [ ] Blank anchor input does not persist and shows a validation message.
- [ ] Saving an anchor does not change discovery point status or note.
- [ ] Derived storage-jar summaries are unchanged by anchor saving.
- [ ] Typecheck, tests, build, forbidden-copy scan, and browser check pass.

## Definition of Done

- Store action added for saving anchors.
- Domain helper and tests added for anchor persistence and no account movement.
- Topic detail UI added using existing panel/form patterns.
- Frontend state-management spec updated with the new action contract.
- Trellis task, archive, and journal records committed after work commit.

## Technical Approach

- Add `AnchorInput` to `src/domain/types.ts`.
- Add `addAnchorToState(...)` in a small domain helper module or existing suitable domain file.
- Add `saveAnchor(input): StoreWriteResult<Anchor>` to `AppStoreContext`.
- Update `TopicDetailPage` with route-local anchor text state and a save button.
- Keep `Anchor.sourceType` unchanged unless the existing type is widened in a compatible way. If no `topic` source type is added, save as a plain anchor with no source metadata to avoid schema churn.

## Decision (ADR-lite)

Context: Topic Detail now supports review notes, but a user may also notice one short phrase that is useful as a stabilizing anchor later.

Decision: Save the phrase into the existing `anchors` list as a standalone anchor from Topic Detail.

Consequences: The feature reuses Home and Return-To-Self surfaces immediately. It does not create topic-linked anchor history or analytics; those can be added later only with a dedicated PRD.

## Out of Scope

- Anchor list management or deletion.
- Linking anchors back to topics in UI.
- Account impacts, status automation, experiment/action creation.
- AI-generated anchor suggestions.
- Rich text, tags, or categories.
- Backend, login, sync, telemetry, push, or network calls.

## Technical Notes

- Relevant files inspected:
  - `src/routes/TopicDetailPage.tsx`
  - `src/routes/HomePage.tsx`
  - `src/routes/ReturnToSelfPage.tsx`
  - `src/domain/types.ts`
  - `src/domain/selectors.ts`
  - `src/domain/validation.ts`
  - `src/store/AppStoreContext.tsx`
  - `.trellis/spec/frontend/state-management.md`
- Existing anchor behavior:
  - Return-To-Self can save anchors when `anchorSaved` is checked.
  - Home reads `state.anchors[0]?.text` for "今天的锚点".
  - `Anchor.sourceType` currently supports `"episode" | "return_to_self"` only.
