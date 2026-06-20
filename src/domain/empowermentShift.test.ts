import { describe, expect, it } from "vitest";
import { buildQuickRecordImpacts, deriveAllAccountSummaries } from "./accounts";
import { createInitialState } from "./defaults";
import {
  buildEmpowermentShiftDiscoveryPointInput,
  getEmpowermentPrompt,
  getEmpowermentSummary,
  getRecommendedEmpowermentTarget,
  type EmpowermentShiftInput,
} from "./empowermentShift";
import { addDiscoveryPointToState } from "./topics";
import type { AppState, Episode } from "./types";

const spaceId = "space_1";
const timestamp = "2026-06-20T10:00:00.000Z";

function input(overrides: Partial<EmpowermentShiftInput> = {}): EmpowermentShiftInput {
  return {
    spaceId,
    currentStance: "rescuing",
    targetStance: "guide",
    promptResponse: "我可以问对方需要什么，但不替 TA 做决定。",
    nextAction: "offer_support_no_takeover",
    ...overrides,
  };
}

describe("empowerment shift helpers", () => {
  it("recommends the TED target from the current stance", () => {
    expect(getRecommendedEmpowermentTarget("powerless")).toBe("creator");
    expect(getRecommendedEmpowermentTarget("rescuing")).toBe("guide");
    expect(getRecommendedEmpowermentTarget("attacking_control")).toBe("challenger");
    expect(getRecommendedEmpowermentTarget("not_sure")).toBe("creator");
  });

  it("builds prompts for each empowered stance", () => {
    expect(getEmpowermentPrompt("creator")).toBe("我仍然能选择的一件小事是什么？");
    expect(getEmpowermentPrompt("guide")).toBe("我能提供什么问题、边界或支持，而不接管？");
    expect(getEmpowermentPrompt("challenger")).toBe("我能清楚说出的事实或限度是什么，而不攻击？");
  });

  it("builds an empowerment summary", () => {
    expect(getEmpowermentSummary(input())).toMatchObject({
      currentStance: "拯救者姿态：想替对方负责太多",
      targetStance: "引导者：我支持，但不接管",
      prompt: "我能提供什么问题、边界或支持，而不接管？",
      promptResponse: "我可以问对方需要什么，但不替 TA 做决定。",
      nextAction: "表达关心，但不接管",
    });
  });

  it("builds a manual action-experiment discovery point", () => {
    const pointInput = buildEmpowermentShiftDiscoveryPointInput(
      input({ currentStance: "attacking_control", targetStance: "challenger" }),
    );

    expect(pointInput).toMatchObject({
      spaceId,
      title: "赋能三角：拿回一点主动权",
      kind: "action_idea",
      theme: "action_experiment",
      sourceType: "manual",
      sourceTitle: "赋能三角切换",
    });
    expect(pointInput.note).toContain("我刚才更像：迫害者姿态");
    expect(pointInput.note).toContain("我想换到：挑战者");
    expect(pointInput.note).toContain("校准：从迫害者姿态转向挑战者");
  });

  it("can save as a topic when the next action is later review", () => {
    const pointInput = buildEmpowermentShiftDiscoveryPointInput(
      input({ nextAction: "save_later_topic" }),
    );

    expect(pointInput.kind).toBe("topic");
  });

  it("does not affect storage jar summaries when saved as a discovery point", () => {
    const accountImpacts = buildQuickRecordImpacts(
      {
        spaceId,
        spaceType: "interpersonal",
        facts: "对方具体回应了我的勇气",
        connectionEvidence: "对方具体回应了我的勇气",
        nextAction: "record_facts",
      },
      { sourceId: "episode_1", createdAt: timestamp },
    );
    const episode: Episode = {
      id: "episode_1",
      spaceId,
      source: "quick_record",
      title: "一次互动",
      facts: "对方具体回应了我的勇气",
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
      buildEmpowermentShiftDiscoveryPointInput(input()),
      { id: "topic_1", timestamp },
    ).state;

    expect(deriveAllAccountSummaries(updated)).toEqual(before);
  });
});
