import { describe, expect, it } from "vitest";
import { accountReasonCopy } from "../copy/accounts";
import { deriveAllAccountSummaries } from "./accounts";
import { createInitialState } from "./defaults";
import { deleteEpisodeFromState } from "./episodes";
import type { AccountImpact, Anchor, AppState, DiscoveryPoint, Episode } from "./types";

const spaceId = "space_1";
const timestamp = "2026-06-18T12:00:00.000Z";

function impact(id: string, sourceId: string): AccountImpact {
  return {
    id,
    sourceType: "episode",
    sourceId,
    account: "self",
    value: 1,
    reasonCode: "owned_next_action",
    reason: accountReasonCopy.owned_next_action,
    evidence: "delay_10_min",
    createdAt: timestamp,
  };
}

function episode(id: string): Episode {
  return {
    id,
    spaceId,
    source: "quick_record",
    title: "一次互动",
    facts: "对方具体回应了我的勇气",
    interpretation: "",
    emotions: [],
    bodySensations: [],
    connectionLevel: "not_sure",
    activationLevel: "not_sure",
    nextAction: "delay_10_min",
    accountImpacts: [impact(`impact_${id}`, id)],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function anchor(id: string, sourceId: string): Anchor {
  return {
    id,
    spaceId,
    text: "我可以晚点再回来。",
    sourceType: "episode",
    sourceId,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function linkedPoint(sourceId: string): DiscoveryPoint {
  return {
    id: "topic_1",
    spaceId,
    title: "一个稍后再看的点",
    kind: "topic",
    status: "stored_for_later",
    sourceType: "episode",
    sourceId,
    sourceTitle: "一次互动",
    sourceSnippet: "对方具体回应了我的勇气",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

describe("deleteEpisodeFromState", () => {
  it("removes the episode and linked anchors while preserving linked discovery points", () => {
    const state: AppState = {
      ...createInitialState(),
      episodes: [episode("episode_1"), episode("episode_2")],
      anchors: [
        anchor("anchor_linked", "episode_1"),
        anchor("anchor_other", "episode_2"),
        {
          id: "anchor_return",
          spaceId,
          text: "回到自己的锚点",
          sourceType: "return_to_self",
          sourceId: "practice_1",
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ],
      topics: [linkedPoint("episode_1")],
    };
    const beforeSummaries = deriveAllAccountSummaries(state);

    const result = deleteEpisodeFromState(state, {
      id: "episode_1",
      deleteLinkedAnchors: true,
    });

    expect(result.episode?.id).toBe("episode_1");
    expect(result.state.episodes.map((item) => item.id)).toEqual(["episode_2"]);
    expect(result.state.anchors.map((item) => item.id)).toEqual(["anchor_other", "anchor_return"]);
    expect(result.state.topics.map((item) => item.id)).toEqual(["topic_1"]);
    expect(deriveAllAccountSummaries(result.state).find((summary) => summary.account === "self")?.value).toBe(1);
    expect(beforeSummaries.find((summary) => summary.account === "self")?.value).toBe(2);
  });

  it("can preserve linked anchors when requested", () => {
    const state: AppState = {
      ...createInitialState(),
      episodes: [episode("episode_1")],
      anchors: [anchor("anchor_linked", "episode_1")],
    };

    const result = deleteEpisodeFromState(state, {
      id: "episode_1",
      deleteLinkedAnchors: false,
    });

    expect(result.state.episodes).toEqual([]);
    expect(result.state.anchors.map((item) => item.id)).toEqual(["anchor_linked"]);
  });

  it("returns no-op state for unknown episode ids", () => {
    const state = createInitialState();

    const result = deleteEpisodeFromState(state, { id: "missing" });

    expect(result.episode).toBeUndefined();
    expect(result.state).toBe(state);
  });
});
