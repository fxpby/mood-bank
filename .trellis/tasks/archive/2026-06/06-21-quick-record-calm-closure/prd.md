# Quick Record Calm Closure

## Goal

After a quick record is saved, give the user a low-cognitive calm-closure landing so the event can feel sufficiently held without requiring more analysis. The completion state should let the user receive warmth, mark one later point, return to life, or continue to Return-to-Self when activation is high.

## What I Already Know

- The long product PRD requires calm closure after recording an episode.
- Existing Quick Record already saves an `Episode` and returns it from `actions.saveQuickRecord`.
- Existing completion state only offers Home, Self account detail, and conditional Return-to-Self.
- Product language should stay warm: `存下`, `情感储蓄罐`, `明细`; avoid transactional copy such as `记账` / `对账` / `兑换`.
- Local-first constraints remain unchanged: no backend, login, sync, telemetry, AI calls, or direct localStorage outside the adapter.

## Requirements

- Show a calm-closure section after Quick Record save.
- Keep the saved completion honest: show success only after `saveQuickRecord` returns `ok: true`.
- Store the saved episode id route-locally so the user can open the saved record detail.
- Offer closure actions:
  - open the saved record detail
  - return Home / return to life
  - continue Return-to-Self, especially when activation is high
  - open Topics when the user chose `保存一个话题`
  - optionally continue to a seeing/understanding branch without extra writes
- Do not create additional account impacts or discovery points from the completion screen.
- Do not add a new durable calm-closure model in this task.

## Acceptance Criteria

- [x] Saving Quick Record shows completion copy that says the record is enough for now.
- [x] Completion page can navigate to the saved record detail via `buildRecordRoute(savedEpisode.id)`.
- [x] If `nextAction === "save_later_topic"`, completion page offers Topics as the place to pick it up later.
- [x] High activation completion makes Return-to-Self available as a clear primary next step.
- [x] No storage writes happen from calm-closure buttons.
- [x] Typecheck, tests, build, and diff whitespace checks pass.

## Verification

- `npm run typecheck`
- `npm test`
- `npm run build`
- `git diff --check`
- Browser smoke on `http://127.0.0.1:5177`: setup -> quick record -> save with high activation and later topic -> completion actions visible -> open saved record detail.

## Out Of Scope

- Dedicated calm-closure persisted model.
- New episode/account impact rules.
- AI-generated closure summaries.
- Relationship verdicts, partner intent inference, clinical diagnosis, or advice to stay/leave.
- UI/Figma redesign work.

## Technical Notes

- Relevant files:
  - `src/routes/QuickRecordPage.tsx`
  - `src/utils/route.ts`
  - `src/styles/screens.css`
  - `README.md`
  - `.trellis/tasks/archive/2026-06/06-17-emotional-account-pwa/prd.md`
- Existing `StoreWriteResult<Episode>` already gives the episode id needed by the completion page.
