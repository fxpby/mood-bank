# P1 Settings Local Data Controls

## Goal

Complete the P1 Settings surface so the user can understand the local-only storage boundary, rename the current emotional space, and see export/import as honest placeholders without adding real data transfer yet.

## Context

- The main PRD lists `/settings` as P0/P1: privacy note, reset/delete data controls, P1 rename, storage status, export/import placeholder, and fuller boundary copy.
- Current Settings already shows local-only copy, storage status, last save time, recent error, and local reset.
- The app remains local-first and single-device. No backend, login, sync, telemetry, push, AI calls, or direct route-level storage.
- Durable writes must go through `AppStoreContext` and `StorageAdapter`.
- The UI should not imply that export/import is available if it is not implemented.

## Requirements

- Show the active emotional space on Settings.
- Allow editing the active space display name and optional description.
- Save rename/description changes through a typed store action.
- Blank display name should fall back to the existing default space name.
- Unknown/missing active space should show a recoverable message and no write.
- Save failures must show honest error copy and must not show success copy.
- Keep local-only storage status visible:
  - current storage availability label
  - last saved time when available
  - recent storage error when present
- Add export/import placeholder copy:
  - clearly says export/import is not available in this MVP build
  - explains that browser-local data can still be lost if data is cleared
  - creates no files, reads no files, and writes no data
- Preserve reset/delete confirmation behavior.

## Acceptance Criteria

- [x] Settings displays the current emotional space name and description.
- [x] User can update the current space name/description and see success copy only after save succeeds.
- [x] Blank name saves as the default space name instead of an empty title.
- [x] Missing active space shows no editable save action that would write invalid data.
- [x] Export/import section is an honest non-writing placeholder.
- [x] No direct `localStorage` access is added outside `StorageAdapter`.
- [x] No backend, telemetry, AI, sync, push, or file import/export behavior is introduced.
- [x] `npm run typecheck`, `npm test`, and `npm run build` pass.

## Out of Scope

- Real export/download.
- Real import/upload.
- Encryption, backup, cloud sync, or multi-device restore.
- Multiple spaces, switching spaces, deleting one space, or space history.
- UI redesign or Figma parity work.

## Technical Notes

- Likely files:
  - `src/domain/types.ts`
  - `src/domain/defaults.ts`
  - new or existing domain helper for space updates
  - `src/store/AppStoreContext.tsx`
  - `src/routes/SettingsPage.tsx`
  - `src/styles/screens.css`
  - `src/domain/*.test.ts`
  - `.trellis/spec/frontend/state-management.md`
- Keep route state local for form inputs and feedback.
- Store action should return a typed `StoreWriteResult<EmotionalSpace>`.
