import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createInitialState } from "../domain/defaults";
import { createLocalStorageAdapter } from "./storageAdapter";

const key = "mood-bank:test:app-state";

function createStorageMock(options: { throwOnSet?: boolean } = {}): Storage {
  const values = new Map<string, string>();

  return {
    get length() {
      return values.size;
    },
    clear() {
      values.clear();
    },
    getItem(itemKey: string) {
      return values.get(itemKey) ?? null;
    },
    key(index: number) {
      return Array.from(values.keys())[index] ?? null;
    },
    removeItem(itemKey: string) {
      values.delete(itemKey);
    },
    setItem(itemKey: string, value: string) {
      if (options.throwOnSet) {
        throw new Error("blocked");
      }

      values.set(itemKey, String(value));
    },
  };
}

describe("createLocalStorageAdapter", () => {
  let localStorageMock: Storage;

  beforeEach(() => {
    localStorageMock = createStorageMock();
    vi.stubGlobal("window", { localStorage: localStorageMock });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("loads initial state when storage is empty", () => {
    const adapter = createLocalStorageAdapter(key);
    const result = adapter.load();

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.state.settings.hasCompletedSetup).toBe(false);
    }
  });

  it("loads valid v1 state", () => {
    const state = createInitialState();
    localStorageMock.setItem(key, JSON.stringify(state));

    const result = createLocalStorageAdapter(key).load();

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.state.schemaVersion).toBe(1);
    }
  });

  it("returns corrupted fallback for invalid JSON", () => {
    localStorageMock.setItem(key, "{");

    const result = createLocalStorageAdapter(key).load();

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe("corrupted");
      expect(result.fallbackState.settings.hasCompletedSetup).toBe(false);
    }
  });

  it("returns unsupported fallback for future schema versions", () => {
    localStorageMock.setItem(key, JSON.stringify({ ...createInitialState(), schemaVersion: 999 }));

    const result = createLocalStorageAdapter(key).load();

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe("unsupported_version");
    }
  });

  it("saves and resets the root state key", () => {
    const adapter = createLocalStorageAdapter(key);
    const state = createInitialState();

    expect(adapter.save(state)).toEqual({ ok: true });
    expect(localStorageMock.getItem(key)).toBe(JSON.stringify(state));
    expect(adapter.reset()).toEqual({ ok: true });
    expect(localStorageMock.getItem(key)).toBeNull();
  });

  it("reports unavailable when localStorage write throws", () => {
    vi.stubGlobal("window", { localStorage: createStorageMock({ throwOnSet: true }) });

    const adapter = createLocalStorageAdapter(key);

    expect(adapter.isAvailable()).toBe(false);
    expect(adapter.save(createInitialState())).toMatchObject({ ok: false, status: "unavailable" });
  });
});
