import { describe, expect, it } from "vitest";
import { accountReasonCopy } from "../copy/accounts";
import { deriveAllAccountSummaries } from "./accounts";
import { createInitialState } from "./defaults";
import { deleteEpisodeFromState, updateEpisodeInState } from "./episodes";
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

describe("updateEpisodeInState", () => {
  it("updates one episode and recomputes account impacts from edited fields", () => {
    const state: AppState = {
      ...createInitialState(),
      spaces: [
        {
          id: spaceId,
          displayName: "某段关系",
          description: "",
          type: "interpersonal",
          defaultRecordingDepth: "quick",
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ],
      episodes: [episode("episode_1"), episode("episode_2")],
    };

    const result = updateEpisodeInState(
      state,
      {
        id: "episode_1",
        title: "  更新后的互动  ",
        facts: "  对方具体回应了我的勇气  ",
        interpretation: "",
        emotions: ["被看见/很暖"],
        bodySensations: ["胸口紧"],
        connectionLevel: 3,
        activationLevel: 2,
        nextAction: "not_now",
        connectionEvidence: " 对方具体回应了我的勇气 ",
        energyEffect: "lighter",
      },
      "2026-06-18T14:00:00.000Z",
    );

    expect(result.episode).toMatchObject({
      id: "episode_1",
      title: "更新后的互动",
      facts: "对方具体回应了我的勇气",
      interpretation: "",
      emotions: ["被看见/很暖"],
      bodySensations: ["胸口紧"],
      connectionLevel: 3,
      activationLevel: 2,
      nextAction: "not_now",
      createdAt: timestamp,
      updatedAt: "2026-06-18T14:00:00.000Z",
    });
    expect(result.episode?.accountImpacts.map((impact) => impact.reasonCode)).toEqual([
      "observable_connection_evidence",
      "energy_restored",
    ]);
    expect(result.state.episodes.find((item) => item.id === "episode_2")).toEqual(
      state.episodes.find((item) => item.id === "episode_2"),
    );
  });

  it("falls back blank title and default arrays while preserving linked objects", () => {
    const linkedAnchor = anchor("anchor_linked", "episode_1");
    const point = linkedPoint("episode_1");
    const state: AppState = {
      ...createInitialState(),
      spaces: [
        {
          id: spaceId,
          displayName: "某段关系",
          description: "",
          type: "interpersonal",
          defaultRecordingDepth: "quick",
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ],
      episodes: [episode("episode_1")],
      anchors: [linkedAnchor],
      topics: [point],
    };

    const result = updateEpisodeInState(
      state,
      {
        id: "episode_1",
        title: "   ",
        facts: "  一个事实  ",
        emotions: [],
        bodySensations: [],
      },
      "2026-06-18T14:00:00.000Z",
    );

    expect(result.episode).toMatchObject({
      title: "一次互动",
      facts: "一个事实",
      emotions: ["not_sure"],
      bodySensations: ["not_sure"],
      connectionLevel: "not_sure",
      activationLevel: "not_sure",
      nextAction: "not_now",
    });
    expect(result.state.anchors).toEqual([linkedAnchor]);
    expect(result.state.topics).toEqual([point]);
  });

  it("uses self-contact evidence for self-facing spaces", () => {
    const state: AppState = {
      ...createInitialState(),
      spaces: [
        {
          id: spaceId,
          displayName: "我和自己",
          description: "",
          type: "self",
          defaultRecordingDepth: "quick",
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ],
      episodes: [episode("episode_1")],
    };

    const result = updateEpisodeInState(
      state,
      {
        id: "episode_1",
        title: "看见自己",
        facts: "我写下了真实感受",
        nextAction: "record_facts",
        connectionEvidence: "不应使用这条人际证据",
        selfContactEvidence: "我看见自己其实很害怕",
      },
      "2026-06-18T14:00:00.000Z",
    );

    expect(result.episode?.accountImpacts.map((impact) => impact.reasonCode)).toEqual([
      "self_contact_evidence",
      "owned_next_action",
    ]);
    expect(result.episode?.accountImpacts[0]?.evidence).toBe("我看见自己其实很害怕");
  });

  it("preserves skipped interpretation account impact when the original record had it", () => {
    const original = episode("episode_1");
    const state: AppState = {
      ...createInitialState(),
      episodes: [
        {
          ...original,
          interpretation: "",
          nextAction: "not_now",
          accountImpacts: [
            {
              id: "episode_episode_1_self_fact_interpretation_split",
              sourceType: "episode",
              sourceId: "episode_1",
              account: "self",
              value: 1,
              reasonCode: "fact_interpretation_split",
              reason: accountReasonCopy.fact_interpretation_split,
              evidence: "暂时不解释",
              createdAt: timestamp,
            },
          ],
        },
      ],
    };

    const result = updateEpisodeInState(
      state,
      {
        id: "episode_1",
        title: "一次互动",
        facts: "仍然只有事实",
        interpretation: "",
        nextAction: "not_now",
      },
      "2026-06-18T14:00:00.000Z",
    );

    expect(result.episode?.accountImpacts).toHaveLength(1);
    expect(result.episode?.accountImpacts[0]).toMatchObject({
      reasonCode: "fact_interpretation_split",
      evidence: "暂时不解释",
    });
  });

  it("updates derived storage jar summaries after recomputing the edited episode", () => {
    const state: AppState = {
      ...createInitialState(),
      spaces: [
        {
          id: spaceId,
          displayName: "某段关系",
          description: "",
          type: "interpersonal",
          defaultRecordingDepth: "quick",
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ],
      episodes: [episode("episode_1")],
    };
    expect(deriveAllAccountSummaries(state).find((summary) => summary.account === "self")?.value).toBe(1);

    const result = updateEpisodeInState(
      state,
      {
        id: "episode_1",
        title: "一次互动",
        facts: "只保留事实",
        nextAction: "not_now",
        energyEffect: "lighter",
      },
      "2026-06-18T14:00:00.000Z",
    );

    const summaries = deriveAllAccountSummaries(result.state);
    expect(summaries.find((summary) => summary.account === "self")?.value).toBe(0);
    expect(summaries.find((summary) => summary.account === "energy")?.value).toBe(1);
  });

  it("returns unchanged state for unknown episode ids", () => {
    const state = createInitialState();

    const result = updateEpisodeInState(
      state,
      { id: "missing", title: "不存在", facts: "不存在" },
      "2026-06-18T14:00:00.000Z",
    );

    expect(result.episode).toBeUndefined();
    expect(result.state).toEqual(state);
  });
});
