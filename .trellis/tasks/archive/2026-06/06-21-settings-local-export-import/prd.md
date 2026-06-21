# Settings Local Export / Import

## Goal

Add a small local-only export/import path in Settings so users can back up and restore the current browser's `AppState` as a JSON file. This is file transfer only, not cloud backup, login, sync, telemetry, or merge.

## What I Already Know

- Settings currently shows disabled export/import placeholders.
- The app is local-first and persists only through `AppStoreContext` and `StorageAdapter`.
- `src/storage/storageAdapter.ts` is the only direct `localStorage` boundary.
- Existing persisted state validation lives in `src/domain/validation.ts`.
- Import must not bypass validation or let route code write directly to storage.
- The main PRD lists real export/import as a later backlog item and says it must preserve the local-first boundary.

## Product Decision

MVP export/import is a full-state JSON backup:

- Export downloads the current in-memory `AppState` as a JSON file.
- Import reads a user-selected JSON file, validates it with the existing minimum-state validator, shows a confirmation summary, then replaces the current local state through a Store action.
- Import is replace-only. No merge, diff, selective restore, cloud backup, account login, or sync.
- Import should be honest: unsupported/corrupted files show error copy and do not alter current data.

## Requirements

- Settings export button creates a local JSON download from the current `AppState`.
- Export copy states that the file may contain private relationship/self-reflection data and should be stored carefully.
- Settings import uses a native file input triggered by a visible button.
- Import accepts JSON only by UX hint, but still validates runtime content.
- Invalid JSON, unsupported schema version, or invalid minimum shape shows honest error copy and makes no state changes.
- Valid import shows a confirmation dialog before replacing current local data.
- Confirming import saves the validated state through `AppStoreContext`, updates in-memory state, and shows success copy only after storage save succeeds.
- Import failure must not claim the data was restored.
- No direct `localStorage` access outside `storageAdapter.ts`.
- No backend, cloud sync, login, telemetry, push, or external network behavior.

## Acceptance Criteria

- [x] `/settings` has enabled export and import controls.
- [x] Export downloads a JSON file containing current `AppState` and does not mutate state.
- [x] Import validates JSON through existing persisted-state validation before confirmation.
- [x] Valid import requires explicit confirmation before replacing data.
- [x] Confirmed import replaces state through a typed store action and honest result copy.
- [x] Invalid/unsupported import leaves current state unchanged with visible error copy.
- [x] README and main PRD describe local file export/import accurately.
- [x] `npm run typecheck`, `npm test`, `npm run build`, and `git diff --check` pass.

## Definition Of Done

- Store/action contracts are updated.
- Focused tests cover validation/import helper behavior or store-adjacent pure logic.
- Settings UI remains mobile-friendly and local-first.
- The task is committed separately from unrelated design files.

## Out Of Scope

- Merge import, conflict resolution, selective restore, or preview diff.
- Encryption/password protection.
- Cloud backup, sync, accounts, remote storage, telemetry, or upload.
- Importing chat histories or external app data.
- Large UI redesign.

## Technical Notes

Likely files:

- `src/routes/SettingsPage.tsx`
- `src/store/AppStoreContext.tsx`
- `src/domain/validation.ts`
- `src/domain/types.ts`
- `src/styles/screens.css`
- `README.md`
- `.trellis/tasks/archive/2026-06/06-17-emotional-account-pwa/prd.md`
