# P1 Rich Incoming Review

## Goal

Add a lightweight local "收到很多内容，不知道怎么接" flow. The flow helps the user receive a long, warm, vulnerable, or dense incoming message without turning every thread into an immediate response obligation, and lets them save selected threads as discovery points for later.

## What I Already Know

* The full product PRD defines this as a P1 flow, not a Home emergency primary action.
* Entry points should be light:
  * Record -> "收到一段很长/很暖/信息很多的话"
  * Return-to-Self -> "我收到很多内容，不知道怎么接"
* The MVP must be manual user-guided threading:
  * no AI parsing
  * no automatic summary
  * no sender psychology analysis
  * no recipient reaction prediction
  * no generated reply optimized for connection
* Existing state already supports `DiscoveryPointSourceType: "rich_incoming"`.
* `saveDiscoveryPoint` persists discovery points without account impacts by default.
* Recent flows established route-local step patterns and explicit save semantics.

## Assumptions

* Implement route `/rich-incoming` even though the original route map listed `/flow/rich-incoming`; this matches the current app's flat route style (`/signal-check`, `/draft-check`).
* First increment saves discovery points only. It does not create `Episode`, `Anchor`, `AccountImpact`, or a durable rich incoming review model.
* "保存为记录" can route to Quick Record with a lightweight prefill if route-state support is already compatible; otherwise it can route to `/record/new` without writing.
* If more than three threads are selected, this increment will show the first three as active and keep the rest available for "存进稍后" through summary copy, without building a separate overflow editor.

## Requirements

* Add route `/rich-incoming`.
* Add entry point in Record page:
  * label: `收到一段很长/很暖/信息很多的话`
* Add entry point in Return-To-Self page completion:
  * label: `我收到很多内容，不知道怎么接`
* Flow structure:
  * Step 0 / landing: optional message note, message-shape chips, actions `拆成几条线索`, `直接回到自己`
  * Step 1: received thread chips, max three active threads shown for handling
  * Step 2: mixed emotion chips
  * Step 3: handling choice for each active thread
  * Step 4: enough-for-now response direction
  * Completion summary
* Thread labels must include:
  * `被看见/被理解`
  * `澄清/解释`
  * `脆弱/自我暴露`
  * `表达困难/语言缓冲`
  * `失眠/反复复盘`
  * `完美主义/拖延`
  * `价值观/意义`
  * `自我照顾/互相照顾`
  * `需要稍后再聊的话题`
  * `其他`
* Handling choices per active thread:
  * `我先收到了`
  * `这条需要回应`
  * `放进稍后`
  * `不需要回应`
* Completion actions:
  * `把发现点存进稍后`
  * `保存为记录`
  * `进入草稿自检`
  * `回到自己`
  * `完成`
* Saving discovery points:
  * must be explicit
  * uses `actions.saveDiscoveryPoint`
  * saves one point per active thread marked `放进稍后`, plus selected overflow threads if any
  * uses `sourceType: "rich_incoming"`
  * creates no account impacts
* UI copy must not imply:
  * the app summarized the incoming message
  * the app knows the sender's intent
  * the user must respond to all threads
  * the suggested direction is a generated reply or response optimization

## Acceptance Criteria

* [ ] `/rich-incoming` opens a real local flow.
* [ ] Record page has an entry to `/rich-incoming`.
* [ ] Return-To-Self completion has an entry to `/rich-incoming`.
* [ ] User can complete landing -> threads -> mixed emotion -> handling -> direction -> summary.
* [ ] More than three selected threads are reduced to three active threads for handling.
* [ ] User can save discovery points to `/topics`.
* [ ] Completing without save creates no persisted data.
* [ ] Saving discovery points creates no account impacts.
* [ ] User can route to Draft Check, Return-To-Self, and Quick Record from completion.
* [ ] No AI summary, sender analysis, reply optimization, send integration, or response prediction appears.
* [ ] `npm run typecheck`, `npm test`, and `npm run build` pass.

## Definition Of Done

* Focused unit tests cover thread selection, discovery-point payload builders, and no account-summary changes.
* Browser verification covers route entry, thread flow, save-to-topics, no-save finish, route links, and 360px layout.
* Forbidden copy/network scan has no hits.
* Commit content is reported after completion.

## Out Of Scope

* AI parsing/summarization.
* Generated reply drafts.
* Send/copy integration.
* Durable `RichIncomingReview` model.
* Connection/Self/Energy account impacts from this flow.
* Evidence prompts and connection-impact logic.
* Anchor save.
* Full overflow-thread editor.

## Technical Notes

* Likely files:
  * `src/utils/route.ts`
  * `src/App.tsx`
  * `src/routes/RichIncomingPage.tsx`
  * `src/routes/RecordPage.tsx`
  * `src/routes/ReturnToSelfPage.tsx`
  * `src/domain/richIncoming.ts`
  * `src/domain/richIncoming.test.ts`
  * `src/styles/screens.css`
  * `.trellis/spec/frontend/state-management.md`
* Existing patterns:
  * `DraftCheckPage` for multi-step local state and explicit saves.
  * `SignalCheckPage` for optional save without account impacts.
  * `topics.ts` for discovery point payload behavior.
