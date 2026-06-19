# P1 Draft Self Check Flow

## Goal

Replace the `/draft-check` placeholder with a lightweight local "草稿自检" flow. The flow helps users decide whether a draft is ready enough, should be softened, saved for later, converted to a private record/later topic, or paused with Return-To-Self, without rewriting the message or optimizing for a reply.

## What I Already Know

* Home already shows "草稿自检" as a primary action, currently marked as "稍后".
* The full product PRD defines a deterministic flow: draft input, state check, motivation, no-response tolerance, content risk, stance, after-send preview, and recommendation.
* The app already supports route-local state, `saveDraft`, `saveDiscoveryPoint`, `saveQuickRecord`, and Return-To-Self routing.
* `DiscoveryPointSourceType` already includes `draft_check`.
* `Draft` persists only quick-record draft data today; it can store the draft text in `data.facts` without adding account impacts.
* The recent `/signal-check` flow established a pattern for local step flows with optional discovery-point save and no account impacts.

## Assumptions

* MVP should be deterministic and local; no AI rewrite, no send button, no external app integration.
* It is acceptable to store draft text as a quick-record draft with `kind: "quick_record"` and `data.facts`.
* The first increment should not create account impacts from completing draft self-check. Account impact rules can come later when completion tracking is more explicit.
* "边界清晰检查" can be represented as a recommendation/action direction, not a real sub-route in this task.

## Requirements

* Replace `/draft-check` placeholder with a real route.
* Keep Home label "草稿自检"; remove "稍后支持"/"稍后" badge for that action.
* Flow structure:
  * Draft input landing: textarea, "开始自检", "还没写，先检查状态", "直接回到自己"
  * Step 1: state check
  * Step 2: send motivation
  * Step 3: no-response tolerance
  * Step 4: content risk
  * Step 5: stance check using TED/drama-triangle language
  * Step 6: after-send preview
  * recommendation screen
* UI should be chip-first after the draft input, one question per screen, with back navigation.
* Recommendation engine should return one of:
  * `ready_enough`
  * `lighten_it`
  * `save_as_draft`
  * `private_record_first`
  * `boundary_expression`
  * `return_to_self_first`
* Recommendation copy must include the rule/reason that produced it.
* Completion actions:
  * Always offer "回到自己" and "完成".
  * `ready_enough`: offer explicit "保存检查结果" as a discovery point; no in-app send button.
  * `lighten_it`: offer explicit "保存轻一点方向" as a discovery point and "保存草稿".
  * `save_as_draft`: offer "保存草稿".
  * `private_record_first`: offer "转成私下记录" through `saveQuickRecord` when draft text exists, and/or "放进稍后" as a discovery point.
  * `boundary_expression`: offer "保存边界方向" as a discovery point and "保存草稿".
  * `return_to_self_first`: offer "保存草稿不发" and "进入回到自己".
* Saves must use existing store actions:
  * `saveDraft` for local draft persistence
  * `saveDiscoveryPoint` for recommendation/action direction/later topic
  * `saveQuickRecord` only for explicit private record conversion
* Storage failure must use honest copy and not claim the item was saved.
* Saving a draft, discovery point, or private record from this flow must not create partner inference, reply optimization, or negative account impact.
* This flow must not:
  * rewrite the user's draft
  * predict the other person's reaction
  * recommend wording designed to obtain a response
  * include a send button
  * inspect external apps
  * automatically detect privacy risks from pasted content
  * shame the user for sending anyway

## Acceptance Criteria

* [ ] `/draft-check` opens a real flow instead of placeholder copy.
* [ ] Home "草稿自检" no longer looks like a future placeholder.
* [ ] User can complete draft input -> six checks -> recommendation.
* [ ] Recommendation is deterministic and displays the rule/reason.
* [ ] User can save a draft through explicit action.
* [ ] User can save a recommendation/later topic to `/topics`.
* [ ] User can convert non-empty draft into a private record through explicit action.
* [ ] User can route to `/return-to-self`.
* [ ] Completing without save creates no persisted data.
* [ ] Saving draft or topic creates no account impact.
* [ ] No AI rewrite, send button, prediction, or relationship verdict copy appears.
* [ ] `npm run typecheck`, `npm test`, and `npm run build` pass.

## Definition Of Done

* Focused unit tests cover recommendation rules and save payload builders.
* Browser verification covers ready-enough/recommendation path, save draft, save topic, private record conversion, Return-To-Self route, no-save completion, and 360px layout.
* Forbidden copy/network scan has no hits.
* Commit content is reported after completion.

## Out Of Scope

* AI rewrite or suggested message wording.
* Clipboard copy.
* In-app send or external messaging integration.
* Boundary clarity sub-flow.
* Completion account impacts for draft self-check.
* Timed reminders or tomorrow review scheduling.
* Rich incoming message review.

## Technical Notes

* Likely files:
  * `src/components/PrimaryActionPanel.tsx`
  * `src/App.tsx`
  * new `src/domain/draftCheck.ts`
  * new `src/domain/draftCheck.test.ts`
  * new `src/routes/DraftCheckPage.tsx`
  * `src/styles/screens.css`
  * `.trellis/spec/frontend/state-management.md`
* Existing patterns:
  * `src/routes/SignalCheckPage.tsx` for local step flow, completion card, optional discovery-point save.
  * `src/domain/signalCheck.ts` for copy unions and save payload builder.
  * `src/store/AppStoreContext.tsx` for `saveDraft`, `saveDiscoveryPoint`, `saveQuickRecord`.
* Existing PRD references:
  * `.trellis/tasks/archive/2026-06/06-17-emotional-account-pwa/prd.md` section `"草稿自检" Page-Level Flow`
  * same PRD section `P1 "草稿自检" Blueprint`
