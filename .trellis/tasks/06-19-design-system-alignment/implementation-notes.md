# Implementation notes

## Summary

Aligned the PRD design contract and current CSS visual layer with `DESIGN.md` / `figma/v1.fig` without changing React flow logic or storage behavior.

## Design mismatch / logic decisions

* `figma/v1.fig` could only be inspected through its thumbnail and package metadata in this environment. No Figma MCP node context was available.
* The thumbnail supports the visual direction but is not reliable enough to change route structure, copy, or flow state.
* The current Return-To-Self implementation remains the product baseline: 4 steps plus completion. The older PRD 3-step layout sketch was explicitly marked as non-authoritative for step count.
* No UI logic was changed.

## Files changed

* `.trellis/tasks/archive/2026-06/06-17-emotional-account-pwa/prd.md`
  * Updated visual token and component contracts to Emotional Ceramic / Functional Calm.
  * Added Return-To-Self 4-step implementation baseline note.
* `src/styles/tokens.css`
  * Replaced old palette with linen/ceramic surfaces and Self/Connection/Energy semantic colors from `DESIGN.md`.
  * Switched to Manrope-first font stack, 12px card/input radius, 48px touch minimum, and low ceramic shadows.
* `src/styles/global.css`
  * Reduced glass/gradient treatment.
  * Made buttons and icon controls pill-shaped.
  * Updated bottom navigation and base surfaces to ceramic tray/card styling.
* `src/styles/screens.css`
  * Updated Home, Return-To-Self, Topic, Record, Account Detail, Experiments, and setup surfaces to the new token system.
  * Removed old purple Self and brown Energy visual bias in favor of Self green, Connection terracotta, Energy slate blue.
  * Raised small interactive controls to 48px touch targets where found.

## Verification

* `npm run typecheck` passed.
* `npm test` passed: 12 files, 93 tests.
* `npm run build` passed.
* Forbidden-pattern scan passed:
  * no `fetch(`, `XMLHttpRequest`, `navigator.sendBeacon`, `console.`, `debugger`;
  * no transactional/diagnostic forbidden copy matches in `src`.
* Browser mobile viewport check at `390x844` passed for:
  * `/home`
  * `/return-to-self`
  * `/accounts/self`
  * `/topics`
  * `/record`
  * `/draft-check`
  * `/experiments`
  * `/setup` redirected to `/home` because setup is already complete in local state.
