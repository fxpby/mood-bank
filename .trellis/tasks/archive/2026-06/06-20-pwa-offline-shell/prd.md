# Add PWA Offline Shell

## Goal

Add a lightweight service worker so the mobile PWA can reopen its app shell and built static assets after the first successful load. This closes the README-noted gap between "has manifest" and "has a basic offline shell" without adding backend sync, push, telemetry, or external dependencies.

## What I Already Know

- The app is a Vite + React + TypeScript local-first PWA.
- `public/manifest.webmanifest` already exists and is linked from `index.html`.
- `README.md` currently says the project has no service worker and therefore is not full offline-first.
- The app persists user data in localStorage through `src/storage/storageAdapter.ts`; this task must not change persistence semantics.
- The dependency set is small and network access is restricted, so adding a PWA plugin is unnecessary for this task.

## Requirements

- Register a service worker only in production-like browser contexts where service workers are available.
- Cache the app shell and static assets needed to reopen the app after the first successful load.
- Serve navigation requests from the cached app shell when offline, so client-side routes can load.
- Use cache versioning and delete stale app caches during activation.
- Do not add backend calls, telemetry, AI calls, login, sync, push notifications, or background sync.
- Do not cache or transform user data. LocalStorage remains the only app-state persistence boundary.
- Keep service worker failure non-blocking: registration errors must not break app startup.
- Update README to reflect the new offline-shell boundary honestly.

## Acceptance Criteria

- [x] `npm run typecheck` passes.
- [x] `npm test` passes.
- [x] `npm run build` passes.
- [x] Production build includes a service worker file.
- [x] App startup registers the service worker when supported.
- [x] The service worker caches app shell/static assets and handles navigation fallback.
- [x] No forbidden network/product patterns are introduced.
- [x] README no longer claims there is no service worker and clearly states the offline scope.

## Out of Scope

- Offline write queue, sync, conflict handling, cloud backup, or multi-device behavior.
- Push notifications, periodic sync, background sync, or install prompts.
- IndexedDB/encryption migration.
- UI redesign or visible offline status messaging.

## Technical Notes

- Likely files: `src/main.tsx`, `public/service-worker.js`, `README.md`.
- Prefer a hand-written service worker over adding dependencies.
- Cache strategy should be conservative:
  - Precache `/`, `/index.html`, `/manifest.webmanifest`, and icon files.
  - Runtime-cache same-origin static build assets under `/assets/`.
  - Navigation requests fall back to cached `/index.html`.
  - Static requests can use cache-first with network fallback.
