import { createInitialState } from "../domain/defaults";
import type { AppState, StorageStatus } from "../domain/types";
import { validateMinimumAppState } from "../domain/validation";

export const APP_STATE_STORAGE_KEY = "mood-bank:v1:app-state";

export type LoadResult =
  | { ok: true; state: AppState; status: "available" }
  | { ok: false; fallbackState: AppState; status: StorageStatus; error?: string };

export type StorageWriteResult =
  | { ok: true }
  | { ok: false; status: StorageStatus; error?: string };

export type StorageAdapter = {
  load(): LoadResult;
  save(state: AppState): StorageWriteResult;
  reset(): StorageWriteResult;
  isAvailable(): boolean;
};

export function createLocalStorageAdapter(storageKey = APP_STATE_STORAGE_KEY): StorageAdapter {
  return {
    load(): LoadResult {
      if (!isLocalStorageAvailable()) {
        return {
          ok: false,
          fallbackState: createInitialState(),
          status: "unavailable",
          error: "localStorage is unavailable.",
        };
      }

      try {
        const raw = window.localStorage.getItem(storageKey);

        if (!raw) {
          return { ok: true, state: createInitialState(), status: "available" };
        }

        const parsed = JSON.parse(raw) as unknown;
        const validated = validateMinimumAppState(parsed);

        if (!validated.ok) {
          return {
            ok: false,
            fallbackState: createInitialState(),
            status: validated.unsupportedVersion ? "unsupported_version" : "corrupted",
            error: validated.error,
          };
        }

        return { ok: true, state: validated.state, status: "available" };
      } catch (error) {
        return {
          ok: false,
          fallbackState: createInitialState(),
          status: "corrupted",
          error: error instanceof Error ? error.message : "Failed to load local data.",
        };
      }
    },

    save(state: AppState): StorageWriteResult {
      if (!isLocalStorageAvailable()) {
        return { ok: false, status: "unavailable", error: "localStorage is unavailable." };
      }

      try {
        window.localStorage.setItem(storageKey, JSON.stringify(state));
        return { ok: true };
      } catch (error) {
        return {
          ok: false,
          status: "unavailable",
          error: error instanceof Error ? error.message : "Failed to save local data.",
        };
      }
    },

    reset(): StorageWriteResult {
      if (!isLocalStorageAvailable()) {
        return { ok: false, status: "unavailable", error: "localStorage is unavailable." };
      }

      try {
        window.localStorage.removeItem(storageKey);
        return { ok: true };
      } catch (error) {
        return {
          ok: false,
          status: "unavailable",
          error: error instanceof Error ? error.message : "Failed to reset local data.",
        };
      }
    },

    isAvailable(): boolean {
      return isLocalStorageAvailable();
    },
  };
}

function isLocalStorageAvailable(): boolean {
  if (typeof window === "undefined" || !("localStorage" in window)) {
    return false;
  }

  try {
    const testKey = "mood-bank:storage-test";
    window.localStorage.setItem(testKey, "1");
    const didRoundTrip = window.localStorage.getItem(testKey) === "1";
    window.localStorage.removeItem(testKey);
    return didRoundTrip;
  } catch {
    return false;
  }
}
