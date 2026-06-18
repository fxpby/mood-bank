import { describe, expect, it } from "vitest";
import { accountReasonCopy } from "../copy/accounts";
import { buildQuickRecordImpacts, deriveAllAccountSummaries } from "./accounts";
import { createInitialState } from "./defaults";
import { addDiscoveryPointToState, updateDiscoveryPointStatusInState } from "./topics";
import type { AppState } from "./types";

const timestamp = "2026-06-18T12:00:00.000Z";
const spaceId = "space_1";

describe("discovery point state helpers", () => {
  it("adds new discovery points newest first", () => {
    const first = addDiscoveryPointToState(
      createInitialState(),
      {
        spaceId,
        title: "语言切换像缓冲",
        kind: "discovery",
        theme: "emotion",
        note: "英文像一层缓冲。",
      },
      { id: "topic_1", timestamp },
    ).state;

    const second = addDiscoveryPointToState(
      first,
      {
        spaceId,
        title: "失眠里的复盘",
        kind: "question",
        exploreQuestion: "我在夜里反复想保护什么？",
      },
      { id: "topic_2", timestamp: "2026-06-18T13:00:00.000Z" },
    );

    expect(second.state.topics.map((point) => point.title)).toEqual([
      "失眠里的复盘",
      "语言切换像缓冲",
    ]);
    expect(second.point).toMatchObject({
      status: "stored_for_later",
      sourceType: "manual",
    });
  });

  it("updates only the selected discovery point status", () => {
    const withTopics = [
      ["topic_1", "语言切换像缓冲"],
      ["topic_2", "失眠里的复盘"],
    ].reduce(
      (state, [id, title]) =>
        addDiscoveryPointToState(
          state,
          { spaceId, title, kind: "discovery" },
          { id, timestamp },
        ).state,
      createInitialState(),
    );

    const updated = updateDiscoveryPointStatusInState(
      withTopics,
      { id: "topic_1", status: "want_to_understand" },
      "2026-06-18T14:00:00.000Z",
    );

    expect(updated.point?.status).toBe("want_to_understand");
    expect(updated.state.topics.find((point) => point.id === "topic_2")?.status).toBe("stored_for_later");
  });

  it("does not affect derived storage jar summaries", () => {
    const stateWithEpisode: AppState = {
      ...createInitialState(),
      episodes: [
        {
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
          accountImpacts: buildQuickRecordImpacts(
            {
              spaceId,
              spaceType: "interpersonal",
              facts: "对方具体回应了我的勇气",
              connectionEvidence: "对方具体回应了我的勇气",
              nextAction: "record_facts",
              energyEffect: "lighter",
            },
            { sourceId: "episode_1", createdAt: timestamp },
          ),
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ],
    };
    const before = deriveAllAccountSummaries(stateWithEpisode);

    const after = addDiscoveryPointToState(
      stateWithEpisode,
      {
        spaceId,
        title: "完美主义让我停住",
        kind: "discovery",
      },
      { id: "topic_1", timestamp },
    ).state;

    expect(deriveAllAccountSummaries(after)).toEqual(before);
    expect(before[0]?.reason).toBe(accountReasonCopy.observable_connection_evidence);
  });
});
