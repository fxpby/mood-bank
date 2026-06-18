# P1 Topic Flow Capture

## Goal

Connect existing "把话题放进稍后 / 保存一个话题" choices to the real Topics / discovery-points data model, so choosing that self-owned action actually stores a gentle later point instead of only showing copy.

## What I Already Know

* `/topics` is now a real "稍后再看" page backed by `DiscoveryPoint[]`.
* `TriggerPage` already offers next action `save_later_topic` labelled `把话题放进稍后`.
* `QuickRecordPage` already offers next action `save_later_topic` labelled `保存一个话题`.
* `AppStoreContext` already exposes `saveDiscoveryPoint`.
* Saving or reviewing topics must not create Connection / Self / Energy impacts by default.

## Requirements

* Trigger completion:
  * If selected next action is `save_later_topic`, show a completion action that stores a discovery point.
  * The saved point should use:
    * title from the captured fact, or a short fallback
    * kind `topic`
    * sourceType `trigger`
    * sourceSnippet from captured fact / urge / next action context
  * After save, show success copy and route option to `/topics`.
* Quick Record save:
  * If `nextAction === "save_later_topic"`, create one linked discovery point alongside the episode.
  * The saved point should use:
    * title from record title
    * kind `topic`
    * sourceType `episode`
    * sourceId of the new episode
    * sourceTitle of the episode
    * sourceSnippet from facts
    * note that it came from choosing "保存一个话题"
  * If quick record save fails, do not create the discovery point or show success.
* The additional topic creation must not add account impacts.
* Storage failure must not claim the topic was saved.
* Do not add batch capture, topic detail, or new account rules in this task.

## Acceptance Criteria

* [ ] Trigger flow with `把话题放进稍后` can save a discovery point.
* [ ] Trigger flow success offers opening `/topics`.
* [ ] Quick Record with `保存一个话题` saves an episode and creates one linked discovery point.
* [ ] The linked discovery point persists across refresh and appears in `/topics`.
* [ ] Topic creation does not change derived account summaries.
* [ ] If save fails, no false success copy is shown.
* [ ] `npm run typecheck`, `npm test`, and `npm run build` pass.

## Technical Approach

* Add a store action that can save an episode plus optional discovery point atomically in one `commitState` call.
* Reuse existing `saveDiscoveryPoint` for Trigger because Trigger currently has no persisted source record.
* Keep page form/confirmation state route-local.
* Extend focused domain/store tests for topic side effects and no account impact side effects.

## Decision

**Context**: Trigger and Quick Record already expose "save later topic" as an owned next action. After the Topics page was added, leaving those actions disconnected would make the UI feel inconsistent.

**Decision**: Implement only two connection points: Trigger completion direct save and Quick Record episode-linked save.

**Consequences**: Users can retrieve later points from the flows that already suggest them. Rich incoming, draft checker, batch capture, and topic detail remain later work.

## Out Of Scope

* Batch capture of multiple discovery points.
* Editing created discovery points from source flows.
* Topic detail route.
* Review notes.
* Converting discovery points to experiments or personal actions.
* New account impact rules for topic saving/review.

## Technical Notes

* Relevant files:
  * `src/routes/TriggerPage.tsx`
  * `src/routes/QuickRecordPage.tsx`
  * `src/store/AppStoreContext.tsx`
  * `src/domain/topics.ts`
  * `src/domain/topics.test.ts`
  * `src/domain/types.ts`
