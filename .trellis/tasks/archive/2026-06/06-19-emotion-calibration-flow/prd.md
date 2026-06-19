# P2 Light Emotion Calibration Flow

## Goal

Add a compact local emotion calibration flow that helps the user reframe a strong emotion as information, protection, or a signal of care, without treating the emotion as an enemy or letting it drive controlling/urgent behavior. The flow should support the user's earlier product direction: emotions like fear are not problems by themselves; the work is to see, allow, understand, and choose a wiser action.

## What I Already Know

* The main PRD includes a P2 light branch for emotion calibration.
* The user explicitly emphasized that fear can be a messenger: it often points to care, possible loss, vulnerability, and self-protection.
* Existing flows already identify emotions in Trigger / Quick Record / Draft Check / Rich Incoming, but do not provide a standalone calibration step.
* Existing durable model supports `DiscoveryPoint` with `theme: "emotion" | "old_echo" | "boundary" | "self_care" | ...`.
* Existing write boundary supports `actions.saveDiscoveryPoint(...)`; discovery points must not create account impacts by default.
* The app is local-first and must not add backend, AI, telemetry, login, sync, push, or external app inspection.

## Assumptions

* Implement route `/emotion-calibration` using the current flat route style.
* Entry point should be light and not dominate Home emergency hierarchy.
* First increment saves an optional discovery point only. It does not create a durable EmotionCalibration model.
* The flow should use predetermined gentle options, not free-form clinical interpretation.
* No professional/diagnostic claim: this is a self-observation aid, not therapy, trauma processing, or crisis intervention.

## Requirements

* Add route `/emotion-calibration`.
* Add a light entry from Home or existing self-support surfaces with label similar to `校准一个情绪`.
* Flow structure:
  * Landing: explain that emotions are signals, not enemies; no diagnosis or automatic analysis.
  * Step 1: choose one emotion to calibrate.
  * Step 2: choose what it may be signaling/protecting.
  * Step 3: choose the action impulse it tends to create.
  * Step 4: choose a wiser next action that allows the emotion but does not hand it the steering wheel.
  * Completion summary.
* Emotion options should include at least:
  * `恐惧/害怕`
  * `焦虑/不安`
  * `羞耻`
  * `内疚`
  * `愤怒`
  * `悲伤`
  * `嫉妒/羡慕`
  * `想念`
  * `混合`
  * `说不清`
* Calibration copy should include the key idea:
  * the emotion itself can be allowed
  * it may point to care, need, boundary, old echo, grief, vulnerability, or values
  * the user can choose not to suppress it and not to let it drive controlling or urgent behavior
* Completion actions:
  * `存为发现点`
  * `回到自己`
  * `记录一下`
  * `完成`
* Saving discovery points:
  * must be explicit
  * uses `actions.saveDiscoveryPoint(...)`
  * uses `sourceType: "manual"` unless a future durable source is introduced
  * uses `theme` based on selected signal: `emotion`, `boundary`, `old_echo`, `self_care`, or `relationship_learning`
  * creates no account impacts
* UI copy must avoid:
  * diagnosing trauma, attachment style, or mental health condition
  * claiming to identify the true source of the emotion
  * saying the emotion is bad/wrong/toxic
  * telling the user to control the other person
  * implying saved discovery points change account summaries

## Acceptance Criteria

* [ ] `/emotion-calibration` opens a real local flow.
* [ ] Home or another self-support surface has a light entry to `/emotion-calibration`.
* [ ] User can complete emotion -> signal/protection -> impulse -> wiser action -> summary.
* [ ] Completion can explicitly save one discovery point to `/topics`.
* [ ] Completing without save creates no persisted data.
* [ ] Saving the discovery point creates no account impacts.
* [ ] Completion links route to Return-To-Self and Quick Record.
* [ ] No AI analysis, diagnosis, trauma-source determination, sender inference, or external app integration appears.
* [ ] `npm run typecheck`, `npm test`, and `npm run build` pass.

## Definition Of Done

* Focused unit tests cover summary/recommendation payload builders and no account-summary changes.
* Browser verification covers direct route, entry route, save-to-topics, no-save finish, and 360px layout if browser tooling is responsive.
* Forbidden copy/network scan has no hits.
* Commit content is reported after completion.

## Out Of Scope

* AI emotion detection or text analysis.
* Diagnosing attachment style, trauma source, personality, or pathology.
* Crisis intervention or trauma processing.
* Durable `EmotionCalibration` model.
* Account impacts from this flow.
* Multiple-emotion journaling in one run.
* Partner/sender psychology inference.
* External app / message / social media integration.

## Technical Notes

* Likely files:
  * `src/utils/route.ts`
  * `src/App.tsx`
  * `src/routes/EmotionCalibrationPage.tsx`
  * `src/routes/HomePage.tsx`
  * `src/domain/emotionCalibration.ts`
  * `src/domain/emotionCalibration.test.ts`
  * `src/styles/screens.css`
  * `.trellis/spec/frontend/state-management.md`
* Existing patterns to reuse:
  * `SignalCheckPage` and `DraftCheckPage` for route-local steps and optional explicit save.
  * `buildSignalCheckDiscoveryPointInput(...)` and `buildDraftCheckDiscoveryPointInput(...)` for discovery point builders.
  * `actions.saveDiscoveryPoint(...)` write contract.
