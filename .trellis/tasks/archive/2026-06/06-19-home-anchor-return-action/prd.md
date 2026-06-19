# home anchor return action

## Goal

Make the Home anchor preview actionable by letting the user take the currently visible support phrase into the existing Return-To-Self flow.

## Requirements

- Home's "今天的锚点" section must always offer a primary action labeled "带着这句回到自己".
- Tapping the action navigates to `/return-to-self`.
- Existing "打开来源记录" behavior must remain available for episode-linked anchors.
- The change must not add route state, preselect the anchor, or introduce schema/store changes.
- The click must not create account impacts or durable writes by itself.

## Acceptance Criteria

- [ ] `/home` shows "带着这句回到自己" in the anchor preview.
- [ ] Tapping the action opens `/return-to-self`.
- [ ] Episode-linked anchors still show "打开来源记录" and navigate to the source record.
- [ ] Standalone anchors still work without a source button.
- [ ] Typecheck, tests, and build pass.

## Definition of Done

- Frontend checks pass: `npm run typecheck`, `npm test`, `npm run build`.
- Forbidden product/network patterns scan is clean.
- Browser check verifies the Home action and route transition.
- Task is committed, archived, and recorded in the session journal.

## Technical Approach

- Update `src/routes/HomePage.tsx` to render a primary anchor action that calls `navigate("/return-to-self")`.
- Wrap anchor actions in a small layout container so primary and source actions remain stable on mobile.
- Update `src/styles/screens.css` for the anchor action layout.

## Decision (ADR-lite)

**Context**: Recently saved standalone anchors can appear on Home but may not have a source route. The anchor still needs to be usable as a stabilization resource.

**Decision**: Add a direct Home action into the existing Return-To-Self flow instead of adding route-state preselection or new data contracts.

**Consequences**: The Home anchor becomes useful immediately with minimal surface area. The Return-To-Self page already includes recent anchors as options, so this avoids premature route-state complexity.

## Out of Scope

- Preselecting the exact Home anchor in Return-To-Self.
- Adding new anchor source types or linked Topic source routes.
- Changing account impact rules, storage schema, or selectors.
- Adding rewards, streaks, scores, or diagnostic copy.

## Technical Notes

- Relevant files inspected:
  - `src/routes/HomePage.tsx`
  - `src/routes/ReturnToSelfPage.tsx`
  - `src/styles/screens.css`
  - `src/utils/route.ts`
  - `.trellis/spec/frontend/index.md`
  - `.trellis/spec/frontend/component-guidelines.md`
  - `.trellis/spec/frontend/state-management.md`
  - `.trellis/spec/frontend/quality-guidelines.md`
  - `.trellis/spec/frontend/type-safety.md`
- `ReturnToSelfPage` already builds anchor options from `state.anchors.slice(0, 3)`, so navigating to `/return-to-self` is enough for recent anchors to be available.
