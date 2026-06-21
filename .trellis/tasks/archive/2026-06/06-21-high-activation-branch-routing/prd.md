# High Activation Branch Routing

## Goal

When a user enters a P2 reflection branch from a high-activation source flow, the branch should gently bias the first action toward Return-to-Self. This makes the app behave more like a trigger-first mobile tool: if the user's nervous system is already overloaded, the next screen should not pull them deeper into analysis before offering grounding.

## What I Already Know

- Main PRD backlog says high-activation route context is optional, and if added it should bias the first CTA toward Return-to-Self instead of deeper reflection.
- P2 branches already show Return-to-Self actions, but they do not receive shared source context.
- `RouteState` currently supports `quickRecordPrefill` and `returnToSelfAnchor`.
- `App.navigate(route, routeState)` already writes route state into `history.pushState`.
- Draft Check and Signal Check already know when the user is overloaded enough to recommend Return-to-Self.
- Trigger high-intensity completion already routes directly to Return-to-Self, so this task should not reopen the trigger flow unless a safe branch link already exists.

## Product Decision

Use route state, not persisted app state:

- Add a route-state flag for high activation branch entry.
- Source flows that offer P2 branches pass that flag only when their current state is high activation.
- P2 branch pages read the flag and show a small top-of-page grounding nudge with Return-to-Self as the primary action.
- If the user arrived directly from Home or normal navigation, branch pages stay as they are.

## Requirements

- Add a typed route-state field for P2 branch activation context.
- Add a small reusable helper/component for branch pages to read and display the nudge.
- The nudge copy must be non-diagnostic and non-alarming.
- The nudge must not block branch use; users can still continue the branch.
- The nudge must not persist to `AppState`, create account impacts, save discovery points, or write storage.
- Draft Check should pass the context when its result is `return_to_self_first` or support boundary context indicates overload, and the user still chooses a P2 branch.
- Signal Check should pass the context when its checking urge / no-response loop suggests high activation and the user chooses connection-continuity.
- P2 branch pages should keep existing direct entry behavior unchanged.

## Acceptance Criteria

- [x] `RouteState` supports a typed high-activation branch context.
- [x] At least Draft Check and Signal Check pass that context when relevant.
- [x] P2 branch pages that can receive high-activation traffic show Return-to-Self as the first/primary CTA when the context exists.
- [x] Direct navigation to P2 branches does not show the high-activation nudge.
- [x] No durable state writes are added for this context.
- [x] README and main PRD status/backlog reflect the implementation.
- [x] `npm run typecheck`, `npm test`, `npm run build`, and `git diff --check` pass.

## Definition Of Done

- Route-state contract is typed and tested where practical.
- Shared UI/copy avoids diagnostic, crisis, scoring, or shame language.
- No localStorage or AppStore writes are introduced for this transient context.
- The task is committed separately from unrelated design files.

## Out Of Scope

- Attachment diagnosis, object-constancy score, trauma-source inference, or risk scoring.
- Blocking P2 branches until Return-to-Self is completed.
- Persisting activation context, analytics, telemetry, or session history.
- Redesigning P2 branch pages or implementing Figma UI work.
- Generic branch abstraction beyond what this nudge requires.

## Technical Notes

Likely files:

- `src/utils/route.ts`
- `src/routes/DraftCheckPage.tsx`
- `src/routes/SignalCheckPage.tsx`
- P2 branch route pages under `src/routes/*Page.tsx`
- `src/styles/screens.css`
- `README.md`
- `.trellis/tasks/archive/2026-06/06-17-emotional-account-pwa/prd.md`

## Verification Notes

- Browser smoke: direct `/connection-continuity` entry does not show the nudge.
- Browser smoke: Signal Check high-confirmation path into `/connection-continuity` shows the high-activation nudge, and "继续看连接感" continues into the original first step.
