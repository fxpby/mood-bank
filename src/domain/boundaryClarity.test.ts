import { describe, expect, it } from "vitest";
import { buildQuickRecordImpacts, deriveAllAccountSummaries } from "./accounts";
import {
  buildBoundaryClarityDiscoveryPointInput,
  getBoundaryClaritySummary,
  type BoundaryClarityInput,
} from "./boundaryClarity";
import { createInitialState } from "./defaults";
import { addDiscoveryPointToState } from "./topics";
import type { AppState, Episode } from "./types";

const spaceId = "space_1";
const timestamp = "2026-06-20T10:00:00.000Z";

function input(overrides: Partial<BoundaryClarityInput> = {}): BoundaryClarityInput {
  return {
    spaceId,
    signal: "guilt",
    mine: "expression",
    notMine: "others_disappointment",
    limit: "care_not_take_over",
    limitSentence: "我可以关心，但今晚不继续接住全部。",
    form: "time",
    practice: "allow_disappointment",
    nextAction: "no_extra_message",
    ...overrides,
  };
}

describe("boundary clarity helpers", () => {
  it("builds a responsibility split summary", () => {
    expect(getBoundaryClaritySummary(input())).toMatchObject({
      signal: "内疚",
      mine: "我的表达",
      notMine: "对方是否失望",
      limit: "我可以关心，但不接管",
      limitSentence: "我可以关心，但今晚不继续接住全部。",
      form: "时间：晚点回复/延迟决定",
      practice: "我需要允许对方失望",
      nextAction: "今晚不补发",
    });
  });

  it("builds a manual boundary discovery point", () => {
    const pointInput = buildBoundaryClarityDiscoveryPointInput(input({ signal: "anger" }));

    expect(pointInput).toMatchObject({
      spaceId,
      title: "边界清晰：一次责任分开",
      kind: "action_idea",
      theme: "boundary",
      sourceType: "manual",
      sourceTitle: "边界清晰轻检查",
    });
    expect(pointInput.note).toContain("边界信号：愤怒");
    expect(pointInput.note).toContain("我的部分：我的表达");
    expect(pointInput.note).toContain("校准：愤怒不一定是坏事");
  });

  it("can save as a topic when the next action is later review", () => {
    const pointInput = buildBoundaryClarityDiscoveryPointInput(
      input({ nextAction: "save_later_topic" }),
    );

    expect(pointInput.kind).toBe("topic");
    expect(pointInput.exploreQuestion).toContain("如果对方失望");
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
      buildBoundaryClarityDiscoveryPointInput(input()),
      { id: "topic_1", timestamp },
    ).state;

    expect(deriveAllAccountSummaries(updated)).toEqual(before);
  });
});
