# Shared Safety Support Boundary Copy

## Goal

Add a shared first-release safety / human-support boundary pattern so high-risk or overwhelming content gets consistent copy across the app without diagnosis, danger scoring, legal advice, or crisis workflow behavior.

This implements the P1/P2 backlog item from the main PRD status matrix:

> Add shared safety / human-support boundary copy and reusable UI so support language is consistent across Trigger, Return-to-Self, Draft Check, Boundary Clarity, Old Echo, Self-Compassion, and high-overload P2 routes.

## User Problem

The app currently includes safety/human-support language in a few routes, but the copy is scattered and inconsistent. Users who select "真人支持", physical safety concern, severe overwhelm, or similar high-risk content should see a clear, calm boundary:

- this app cannot handle crisis or unsafe situations
- ordinary reflection may not be enough
- contact a trusted person, professional support, or local emergency services when safety is at stake

The app must not attempt to determine danger level or give legal/safety planning.

## Scope

Build:

- `src/copy/safety.ts` with stable Chinese-first support-boundary copy.
- `src/domain/safety.ts` with pure helper(s) for determining when selected route-local chips imply support-boundary copy.
- `src/components/SupportBoundaryCard.tsx` as a reusable presentational component.
- Unit tests for the helper(s).
- Wire the shared card into relevant existing flows where high-risk/support choices already exist or can be deterministically inferred:
  - Boundary Clarity: support boundary and/or support selected.
  - Old Echo: "找真人支持" selected.
  - Emotion Calibration: "我需要一点安全感" or intense protective/avoidant signals.
  - Self-Compassion: severe overwhelm/self-attack adjacent copy, especially completion/landing support.
  - Return-To-Self: "更重" energy effect and completion/support path.
  - Draft Check: collapse/body overload/attack-blame states can show low-pressure support-boundary copy.
  - Trigger: high intensity plus aggressive/self-loss/rumination urges can show support-boundary copy.

Do not build:

- Crisis hotline directory.
- Emergency call integration.
- Legal advice, domestic-violence planning, confrontation planning, or danger scoring.
- A new persisted model, topic, episode, account impact, safety account, or telemetry.
- Automatic text scanning of user free-text content.

## Product Copy Principles

- Use "这可能需要真人支持" as the primary title.
- State clearly that this app is a self-reflection and stabilization tool, not crisis intervention.
- Suggest contacting a trusted person, professional support, or local emergency services.
- Keep the action user-owned: "我先去联系真人支持", "先回到自己", "关闭".
- Never say "系统判断你有危险" or imply risk detection.
- Never promise safety.

## Functional Requirements

1. Shared component renders:
   - title
   - body
   - optional reason line
   - primary action to Return-to-Self when provided
   - secondary close / continue action when provided
2. Shared helper supports simple deterministic categories, for example:
   - `self_harm`
   - `violence`
   - `coercion`
   - `stalking`
   - `physical_safety`
   - `overwhelming`
   - `dissociative`
   - `human_support`
3. Helper must be pure and tested.
4. Route copy must remain route-local and non-persistent.
5. Showing the support card must not block existing completion or save actions unless an existing route already does so.
6. No account impacts are created by seeing, dismissing, or following support-boundary copy.

## Acceptance Criteria

- [x] A reusable `SupportBoundaryCard` exists and is used in at least Boundary Clarity, Old Echo, Emotion Calibration, Draft Check, Trigger, and Return-To-Self/Self-Compassion where relevant.
- [x] `src/copy/safety.ts` centralizes support-boundary user-facing copy.
- [x] `src/domain/safety.ts` exposes tested deterministic helpers.
- [x] High-risk/support copy remains non-diagnostic and does not score danger.
- [x] Existing save flows still use `AppStoreContext` actions and are not changed by the support copy.
- [x] `npm run typecheck`, `npm test`, and `npm run build` pass.

## Commit Message

Recommended commit:

`feat: add shared safety support boundary copy`
