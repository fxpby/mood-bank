# Component Guidelines

> Component conventions for the emotional account PWA.

---

## Overview

Components are plain React function components with explicit props. The app does not use a component framework, Tailwind, CSS modules, or styled-components. Shared visual primitives live in `src/components/`; page-level flows live in `src/routes/`.

---

## Component Structure

Use named exports and colocate only component-specific types in the same file:

```tsx
type PageHeaderProps = {
  title: string;
  kicker?: string;
};

export function PageHeader({ title, kicker }: PageHeaderProps) {
  return <header>...</header>;
}
```

Keep shared components presentational when possible. Product writes should happen in routes or store actions, not in low-level display components.

---

## Props Conventions

Navigation is passed as a function, not imported from a router singleton:

```tsx
type RouteProps = {
  navigate: (route: AppRoute) => void;
};
```

When a component needs route state, use the typed `AppRoute` / `RouteState` definitions from `src/utils/route.ts`.

Prefer explicit unions over loose strings for product values. Reuse domain types from `src/domain/types.ts`.

---

## Styling Patterns

Styling is global CSS:

- `src/styles/tokens.css` defines design tokens.
- `src/styles/global.css` defines reset/base behavior.
- `src/styles/screens.css` defines route and component classes.

Use stable layout dimensions for fixed-format controls such as bottom navigation, action cards, chips, dialogs, and step controls so hover/focus/content changes do not shift the layout.

Avoid nested cards and decorative background blobs. The app should feel like a quiet personal tool, not a marketing page.

---

## Accessibility

Required patterns:

- Use native `button`, `input`, `textarea`, and `select` elements unless there is a concrete reason not to.
- Dialogs need `role="dialog"`, `aria-modal="true"`, and a labelled title.
- Icon-only controls need accessible labels. Current P0 buttons generally use text labels.
- Focus-visible states must remain visible on buttons, chips, inputs, and nav items.
- Do not rely on animation to explain required flow state.

---

## Common Mistakes

### Wrong: Low-Level Component Writes Data

```tsx
function AccountSummaryCard() {
  localStorage.setItem("...", "...");
  return <article>...</article>;
}
```

### Correct: Route or Store Owns Writes

```tsx
function QuickRecordPage() {
  const { actions } = useAppStore();
  const result = actions.saveQuickRecord(input);
  return <CompletionCard result={result} />;
}
```

### Wrong: Untyped Route Strings

```tsx
button.onClick = () => navigate("/maybe-valid");
```

### Correct: AppRoute

```tsx
const nextRoute: AppRoute = "/return-to-self";
navigate(nextRoute);
```
