import { describe, expect, it } from "vitest";
import { buildQuickRecordImpacts, deriveAllAccountSummaries } from "./accounts";
import {
  buildSelfCompassionDiscoveryPointInput,
  getSelfCompassionSummary,
  type SelfCompassionInput,
} from "./selfCompassion";
import { createInitialState } from "./defaults";
import { addDiscoveryPointToState } from "./topics";
import type { AppState, Episode } from "./types";

const spaceId = "space_1";
const timestamp = "2026-06-20T10:00:00.000Z";

function input(overrides: Partial<SelfCompassionInput> = {}): SelfCompassionInput {
  return {
    spaceId,
    pain: "self_blame",
    painText: "我又没做好",
    reminder: "responsible_no_attack",
    criticSentence: "我太麻烦了",
    caringRewrite: "我现在很害怕，但不用攻击自己来证明认真。",
    kindnessAction: "non_attack_sentence",
    nextAction: "stop_self_attack",
    ...overrides,
  };
}

describe("self compassion helpers", () => {
  it("builds a self-compassion summary", () => {
    expect(getSelfCompassionSummary(input())).toMatchObject({
      pain: "我在自责",
      painText: "我又没做好",
      reminder: "我可以负责，但不用攻击自己。",
      criticSentence: "我太麻烦了",
      caringRewrite: "我现在很害怕，但不用攻击自己来证明认真。",
      kindnessAction: "给自己一句不攻击的话",
      nextAction: "什么都不做，先停止攻击自己",
    });
  });

  it("builds a manual self-care discovery point", () => {
    const pointInput = buildSelfCompassionDiscoveryPointInput(input());

    expect(pointInput).toMatchObject({
      spaceId,
      title: "自我关怀：一次不攻击自己的暂停",
      kind: "action_idea",
      theme: "self_care",
      sourceType: "manual",
      sourceTitle: "自我关怀暂停",
    });
    expect(pointInput.note).toContain("我看见的痛苦：我在自责");
    expect(pointInput.note).toContain("校准：停止攻击自己不是逃避责任");
  });

  it("uses a non-harmful default rewrite when no text is provided", () => {
    const summary = getSelfCompassionSummary(
      input({
        pain: "perfectionism",
        criticSentence: "",
        caringRewrite: "",
      }),
    );

    expect(summary.caringRewrite).toBe("我这次没做到全部，不等于我没有在练习。");
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
      buildSelfCompassionDiscoveryPointInput(input()),
      { id: "topic_1", timestamp },
    ).state;

    expect(deriveAllAccountSummaries(updated)).toEqual(before);
  });
});
