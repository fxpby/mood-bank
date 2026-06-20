import { describe, expect, it } from "vitest";
import { buildQuickRecordImpacts, deriveAllAccountSummaries } from "./accounts";
import { createInitialState } from "./defaults";
import {
  buildHealthyLoveDiscoveryPointInput,
  getHealthyLoveSummary,
  type HealthyLoveInput,
} from "./healthyLove";
import { addDiscoveryPointToState } from "./topics";
import type { AppState, Episode } from "./types";

const spaceId = "space_1";
const timestamp = "2026-06-20T10:00:00.000Z";

function input(overrides: Partial<HealthyLoveInput> = {}): HealthyLoveInput {
  return {
    spaceId,
    phase: "repair_negotiation",
    leaning: "repair_willingness",
    momentNote: "我想被理解，也愿意理解对方一点。",
    action: "repair_my_part",
    ...overrides,
  };
}

describe("healthy love helpers", () => {
  it("builds a healthy love summary", () => {
    const summary = getHealthyLoveSummary(input());

    expect(summary).toMatchObject({
      phase: "修复/磨合：我们可能需要理解和协商",
      leaning: "真实修复：我愿意理解、负责和靠近一点",
      momentNote: "我想被理解，也愿意理解对方一点。",
      action: "只修复我能负责的部分",
    });
    expect(summary.calibration).toContain("修复不是赢，也不是自我消失");
  });

  it("builds a manual relationship-learning discovery point", () => {
    const pointInput = buildHealthyLoveDiscoveryPointInput(input());

    expect(pointInput).toMatchObject({
      spaceId,
      title: "关系学习：这一刻练习爱与被爱",
      kind: "discovery",
      theme: "relationship_learning",
      sourceType: "manual",
      sourceTitle: "爱与被爱轻校准",
    });
    expect(pointInput.note).toContain("这一刻阶段：修复/磨合");
    expect(pointInput.note).toContain("此刻更像：真实修复");
    expect(pointInput.note).toContain("保留自由的一步：只修复我能负责的部分");
  });

  it("can save as a topic when the next action is later review", () => {
    const pointInput = buildHealthyLoveDiscoveryPointInput(
      input({ action: "save_later_topic" }),
    );

    expect(pointInput.kind).toBe("topic");
  });

  it("uses attachment-alarm calibration without making a diagnosis", () => {
    const summary = getHealthyLoveSummary(
      input({
        leaning: "attachment_alarm",
        momentNote: "",
        action: "pause_before_message",
      }),
    );

    expect(summary.momentNote).toContain("更多确定感");
    expect(summary.calibration).toContain("依恋警报不是错");
    expect(summary.calibration).not.toContain("诊断");
  });

  it("does not affect storage jar summaries when saved as a discovery point", () => {
    const accountImpacts = buildQuickRecordImpacts(
      {
        spaceId,
        spaceType: "interpersonal",
        facts: "一次修复对话",
        connectionEvidence: "对方愿意继续听我说",
        nextAction: "record_facts",
      },
      { sourceId: "episode_1", createdAt: timestamp },
    );
    const episode: Episode = {
      id: "episode_1",
      spaceId,
      source: "quick_record",
      title: "一次修复对话",
      facts: "一次修复对话",
      interpretation: "",
      emotions: [],
      bodySensations: [],
      connectionLevel: "not_sure",
      activationLevel: "not_sure",
      nextAction: "record_facts",
      accountImpacts,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    const state: AppState = {
      ...createInitialState(),
      episodes: [episode],
    };
    const before = deriveAllAccountSummaries(state);

    const updated = addDiscoveryPointToState(
      state,
      buildHealthyLoveDiscoveryPointInput(input()),
      { id: "topic_1", timestamp },
    ).state;

    expect(deriveAllAccountSummaries(updated)).toEqual(before);
  });
});
