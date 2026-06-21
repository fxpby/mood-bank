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

### Scenario: Transient Route-State Nudges

#### 1. Scope / Trigger

- Trigger: a source flow needs to pass transient UI context into another route, such as a high-activation nudge for P2 branch pages.
- Scope: `navigate(route, routeState)` -> `window.history.state` -> presentational branch component.

#### 2. Signatures

```ts
type BranchActivationContext = {
  kind: "high_activation";
  source: "draft_check" | "signal_check" | "emotion_calibration";
};

type RouteState = {
  branchActivation?: BranchActivationContext;
};

function buildHighActivationBranchState(source: BranchActivationContext["source"]): RouteState;
function getBranchActivationContext(value: unknown): BranchActivationContext | null;
```

#### 3. Contracts

- Source routes may pass `buildHighActivationBranchState(source)` when the current route-local selections indicate high activation.
- Destination branch pages may show a non-blocking nudge that puts Return-to-Self before deeper reflection.
- The nudge must let the user continue the branch without completing Return-to-Self.
- Route-state context must remain transient and must not be written to `AppState`, storage, discovery points, account impacts, or analytics.

#### 4. Validation & Error Matrix

| Condition | Expected result |
|---|---|
| Missing `branchActivation` | Render no nudge. |
| Unknown `kind` or `source` | Render no nudge. |
| Valid high-activation context | Render nudge with Return-to-Self primary action and continue action. |

#### 5. Good / Base / Bad Cases

- Good: Draft Check recommends `return_to_self_first`, user taps a P2 branch, branch landing shows "先回到自己" first.
- Base: user opens `/connection-continuity` from Home or direct URL, branch renders normally without the nudge.
- Bad: branch page persists "high activation" into `AppState` or blocks the branch until grounding is completed.

#### 6. Tests Required

- Unit-test route helper parsing for valid, missing, and malformed route state.
- Smoke-test at least one source -> branch path when behavior crosses route boundaries.

#### 7. Wrong vs Correct

Wrong:

```tsx
actions.saveDiscoveryPoint({ title: "用户高激活", ... });
navigate("/old-echo");
```

Correct:

```tsx
navigate("/old-echo", buildHighActivationBranchState("draft_check"));
```

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
