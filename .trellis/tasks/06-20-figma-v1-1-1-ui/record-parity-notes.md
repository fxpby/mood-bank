# Record Page Figma Parity Notes

Reference:
- Figma screenshot: `figma/screens/记录互动_1-1394.png`
- App route used for comparison: `/record/new`

## Decisions

- Figma `记录互动` maps to the app's quick-record creation route (`/record/new`), not the record archive route (`/record`).
- The Figma frame contains a shorter form than the current MVP. Existing fields for draft persistence, evidence, account impact preview, and energy effect are product logic and were kept.
- The Figma top-right more icon has no confirmed behavior in the current app, so it was not added.
- The visible title remains the app copy (`存下这次发生的事` / trigger prefill variant) rather than Figma's `记录互动`, because copy differences are outside this task unless aligned with the user.

## Implemented Visual Alignment

- Converted the quick-record header from a raised card into a lightweight app bar.
- Replaced the visible close text with an accessible back icon while preserving the same close-to-home behavior.
- Grouped fact and interpretation fields into a white form surface closer to the Figma card.
- Reduced the record form's outer card weight so sections read as form content instead of one nested panel.
- Gave the primary save action a save icon and larger bottom-action treatment while preserving the existing draft action.

## Deferred Differences

| Area | Figma | Current app | Decision |
|---|---|---|---|
| Top-right control | More icon | No confirmed secondary menu | Record only; do not add inert control |
| Page title | `记录互动` | Current quick-record copy | Copy difference; do not change |
| Emotion/body input | Four simple text choices | Full chip sets for emotion and body | Existing feature scope; do not remove |
| Connection/activation | Slider-like controls | Chip groups with explicit choices | Control model differs; needs product alignment |
| Bottom action | Single save button | Save plus draft-later action | Draft behavior is product logic; keep |
| Account impact preview | Not shown | Transparent preview of possible account impacts | Existing MVP transparency requirement; keep |
