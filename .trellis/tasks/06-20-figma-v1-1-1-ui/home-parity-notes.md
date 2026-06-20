# Home Figma Parity Notes

Date: 2026-06-20

Reference:
- Figma frame: `2:452`
- Figma screenshot: `figma/screens/首页_-_情感储蓄罐_(完整版)_2-452.png`
- Browser URL: `http://127.0.0.1:5173/home`
- Validation viewport: `430 x 1282`

## Implemented

- Updated bottom navigation as CSS-only visual parity:
  - full-width white bottom bar instead of floating capsule
  - warm circular active item matching the Figma home/settings frames
  - kept existing labels, routes, and active-route logic unchanged
- Kept safe bottom padding aligned with the taller bar through `--bottom-nav-height`.
- Verified responsive widths at `430`, `360`, and `320` with no horizontal overflow.
- Reworked Home main structure toward Figma `2:452` while preserving app logic:
  - Home header now uses centered title styling.
  - Current space and daily state render as relationship heading plus warm status chip.
  - Primary actions render as a 2 x 2 card grid in Figma order.
  - The record entry renders as a full-width solid primary button.
  - Account preview cards use compact white-card styling with semantic circular markers.
  - The emotion-calibration entry was moved below account preview so it no longer interrupts the Figma home main structure.

## Recorded, Not Changed

These differences affect structure, copy, product priority, or local state, so they are outside this task's CSS-only scope:

| Area | Figma `2:452` | Current app | Decision |
|---|---|---|---|
| Top bar | Back icon, centered title, more icon | Home page has centered title; no back button and no inactive more button | Back/more on root home have different navigation semantics; do not add without aligned behavior |
| Context state | Relationship title plus warm status chip | Now matches the same structure using current local space/market data | Implemented |
| Primary actions | Four equal 2 x 2 action cards | Now matches 2 x 2 Figma order while keeping existing routes/copy | Implemented |
| Record entry | One full-width record button | Now matches as solid full-width primary button | Implemented |
| Account preview | Compact white status cards | Now matches compact white-card direction; keeps the existing detail entry | Detail entry is product decision; do not remove |
| Lower content | Latest record shown in design state | Local data may show latest record or today's anchor | State/data difference; do not reset data |
| Extra entry | Not present in Figma home | Existing emotion-calibration route remains available before account preview because its priority is high | Existing feature entry; kept high-priority rather than hidden |

## Screenshot Artifacts

- Before: `/tmp/mood-bank-home-current.png`
- Figma scaled: `/tmp/figma-home-430.png`
- After: `/tmp/mood-bank-home-after-nav.png`
- Home structure pass: `/tmp/mood-bank-home-v3.png`
