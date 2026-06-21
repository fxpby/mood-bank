# P1/P2 Mobile Persistence QA

## Goal

Run a focused mobile QA and persistence pass across the current P1/P2 surfaces, fixing clear small defects and recording anything larger as backlog. This is a release-hardening task, not a feature expansion task.

## What I Already Know

- Main PRD backlog now recommends a P1/P2 mobile QA and persistence pass.
- Required focus areas are narrow viewport, refresh after save, reset/delete, text wrapping, route return, and storage warning states.
- Current app is local-first; no backend, sync, login, telemetry, AI calls, or push should be added.
- User has paused UI redesign tasks, so this pass should only fix functional layout/copy issues that block usability.
- Untracked `DESIGN.md` and `design-snapshots/` are user/design files and must not be included.

## Requirements

- Verify representative routes at mobile width around 360px:
  - `/home`
  - `/record/new`
  - `/topics`
  - one `/topics/:id` if data exists or can be created
  - `/experiments`
  - one `/experiments/:id` if data exists or can be created
  - `/accounts/self`
  - `/settings`
  - at least one P2 branch route such as `/emotion-calibration` or `/boundary-clarity`
- Verify refresh persistence for at least one saved Topic and one saved Experiment.
- Verify reset/delete still requires confirmation and returns to setup/default state.
- Verify visible copy does not use transactional language such as `兑换`, `消费`, `余额不足`, `还债`, `对账`.
- Fix small code/CSS/copy defects discovered during the pass.
- Record larger or design-heavy issues in PRD/backlog instead of starting redesign work.

## Acceptance Criteria

- [x] Browser QA notes are recorded in this task.
- [x] At least one saved Topic persists across refresh.
- [x] At least one saved Experiment persists across refresh.
- [x] Mobile 360px route checks are completed for the representative route list.
- [x] Reset/delete path is checked without leaving the user’s app in a surprising state.
- [x] Small defects found during QA are fixed and verified.
- [x] `npm run typecheck`, `npm test`, `npm run build`, and `git diff --check` pass after fixes.

## Definition Of Done

- QA notes live under this task directory.
- Any code/docs fixes are committed separately from untracked design files.
- README / main PRD backlog is updated if QA changes release status or reveals important residual risk.

## Out Of Scope

- Full UI redesign or Figma 1:1 implementation.
- Large visual refactors.
- New product features.
- Automated end-to-end test suite.
- Backend/sync/login/export/import implementation.

## Technical Notes

Likely tools/files:

- In-app browser via `browser:control-in-app-browser`.
- `src/styles/screens.css` for small text/layout fixes if needed.
- Route files under `src/routes/` only if QA reveals broken interactions.
- `.trellis/tasks/06-21-p1-p2-mobile-persistence-qa/qa-notes.md` for findings and screenshots/route notes.
