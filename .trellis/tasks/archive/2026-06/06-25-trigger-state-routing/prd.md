# Trigger State Routing

## Goal

Add a lightweight state-check routing layer inside the existing "我被触发了" flow so the user can notice whether the current moment is mostly present-event activation, connection alarm, old echo, inner judge, boundary pressure, or body overload, then choose a low-pressure next route. This should make Trigger Support better match the main PRD's "state check / trigger triage" concept without turning it into diagnosis or trauma processing.

## What I Already Know

- `TriggerPage` currently has four steps: fact, body/emotion, urge, owned next action, completion.
- It already detects some support-boundary conditions and can route to Return-to-Self.
- Existing P2 branch routes already exist:
  - `/connection-continuity`
  - `/old-echo`
  - `/self-compassion`
  - `/boundary-clarity`
  - `/emotion-calibration`
- Existing high-activation branch route state can show a non-blocking Return-to-Self nudge on P2 branch pages.
- Main PRD calls for a state check that asks whether the user is responding to the present moment, a connection alarm, old echo, inner critic, boundary pressure, or body overload.
- Current README has two stale notes:
  - experiment "current limitations" still says pause / retire / edit / idea save are unsupported, but those controls now exist.
  - P2 high-activation nudge copy mentions only Draft Check, Signal Check, and Emotion Calibration, but Rich Incoming and Quick Record are now covered too.

## Requirements

- Add a short state-check step to Trigger after body/emotion and before urge.
- The state-check step uses chip options only, with gentle non-diagnostic copy:
  - `present`: 主要是当下这件事
  - `connection_alarm`: 连接警报响了
  - `old_echo`: 像旧感觉被碰到
  - `inner_judge`: 内部审判者很响
  - `boundary_pressure`: 边界/责任被压到
  - `body_overload`: 身体已经过载
  - `not_sure`: 我说不清
- The step must explain that this is for choosing a next route, not analyzing what is wrong with the user.
- Derive suggested branch CTA(s) from the selected state:
  - `connection_alarm` -> `/connection-continuity`
  - `old_echo` -> `/old-echo`
  - `inner_judge` -> `/self-compassion`
  - `boundary_pressure` -> `/boundary-clarity`
  - `body_overload` -> `/return-to-self`
  - `not_sure` -> keep current flow plus low-cognitive next action
  - `present` -> keep current flow
- If the user enters a P2 branch from high trigger activation or body overload, pass high-activation branch route state so the destination branch can show the existing Return-to-Self nudge.
- Add `trigger_support` to the branch activation source union and nudge source copy.
- Completion summary should include the selected state check label.
- Keep "保存为快速记录" prefill behavior compatible by including the state check label in facts or interpretation only if it remains low-noise.
- Update README stale sections:
  - remove or correct the experiment limitation note.
  - update P2 high-activation source list to include complex incoming and quick record.

## Acceptance Criteria

- [x] Trigger flow includes a state-check step between body/emotion and urge.
- [x] The state-check copy is non-diagnostic and optional-feeling; "说不清" remains valid.
- [x] Selecting connection alarm, old echo, inner judge, boundary pressure, or body overload shows an appropriate next-route CTA.
- [x] Body overload routes to Return-to-Self instead of a P2 analysis branch.
- [x] P2 route CTAs from Trigger pass transient high-activation route state when activation is high or body overload is selected.
- [x] `buildHighActivationBranchState("trigger_support")` is valid and malformed route state remains ignored.
- [x] BranchActivationNudge has source-specific Trigger Support copy.
- [x] Trigger completion summary includes state-check result.
- [x] No state-check data is persisted as a diagnosis, score, attachment type, trauma source, or new durable model.
- [x] README stale sections are corrected.
- [x] Typecheck, tests, and build pass.

## Definition of Done

- Focused route helper tests updated for `trigger_support`.
- Trigger route behavior implemented with route-local state only unless the user explicitly saves an existing supported object.
- README updated.
- Browser smoke verifies at least:
  - Trigger -> state check `connection_alarm` -> Connection Continuity shows branch nudge when intensity is high.
  - Trigger -> state check `body_overload` -> Return-to-Self.
  - Direct P2 branch entry remains unchanged.

## Out of Scope

- New diagnosis, scores, attachment labels, trauma-source determination, or object-constancy scoring.
- New persisted state-check model.
- New P2 branch implementation.
- Blocking the user from continuing Trigger after the state-check step.
- Crisis intervention workflow beyond existing support-boundary copy.
- UI/Figma redesign.

## Technical Notes

- Likely files:
  - `src/routes/TriggerPage.tsx`
  - `src/utils/route.ts`
  - `src/utils/route.test.ts`
  - `src/components/BranchActivationNudge.tsx`
  - `README.md`
- Existing route-state pattern:
  - `buildHighActivationBranchState(...)`
  - `getBranchActivationContext(...)`
  - `BranchActivationNudge`
- Existing branch destination pages already read branch activation context.
- Existing support boundary behavior in Trigger must stay intact.
