import { describe, expect, it } from "vitest";
import { buildQuickRecordImpacts, deriveAllAccountSummaries } from "./accounts";
import { createInitialState } from "./defaults";
import { buildOldEchoDiscoveryPointInput, getOldEchoSummary } from "./oldEcho";
import { addDiscoveryPointToState } from "./topics";
import type { AppState, Episode } from "./types";

const spaceId = "space_1";
const timestamp = "2026-06-20T10:00:00.000Z";

describe("old echo branch helpers", () => {
  it("builds a non-diagnostic summary", () => {
    const summary = getOldEchoSummary({
      spaceId,
      presentFact: "看到对方暂时没有回复",
      need: "not_abandoned",
      protection: "check",
      innerCritic: "我是不是太麻烦了",
      response: "name_present",
    });

    expect(summary).toMatchObject({
      presentFact: "看到对方暂时没有回复",
      need: "不被丢下",
      protection: "检查",
      innerCritic: "我是不是太麻烦了",
      response: "对自己说：这是旧感觉被碰到，不等于今天又发生了",
    });
    expect(summary.calibration).toContain("不等于我已经知道创伤来源");
  });

  it("builds an old-echo discovery point with no account impacts", () => {
    const pointInput = buildOldEchoDiscoveryPointInput({
      spaceId,
      presentFact: "看到歌单里有《后来》",
      need: "safety",
      protection: "prove",
      innerCritic: "",
      response: "record_facts",
    });

    expect(pointInput).toMatchObject({
      spaceId,
      title: "旧感觉 / 内部审判者：一次看见",
      kind: "discovery",
      theme: "old_echo",
      sourceType: "manual",
      sourceTitle: "旧感觉 / 内部审判者轻检查",
    });
    expect(pointInput.note).toContain("今天的蚊子：看到歌单里有《后来》");
    expect(pointInput.note).toContain("内部审判者：没有写下，或暂时说不清。");
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
      buildOldEchoDiscoveryPointInput({
        spaceId,
        presentFact: "今天的事实",
        need: "respect",
        protection: "withdraw",
        response: "save_later",
      }),
      { id: "topic_1", timestamp },
    ).state;

    expect(deriveAllAccountSummaries(updated)).toEqual(before);
  });
});
