import { describe, expect, it } from "vitest";
import { deriveAllAccountSummaries } from "./accounts";
import { createInitialState } from "./defaults";
import {
  buildEmotionCalibrationDiscoveryPointInput,
  getEmotionCalibrationSummary,
  type EmotionCalibrationInput,
} from "./emotionCalibration";
import { addDiscoveryPointToState } from "./topics";

const spaceId = "space_1";
const timestamp = "2026-06-19T12:00:00.000Z";

function input(overrides: Partial<EmotionCalibrationInput> = {}): EmotionCalibrationInput {
  return {
    spaceId,
    emotion: "fear",
    signal: "care_loss",
    impulse: "control",
    wiseAction: "name_allow",
    ...overrides,
  };
}

describe("emotion calibration helpers", () => {
  it("frames fear as a signal without making it an enemy", () => {
    const summary = getEmotionCalibrationSummary(input());

    expect(summary).toMatchObject({
      emotion: "恐惧/害怕",
      signal: "我很在乎，也害怕失去",
      impulse: "想控制对方或结果",
      choice: "先说：我现在有这个情绪",
    });
    expect(summary.calibration).toContain("恐惧不是敌人");
  });

  it("builds a discovery point with a theme based on the selected signal", () => {
    const point = buildEmotionCalibrationDiscoveryPointInput(
      input({
        emotion: "anger",
        signal: "boundary",
        impulse: "attack_blame",
        wiseAction: "boundary_sentence",
      }),
    );

    expect(point).toMatchObject({
      sourceType: "manual",
      title: "情绪校准：愤怒",
      kind: "discovery",
      theme: "boundary",
    });
    expect(point.note).toContain("更稳的选择：只写一句边界或请求");
  });

  it("saving an emotion calibration discovery point does not affect storage jar summaries", () => {
    const state = createInitialState();
    const before = deriveAllAccountSummaries(state);
    const pointInput = buildEmotionCalibrationDiscoveryPointInput(input());
    const next = addDiscoveryPointToState(state, pointInput, {
      id: "topic_1",
      timestamp,
    }).state;

    expect(next.topics).toHaveLength(1);
    expect(deriveAllAccountSummaries(next)).toEqual(before);
  });
});
