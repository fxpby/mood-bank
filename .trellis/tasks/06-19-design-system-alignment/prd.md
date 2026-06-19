# design system alignment

## Goal

Align the PRD design contract and the existing mobile PWA visual layer with `DESIGN.md` / `figma/v1.fig`, while preserving current product logic, routes, persistence behavior, and flow step count.

## What I already know

* `DESIGN.md` defines the target design language as Emotional Ceramic / Functional Calm.
* The visual direction is a quiet, tactile, private holding space: linen background, ceramic white cards, subtle borders, low tinted shadows, spacious Manrope typography, 12px cards/inputs, pill buttons/chips, and 48px touch targets.
* `figma/v1.fig` is a local Figma package, not a Figma URL. The available tools do not expose Figma MCP `get_design_context` / `get_screenshot` for local `.fig` node inspection.
* The `.fig` thumbnail shows multiple mobile flow frames with the same overall product structure: light linen/white surfaces, green primary actions, small bottom navigation, and low-contrast framed cards.
* The current app already implements the major flows. This task should only apply visual/style changes unless a design item is confirmed to match existing logic.
* The current Return-To-Self flow is 4 steps (`body`, `anchor`, `life`, `energy`) plus completion. Older PRD text contains a 3-step layout. This task must not regress the implemented 4-step flow.

## Requirements

* Update the main PRD design/token section to match Emotional Ceramic:
  * Manrope-first sans token stack with system fallback.
  * Background `#fbf9f4`, raised white surfaces, subtle `#E5E1D8` borders.
  * Self = sage/moss green, Connection = terracotta, Energy = slate blue.
  * Cards and inputs use 12px radius; buttons/chips use pill radius.
  * Touch targets use 48px minimum.
  * Tinted, shallow ceramic shadows replace glass-heavy shadows.
* Apply safe visual-only CSS changes to existing pages:
  * `src/styles/tokens.css`
  * `src/styles/global.css`
  * `src/styles/screens.css`
* Preserve all existing React flow logic, route state, copy tables, storage behavior, account impact behavior, and local-first constraints.
* If a Figma visual suggests a different flow structure, record it as a design mismatch and do not implement it without user alignment.
* Do not add network font loading, telemetry, backend calls, login, sync, push, or AI calls.

## Acceptance Criteria

* [ ] PRD visual token/component contract is updated to Emotional Ceramic.
* [ ] Figma offline inspection notes are recorded under this task.
* [ ] App tokens and shared CSS reflect the Emotional Ceramic palette, typography, radius, touch target, and ceramic surface treatment.
* [ ] Current route and persistence logic remains unchanged.
* [ ] Home, Return-To-Self, Account Detail, Topics, Record, Draft Check, Experiments, and Setup remain visually usable at mobile width.
* [ ] `npm run typecheck`, `npm test`, and `npm run build` pass.
* [ ] Forbidden-pattern scan remains clean for network/telemetry, diagnostic/score language, and transactional copy.

## Out of Scope

* Changing the Return-To-Self step count or product logic.
* Implementing new routes, onboarding logic, account impact rules, durable models, sync, or AI.
* Importing remote fonts or adding dependencies only for design polish.
* Rebuilding the app from Figma from scratch.
* Tracking user-provided `DESIGN.md` / `figma/` in a work commit unless explicitly decided as project assets.

## Technical Notes

* The app is Vite + React + TypeScript with global CSS in `src/styles/`.
* Frontend specs require local-first behavior, storage writes through `AppStoreContext` / `StorageAdapter`, no network behavior, no relationship verdicts, and mobile-first text wrapping.
* `figma/v1.fig` contains `canvas.fig`, `thumbnail.png`, `meta.json`, and `images/`.
* The local `canvas.fig` is binary/compressed and not directly recoverable as JSON through shell tools.
* Figma offline inspection is recorded in `research/figma-offline-inspection.md`.
