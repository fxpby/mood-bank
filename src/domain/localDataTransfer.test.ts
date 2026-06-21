import { describe, expect, it } from "vitest";
import { createInitialState } from "./defaults";
import {
  buildLocalDataExportFileName,
  getLocalDataSummary,
  parseLocalDataImport,
  serializeLocalData,
} from "./localDataTransfer";

describe("local data transfer helpers", () => {
  it("serializes current state as readable JSON", () => {
    const state = createInitialState();

    expect(serializeLocalData(state)).toBe(`${JSON.stringify(state, null, 2)}\n`);
  });

  it("parses a valid backup state", () => {
    const state = createInitialState();
    const result = parseLocalDataImport(JSON.stringify(state));

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.state.schemaVersion).toBe(1);
      expect(result.state.settings.hasCompletedSetup).toBe(false);
    }
  });

  it("rejects invalid JSON without a state", () => {
    const result = parseLocalDataImport("{");

    expect(result).toMatchObject({ ok: false, reason: "invalid_json" });
  });

  it("rejects unsupported future schema versions", () => {
    const result = parseLocalDataImport(
      JSON.stringify({ ...createInitialState(), schemaVersion: 999 }),
    );

    expect(result).toMatchObject({ ok: false, reason: "unsupported_version" });
  });

  it("summarizes local data counts", () => {
    const state = {
      ...createInitialState(),
      episodes: [
        {
          id: "episode_1",
          spaceId: "space_1",
          source: "quick_record" as const,
          title: "一次互动",
          facts: "事实",
          interpretation: "",
          emotions: ["not_sure"],
          bodySensations: ["not_sure"],
          connectionLevel: "not_sure" as const,
          activationLevel: "not_sure" as const,
          nextAction: "not_now",
          accountImpacts: [],
          createdAt: "2026-06-21T00:00:00.000Z",
          updatedAt: "2026-06-21T00:00:00.000Z",
        },
      ],
      topics: [
        {
          id: "topic_1",
          spaceId: "space_1",
          title: "一个发现点",
          kind: "discovery" as const,
          status: "stored_for_later" as const,
          sourceType: "manual" as const,
          createdAt: "2026-06-21T00:00:00.000Z",
          updatedAt: "2026-06-21T00:00:00.000Z",
        },
      ],
    };

    expect(getLocalDataSummary(state)).toMatchObject({ episodes: 1, topics: 1 });
  });

  it("builds a dated backup file name", () => {
    expect(buildLocalDataExportFileName(new Date("2026-06-21T08:00:00.000Z"))).toBe(
      "mood-bank-backup-2026-06-21.json",
    );
  });
});

