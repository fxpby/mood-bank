# Topic Review Note

## Goal

Let a user return to a saved discovery point and add a lightweight review note, so the "saved for later" area can support later seeing, not only storage and status changes.

## Requirements

- Topic detail must show an editable "回看补记" area for the selected discovery point.
- The field is initialized from the existing discovery point `note`.
- Saving updates only that discovery point's `note` and `updatedAt`.
- Empty or whitespace-only input clears the note.
- Save success and save failure copy must be visible and honest.
- Status actions remain separate; saving a note must not automatically mark the point reviewed.
- Review note updates must not change storage jar/account summaries or create account impacts.
- Missing topic behavior remains the current empty state with a return action.

## Acceptance Criteria

- [ ] From a topic detail page, changing the review note and tapping save persists it locally.
- [ ] Returning to the same topic shows the saved note.
- [ ] Saving whitespace removes the note from the detail rows.
- [ ] Topic status is unchanged when only the note is saved.
- [ ] Derived storage jar summaries are unchanged by topic note updates.
- [ ] Typecheck, tests, build, and forbidden-copy scan pass.

## Definition of Done

- Tests added or updated for the topic note domain helper.
- Store action added for the durable topic note write.
- UI added using existing form and panel patterns.
- Trellis task, archive, and journal records are committed after work commit.

## Technical Approach

- Add a typed `DiscoveryPointReviewNoteInput` with `id` and `note`.
- Add `updateDiscoveryPointNoteInState(state, input, timestamp)` in `src/domain/topics.ts`.
- Add `updateDiscoveryPointReviewNote` to `AppStoreContext` actions.
- Update `TopicDetailPage` to maintain local textarea state and call the new store action on save.
- Reuse current `note` on `DiscoveryPoint`; do not introduce a separate review-note history model for MVP.

## Decision (ADR-lite)

Context: The current topic detail page supports review status changes but cannot capture later reflections, even though discovery points are intended for later return.

Decision: Update the existing `note` field from topic detail as a single editable review note.

Consequences: This keeps the MVP small and consistent with the current data model. It does not preserve note history; versioned reflections can be added later if repeated review becomes central.

## Out of Scope

- Multiple review comments or version history.
- Rich text, attachments, tags, or markdown rendering.
- AI-generated summaries or prompts.
- Automatic account impacts, experiment creation, or action conversion.
- Status automation after saving.
- Backend, login, sync, telemetry, push, or network calls.

## Technical Notes

- Relevant files inspected:
  - `src/routes/TopicDetailPage.tsx`
  - `src/domain/topics.ts`
  - `src/domain/types.ts`
  - `src/store/AppStoreContext.tsx`
  - `src/domain/topics.test.ts`
  - `src/styles/screens.css`
- Project constraints:
  - Local-first only.
  - Durable writes go through `AppStoreContext` actions.
  - No direct `localStorage` outside the storage adapter.
  - Discovery point changes must not alter derived storage jar summaries.
