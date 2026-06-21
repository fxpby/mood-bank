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

  it("normalizes legacy reserved topics into readable discovery points", () => {
    const raw = {
      ...createInitialState(),
      topics: [
        {
          id: "topic_legacy",
          createdAt: "2026-06-18T10:00:00.000Z",
          updatedAt: "2026-06-18T10:00:00.000Z",
        },
      ],
    };

    const result = validateMinimumAppState(raw);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.state.topics[0]).toMatchObject({
        id: "topic_legacy",
        title: "一个稍后再看的点",
        kind: "discovery",
        status: "stored_for_later",
        sourceType: "manual",
      });
    }
  });

  it("normalizes legacy reserved experiments into readable small practices", () => {
    const raw = {
      ...createInitialState(),
      experiments: [
        {
          id: "experiment_legacy",
          createdAt: "2026-06-18T10:00:00.000Z",
          updatedAt: "2026-06-18T10:00:00.000Z",
        },
      ],
    };

    const result = validateMinimumAppState(raw);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.state.experiments[0]).toMatchObject({
        id: "experiment_legacy",
        focus: "一个小练习",
        tinyAction: "做一个今天能完成的小动作",
        completionMarker: "我试过一次就算",
        source: "manual",
        attempts: [],
      });
    }
  });

  it("keeps discovery-point sourced experiments readable", () => {
    const raw = {
      ...createInitialState(),
      experiments: [
        {
          id: "experiment_from_topic",
          spaceId: "space_1",
          focus: "练习回应一个发现点",
          tinyAction: "写一句可执行的小动作",
          completionMarker: "写出来就算",
          source: "discovery_point",
          sourceActionId: "topic_1",
          attempts: [],
          createdAt: "2026-06-18T10:00:00.000Z",
          updatedAt: "2026-06-18T10:00:00.000Z",
        },
      ],
    };

    const result = validateMinimumAppState(raw);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.state.experiments[0]).toMatchObject({
        id: "experiment_from_topic",
        source: "discovery_point",
        sourceActionId: "topic_1",
      });
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
