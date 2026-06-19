# Figma offline inspection

## Source

* Local artifact: `figma/v1.fig`
* Related design spec: `DESIGN.md`
* Extracted preview: `/tmp/v1-thumbnail.png`

## Tool findings

`figma/v1.fig` is a zip archive containing:

* `canvas.fig`
* `thumbnail.png`
* `meta.json`
* `images/`

The exported metadata reports a `276x400` thumbnail and a larger render coordinate area. The local `canvas.fig` payload is binary/compressed and not readable as structured JSON through `strings` or direct shell extraction. No Figma MCP design-context tools are exposed in this session, so node-level dimensions, text, layer names, and assets cannot be inspected reliably.

## Visual read from thumbnail

The thumbnail shows a board of multiple mobile PWA frames rather than a single screen. The visible direction matches `DESIGN.md`:

* warm linen/off-white page background;
* mostly white cards with subtle border and low depth;
* green primary filled buttons;
* small bottom navigation;
* dense but calm mobile flow screens;
* no obvious decorative gradient-orb, game, reward, or social-dashboard treatment.

## Logic mismatch handling

Because the thumbnail is too small to reliably read all text and flow details, it is not sufficient evidence to alter business logic. Current app behavior remains authoritative for:

* route list and navigation structure;
* Return-To-Self 4-step flow plus completion;
* local-first storage and account impact rules;
* copy tables and Chinese product language.

If a later Figma MCP screenshot or node context shows a different step count, write model, account behavior, or route structure, that should be treated as a product decision requiring user alignment before implementation.

## Implementation consequence

Use `DESIGN.md` plus the thumbnail as a visual reference only. Safe changes for this task are CSS token, surface, spacing, typography, radius, and interaction-state updates. Do not change React logic based only on this offline `.fig`.
