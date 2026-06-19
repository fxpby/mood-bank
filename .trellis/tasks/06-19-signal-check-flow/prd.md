# P1 Signal Check Flow

## Goal

Replace the `/signal-check` placeholder with a lightweight "想检查信号" buffering flow. The flow helps users notice the urge to reread, refresh, check status, or seek reassurance, preview both good and absent-signal outcomes, and choose one 10-minute user-owned action without shame or surveillance.

## What I Already Know

* Home already shows "想检查信号" as a primary action, currently routed to an honest placeholder.
* The full product PRD defines a four-step P1 flow: confirmation target, good-signal preview, bad/absent-signal preview, and 10-minute non-checking action.
* Existing store supports `saveDiscoveryPoint`, which can persist a low-pressure source-linked or manual discovery point without account impacts.
* The current app has no backend, AI, telemetry, external-app monitoring, or notification behavior.
* `DiscoveryPointSourceType` already includes `draft_check` but not `signal_check`; this task can either add a new source type or save signal-check output as `manual`.

## Assumptions

* MVP should implement the 45-90 second buffering flow, not the optional connection-continuity or digital-boundary branches.
* This flow should be no-write by default. Saving a summary as a discovery point is explicit and optional.
* Choosing "我还是想检查" is a valid completion path and must not create negative account impact.
* The first increment should not add account impact rules for signal check; account effects can be added later when completion tracking exists.

## Requirements

* Replace `/signal-check` placeholder with a real route.
* Keep the Home entry label "想检查信号"; remove "稍后支持"/"稍后" badge for that action only.
* Flow structure:
  * landing screen with "开始缓冲" and "直接回到自己"
  * Step 1: choose what the user is trying to confirm
  * Step 2: choose likely reaction if the signal feels good, with calibration copy
  * Step 3: choose likely reaction if the signal is absent/bad, with calibration copy
  * Step 4: choose one 10-minute action, including "我还是想检查"
  * completion screen with separate non-checking and checking copy
* UI should be chip-first, one question per screen, with a back action.
* Completion should offer:
  * "回到自己"
  * "完成"
  * "保存这个模式" / "保存结果" as an explicit optional save
* Explicit save should create one `DiscoveryPoint`:
  * title communicates the chosen target or "一次想检查信号"
  * kind can be `discovery` or `action_idea`
  * theme should be `old_echo`, `emotion`, or `action_experiment` based on selected path where reasonable
  * note should summarize target, good-signal reaction, bad/absent-signal reaction, chosen action, and optional checking result
  * sourceType may be `manual` unless this task adds `signal_check`
* Saving the summary must not create `Episode`, `AccountImpact`, `Draft`, or account summary changes.
* Storage failure must use honest copy and not claim the pattern was saved.
* This flow must not:
  * block access to external apps
  * monitor messages, read receipts, online status, response timing, social media, or feeds
  * interpret another person's silence or activity
  * use shame/failure/streak language
  * give relationship verdicts or diagnostic labels

## Acceptance Criteria

* [ ] `/signal-check` opens a real flow instead of placeholder copy.
* [ ] Home "想检查信号" no longer looks like a future placeholder.
* [ ] User can complete target -> good preview -> absent preview -> 10-minute action.
* [ ] "我还是想检查" completion path is allowed and uses non-shaming copy.
* [ ] User can route to `/return-to-self` from landing or completion.
* [ ] User can explicitly save the pattern/result as a discovery point and see it in `/topics`.
* [ ] Completing without save creates no persisted data.
* [ ] Saving creates no account impact and does not change derived account summaries.
* [ ] `npm run typecheck`, `npm test`, and `npm run build` pass.

## Definition Of Done

* Focused unit tests cover any new pure builder/helper used for discovery point payloads or no-account-impact behavior.
* Browser verification covers non-checking path, checking path, explicit save -> `/topics`, no-save completion, and mobile layout.
* Forbidden copy/network scan has no hits.
* Commit content is reported after completion.

## Out Of Scope

* Digital-boundary mini-check branch.
* Connection-continuity mini-check branch.
* Account impacts for completed signal-check practice.
* Persistent signal-check history model.
* Draft self-check.
* Notifications, timers, app blocking, external app monitoring, or read-receipt/status integrations.

## Technical Notes

* Likely files:
  * `src/components/PrimaryActionPanel.tsx`
  * `src/App.tsx`
  * new `src/routes/SignalCheckPage.tsx`
  * possibly `src/domain/signalCheck.ts`
  * `src/domain/types.ts` if adding `signal_check` source type
  * `src/styles/screens.css`
* Relevant specs:
  * `.trellis/spec/frontend/index.md`
  * `.trellis/spec/frontend/state-management.md`
  * `.trellis/spec/frontend/quality-guidelines.md`
  * `.trellis/spec/frontend/type-safety.md`
  * `.trellis/spec/frontend/component-guidelines.md`
* Existing PRD references:
  * `.trellis/tasks/archive/2026-06/06-17-emotional-account-pwa/prd.md` section "想检查信号" Page-Level Flow
  * same PRD section `P1 "想检查信号" Blueprint`
