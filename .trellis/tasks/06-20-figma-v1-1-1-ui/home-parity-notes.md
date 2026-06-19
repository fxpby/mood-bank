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

## Recorded, Not Changed

These differences affect structure, copy, product priority, or local state, so they are outside this task's CSS-only scope:

| Area | Figma `2:452` | Current app | Decision |
|---|---|---|---|
| Top bar | Back icon, centered title, more icon | Home page header with title and kicker, no back/more controls | Navigation semantics differ; do not change |
| Context state | Relationship title plus warm status chip | Current space and daily state as two cards | Information architecture differs; do not change |
| Primary actions | Four equal 2 x 2 action cards | Trigger and return-to-self span full width for trigger-first hierarchy | Product priority differs; do not change |
| Record entry | One full-width record button | Record button plus emotion-calibration entry | Existing feature entry; do not remove |
| Account preview | Compact white status cards | Semantic color cards with detail entry | Existing detail-entry decision; do not change |
| Lower content | Latest record shown in design state | Local data may show latest record or today's anchor | State/data difference; do not reset data |

## Screenshot Artifacts

- Before: `/tmp/mood-bank-home-current.png`
- Figma scaled: `/tmp/figma-home-430.png`
- After: `/tmp/mood-bank-home-after-nav.png`
