# Rich Incoming Anchor Save

## Goal

Let Rich Incoming Review users save one reusable support anchor directly from the completion state, so a warm or stabilizing line can be kept for Home and Return-To-Self without turning the incoming message into evidence, scoring, or a reply obligation.

## Requirements

* The completion page shows an editable anchor draft with gentle default copy.
* The default anchor is deterministic and based only on the user's route-local selections, not on AI parsing or sender-intent inference.
* Tapping save with non-empty text calls `actions.saveAnchor({ spaceId, text })`.
* Blank text shows validation copy and performs no durable write.
* Successful save shows copy consistent with existing anchor flows: the newest Home anchor will show this phrase first.
* Failed save shows honest storage failure copy and does not claim persistence.
* Saving this anchor must not create account impacts, discovery points, episodes, drafts, experiments, source links, relationship verdicts, or sender psychology.
* Existing batch discovery-point save stays available and independent.

## Acceptance Criteria

* [ ] `/rich-incoming` completion exposes a clear "存成锚点" action with editable text.
* [ ] Saving an anchor creates exactly one standalone `Anchor` newest-first.
* [ ] Empty anchor text shows `先留一句能托住自己的话。`.
* [ ] Anchor save success does not conflict with discovery-point save success copy.
* [ ] Domain tests cover anchor suggestion copy and no account-summary movement from saving an anchor.
* [ ] README and first-release status PRD reflect that direct Rich Incoming anchor save is implemented.

## Definition of Done

* Tests added or updated where behavior changed.
* `npm run typecheck`, `npm test`, `npm run build`, and `git diff --check` pass.
* Dirty user/design artifacts remain uncommitted.

## Technical Approach

* Add a pure helper in `src/domain/richIncoming.ts` to build a deterministic support anchor suggestion from `RichIncomingInput`.
* Reuse the existing `saveAnchor` store action and standalone anchor contract.
* Keep route state for anchor text, success message, and validation error in `RichIncomingPage`.
* Update documentation only for behavior now implemented.

## Decision (ADR-lite)

**Context**: The main PRD previously marked direct Rich Incoming anchor save as optional backlog. Existing anchor infrastructure already supports standalone anchors, and Home shows the newest anchor.

**Decision**: Implement direct Rich Incoming anchor save as a standalone anchor with no source link.

**Consequences**: The feature stays small and consistent with Topic Detail anchor behavior. The app can save a stabilizing phrase from the moment without adding source-linked UI or expanding persisted validation.

## Out of Scope

* AI summarization or automatic extraction from pasted message content.
* Partner intent inference, relationship scoring, or proof of future connection.
* Reply generation, send/copy actions, or requiring every thread to receive a response.
* New durable Rich Incoming model.
* Extending `Anchor.sourceType` for `rich_incoming`.

## Technical Notes

* `src/store/AppStoreContext.tsx` already exposes `saveAnchor`.
* `src/domain/anchors.ts` already trims anchors, prepends newest-first, and no-ops blank input.
* `src/routes/RecordDetailPage.tsx` and `src/routes/TopicDetailPage.tsx` provide the established validation and success/failure copy.
* `.trellis/spec/frontend/state-management.md` says Rich Incoming Review previously must not create anchors by default; this task changes only explicit user save behavior and preserves no-write completion.
