import { describe, expect, it } from "vitest";
import { createInitialState } from "./defaults";
import { validateMinimumAppState } from "./validation";

describe("validateMinimumAppState", () => {
  it("accepts a valid v1 state", () => {
    const state = createInitialState();
    const result = validateMinimumAppState(state);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.state.schemaVersion).toBe(1);
    }
  });

  it("defaults missing reserved arrays to empty arrays", () => {
    const raw = createInitialState() as Record<string, unknown>;
    delete raw.topics;
    delete raw.experiments;
    delete raw.personalActions;

    const result = validateMinimumAppState(raw);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.state.topics).toEqual([]);
      expect(result.state.experiments).toEqual([]);
      expect(result.state.personalActions).toEqual([]);
    }
  });

  it("rejects missing schemaVersion as corrupted shape", () => {
    const raw = createInitialState() as Record<string, unknown>;
    delete raw.schemaVersion;

    const result = validateMinimumAppState(raw);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.unsupportedVersion).toBe(false);
    }
  });

  it("rejects future schemaVersion as unsupported", () => {
    const raw = { ...createInitialState(), schemaVersion: 999 };
    const result = validateMinimumAppState(raw);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.unsupportedVersion).toBe(true);
    }
  });

  it("rejects invalid settings shape", () => {
    const raw = { ...createInitialState(), settings: {} };
    const result = validateMinimumAppState(raw);

    expect(result.ok).toBe(false);
  });
});
