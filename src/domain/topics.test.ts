import { describe, expect, it } from "vitest";
import { accountReasonCopy } from "../copy/accounts";
import { buildQuickRecordImpacts, deriveAllAccountSummaries } from "./accounts";
import { createInitialState } from "./defaults";
import {
  addDiscoveryPointToState,
  addDiscoveryPointsToState,
  buildDiscoveryPoint,
  deleteDiscoveryPointFromState,
  filterDiscoveryPoints,
  matchesTopicFilters,
  updateDiscoveryPointInState,
  updateDiscoveryPointNoteInState,
  updateDiscoveryPointStatusInState,
} from "./topics";
import type { AppState, DiscoveryPoint, Episode } from "./types";

const timestamp = "2026-06-18T12:00:00.000Z";
const spaceId = "space_1";

describe("discovery point state helpers", () => {
  it("builds source-linked discovery points without mutating state", () => {
    const point = buildDiscoveryPoint(
      {
        spaceId,
        title: "一次互动里的稍后话题",
        kind: "topic",
        sourceType: "episode",
        sourceId: "episode_1",
        sourceTitle: "一次互动",
        sourceSnippet: "对方具体回应了我的勇气",
        note: "来自这次选择：保存一个话题。",
      },
      { id: "topic_1", timestamp },
    );

    expect(point).toMatchObject({
      id: "topic_1",
      kind: "topic",
      status: "stored_for_later",
      sourceType: "episode",
      sourceId: "episode_1",
      sourceTitle: "一次互动",
    });
  });

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

  it("adds multiple discovery points in one state transition", () => {
    const state = addDiscoveryPointToState(
      createInitialState(),
      { spaceId, title: "已经存在的点", kind: "discovery" },
      { id: "topic_existing", timestamp },
    ).state;

    const result = addDiscoveryPointsToState(
      state,
      [
        { spaceId, title: "价值观线索", kind: "discovery", sourceType: "rich_incoming" },
        { spaceId, title: "稍后话题", kind: "topic", sourceType: "rich_incoming" },
      ],
      {
        ids: ["topic_new_1", "topic_new_2"],
        timestamp: "2026-06-18T13:00:00.000Z",
      },
    );

    expect(result.points.map((point) => point.id)).toEqual(["topic_new_1", "topic_new_2"]);
    expect(result.state.topics.map((point) => point.title)).toEqual([
      "价值观线索",
      "稍后话题",
      "已经存在的点",
    ]);
    expect(result.state.topics.every((point) => point.status === "stored_for_later")).toBe(true);
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

  it("status review updates do not affect derived storage jar summaries", () => {
    const stateWithTopic = addDiscoveryPointToState(
      createInitialState(),
      {
        spaceId,
        title: "语言切换像缓冲",
        kind: "discovery",
        sourceType: "trigger",
      },
      { id: "topic_1", timestamp },
    ).state;
    const before = deriveAllAccountSummaries(stateWithTopic);

    const updated = updateDiscoveryPointStatusInState(
      stateWithTopic,
      { id: "topic_1", status: "reviewed" },
      "2026-06-18T14:00:00.000Z",
    );

    expect(updated.point?.status).toBe("reviewed");
    expect(deriveAllAccountSummaries(updated.state)).toEqual(before);
  });

  it("updates only the selected discovery point note", () => {
    const withTopics = [
      ["topic_1", "语言切换像缓冲"],
      ["topic_2", "失眠里的复盘"],
    ].reduce(
      (state, [id, title]) =>
        addDiscoveryPointToState(
          state,
          { spaceId, title, kind: "discovery", note: `${title}的旧备注` },
          { id, timestamp },
        ).state,
      createInitialState(),
    );

    const updated = updateDiscoveryPointNoteInState(
      withTopics,
      { id: "topic_1", note: "回看时发现它也在保护节奏。" },
      "2026-06-18T14:00:00.000Z",
    );

    expect(updated.point).toMatchObject({
      id: "topic_1",
      note: "回看时发现它也在保护节奏。",
      updatedAt: "2026-06-18T14:00:00.000Z",
    });
    expect(updated.state.topics.find((point) => point.id === "topic_2")?.note).toBe(
      "失眠里的复盘的旧备注",
    );
  });

  it("clears a discovery point note with blank review input", () => {
    const withTopic = addDiscoveryPointToState(
      createInitialState(),
      {
        spaceId,
        title: "语言切换像缓冲",
        kind: "discovery",
        note: "旧备注",
      },
      { id: "topic_1", timestamp },
    ).state;

    const updated = updateDiscoveryPointNoteInState(
      withTopic,
      { id: "topic_1", note: "   " },
      "2026-06-18T14:00:00.000Z",
    );

    expect(updated.point?.note).toBeUndefined();
  });

  it("note review updates do not affect derived storage jar summaries", () => {
    const stateWithTopic = addDiscoveryPointToState(
      createInitialState(),
      {
        spaceId,
        title: "语言切换像缓冲",
        kind: "discovery",
        sourceType: "trigger",
        note: "旧备注",
      },
      { id: "topic_1", timestamp },
    ).state;
    const before = deriveAllAccountSummaries(stateWithTopic);

    const updated = updateDiscoveryPointNoteInState(
      stateWithTopic,
      { id: "topic_1", note: "新的看见" },
      "2026-06-18T14:00:00.000Z",
    );

    expect(updated.point?.note).toBe("新的看见");
    expect(deriveAllAccountSummaries(updated.state)).toEqual(before);
  });

  it("updates only editable discovery point fields while preserving source and status", () => {
    const withTopics = [
      buildDiscoveryPoint(
        {
          spaceId,
          title: "语言切换像缓冲",
          kind: "discovery",
          sourceType: "episode",
          sourceId: "episode_1",
          sourceTitle: "一次互动",
          sourceSnippet: "英文像一层缓冲",
          theme: "emotion",
          note: "旧备注",
          exploreQuestion: "旧问题",
        },
        { id: "topic_1", timestamp },
      ),
      buildDiscoveryPoint(
        {
          spaceId,
          title: "失眠里的复盘",
          kind: "question",
          sourceType: "manual",
          theme: "old_echo",
          note: "保持不变",
        },
        { id: "topic_2", timestamp },
      ),
    ].reduce<AppState>(
      (state, point) => ({
        ...state,
        topics: [...state.topics, point],
      }),
      createInitialState(),
    );
    const reviewed = updateDiscoveryPointStatusInState(
      withTopics,
      { id: "topic_1", status: "want_to_understand" },
      "2026-06-18T13:00:00.000Z",
    ).state;

    const updated = updateDiscoveryPointInState(
      reviewed,
      {
        id: "topic_1",
        title: "  语言切换保护了节奏  ",
        kind: "topic",
        theme: "relationship_learning",
        note: "  新备注  ",
        exploreQuestion: "  我在保护什么？  ",
      },
      "2026-06-18T14:00:00.000Z",
    );

    expect(updated.point).toMatchObject({
      id: "topic_1",
      title: "语言切换保护了节奏",
      kind: "topic",
      status: "want_to_understand",
      sourceType: "episode",
      sourceId: "episode_1",
      sourceTitle: "一次互动",
      sourceSnippet: "英文像一层缓冲",
      theme: "relationship_learning",
      note: "新备注",
      exploreQuestion: "我在保护什么？",
      createdAt: timestamp,
      updatedAt: "2026-06-18T14:00:00.000Z",
    });
    expect(updated.state.topics.find((point) => point.id === "topic_2")?.note).toBe("保持不变");
  });

  it("cleans blank discovery point edit fields and falls back blank title", () => {
    const withTopic = addDiscoveryPointToState(
      createInitialState(),
      {
        spaceId,
        title: "语言切换像缓冲",
        kind: "discovery",
        theme: "emotion",
        note: "旧备注",
        exploreQuestion: "旧问题",
      },
      { id: "topic_1", timestamp },
    ).state;

    const updated = updateDiscoveryPointInState(
      withTopic,
      {
        id: "topic_1",
        title: "   ",
        kind: "action_idea",
        theme: undefined,
        note: "   ",
        exploreQuestion: "",
      },
      "2026-06-18T14:00:00.000Z",
    );

    expect(updated.point).toMatchObject({
      title: "一个稍后再看的点",
      kind: "action_idea",
      updatedAt: "2026-06-18T14:00:00.000Z",
    });
    expect(updated.point?.theme).toBeUndefined();
    expect(updated.point?.note).toBeUndefined();
    expect(updated.point?.exploreQuestion).toBeUndefined();
  });

  it("discovery point edits do not affect derived storage jar summaries", () => {
    const stateWithTopic = addDiscoveryPointToState(
      createInitialState(),
      {
        spaceId,
        title: "语言切换像缓冲",
        kind: "discovery",
        sourceType: "trigger",
        note: "旧备注",
      },
      { id: "topic_1", timestamp },
    ).state;
    const before = deriveAllAccountSummaries(stateWithTopic);

    const updated = updateDiscoveryPointInState(
      stateWithTopic,
      {
        id: "topic_1",
        title: "语言切换保护了节奏",
        kind: "topic",
        theme: "relationship_learning",
        note: "新的看见",
      },
      "2026-06-18T14:00:00.000Z",
    );

    expect(updated.point?.title).toBe("语言切换保护了节奏");
    expect(deriveAllAccountSummaries(updated.state)).toEqual(before);
  });

  it("returns no-op success shape for missing discovery point edits", () => {
    const state = addDiscoveryPointToState(
      createInitialState(),
      { spaceId, title: "语言切换像缓冲", kind: "discovery" },
      { id: "topic_1", timestamp },
    ).state;

    const updated = updateDiscoveryPointInState(
      state,
      { id: "missing", title: "不存在", kind: "topic" },
      "2026-06-18T14:00:00.000Z",
    );

    expect(updated.point).toBeUndefined();
    expect(updated.state).toEqual(state);
  });

  it("deletes only the selected discovery point", () => {
    const state = [
      ["topic_1", "语言切换像缓冲"],
      ["topic_2", "失眠里的复盘"],
    ].reduce(
      (current, [id, title]) =>
        addDiscoveryPointToState(
          current,
          { spaceId, title, kind: "discovery" },
          { id, timestamp },
        ).state,
      createInitialState(),
    );

    const deleted = deleteDiscoveryPointFromState(state, { id: "topic_1" });

    expect(deleted.point?.id).toBe("topic_1");
    expect(deleted.state.topics.map((point) => point.id)).toEqual(["topic_2"]);
  });

  it("deleting a discovery point leaves source records, experiments, and summaries untouched", () => {
    const accountImpacts = buildQuickRecordImpacts(
      {
        spaceId,
        spaceType: "interpersonal",
        facts: "对方具体回应了我的勇气",
        connectionEvidence: "对方具体回应了我的勇气",
        nextAction: "record_facts",
        energyEffect: "lighter",
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
    const point = buildDiscoveryPoint(
      {
        spaceId,
        title: "温暖证据",
        kind: "discovery",
        sourceType: "episode",
        sourceId: episode.id,
        sourceTitle: episode.title,
        sourceSnippet: episode.facts,
      },
      { id: "topic_1", timestamp },
    );
    const state: AppState = {
      ...createInitialState(),
      episodes: [episode],
      topics: [point],
      experiments: [
        {
          id: "experiment_1",
          spaceId,
          focus: "练习慢一点回应",
          tinyAction: "只回应一个重点",
          completionMarker: "写完后停三次呼吸",
          status: "active",
          source: "discovery_point",
          sourceActionId: point.id,
          attempts: [],
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ],
    };
    const before = deriveAllAccountSummaries(state);

    const deleted = deleteDiscoveryPointFromState(state, { id: point.id });

    expect(deleted.state.topics).toEqual([]);
    expect(deleted.state.episodes).toEqual([episode]);
    expect(deleted.state.experiments).toEqual(state.experiments);
    expect(deriveAllAccountSummaries(deleted.state)).toEqual(before);
  });

  it("returns unchanged state when deleting a missing discovery point", () => {
    const state = addDiscoveryPointToState(
      createInitialState(),
      { spaceId, title: "语言切换像缓冲", kind: "discovery" },
      { id: "topic_1", timestamp },
    ).state;

    const deleted = deleteDiscoveryPointFromState(state, { id: "missing" });

    expect(deleted.point).toBeUndefined();
    expect(deleted.state).toBe(state);
  });

  it("does not affect derived storage jar summaries", () => {
    const accountImpacts = buildQuickRecordImpacts(
      {
        spaceId,
        spaceType: "interpersonal",
        facts: "对方具体回应了我的勇气",
        connectionEvidence: "对方具体回应了我的勇气",
        nextAction: "record_facts",
        energyEffect: "lighter",
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
    const stateWithEpisode: AppState = {
      ...createInitialState(),
      episodes: [episode],
    };
    const before = deriveAllAccountSummaries(stateWithEpisode);

    const linkedPoint = buildDiscoveryPoint(
      {
        spaceId,
        title: "完美主义让我停住",
        kind: "topic",
        sourceType: "episode",
        sourceId: episode.id,
        sourceTitle: episode.title,
        sourceSnippet: episode.facts,
      },
      { id: "topic_1", timestamp },
    );
    const after: AppState = {
      ...stateWithEpisode,
      topics: [linkedPoint, ...stateWithEpisode.topics],
    };

    expect(deriveAllAccountSummaries(after)).toEqual(before);
    expect(before[0]?.reason).toBe(accountReasonCopy.observable_connection_evidence);
  });
});

describe("topic filters", () => {
  function point(id: string, overrides: Partial<DiscoveryPoint> = {}): DiscoveryPoint {
    return {
      id,
      spaceId,
      title: `发现点 ${id}`,
      kind: "discovery",
      status: "stored_for_later",
      sourceType: "manual",
      createdAt: timestamp,
      updatedAt: timestamp,
      ...overrides,
    };
  }

  it("matches all filters by default", () => {
    expect(
      matchesTopicFilters(point("topic_1"), {
        kind: "all",
        status: "all",
        theme: "all",
        source: "all",
      }),
    ).toBe(true);
  });

  it("combines kind, status, theme, and source with AND semantics", () => {
    const points = [
      point("topic_1", {
        kind: "topic",
        status: "want_to_understand",
        theme: "relationship_learning",
        sourceType: "episode",
      }),
      point("topic_2", {
        kind: "topic",
        status: "want_to_understand",
        theme: "emotion",
        sourceType: "episode",
      }),
      point("topic_3", {
        kind: "question",
        status: "want_to_understand",
        theme: "relationship_learning",
        sourceType: "episode",
      }),
      point("topic_4", {
        kind: "topic",
        status: "reviewed",
        theme: "relationship_learning",
        sourceType: "episode",
      }),
      point("topic_5", {
        kind: "topic",
        status: "want_to_understand",
        theme: "relationship_learning",
        sourceType: "manual",
      }),
    ];

    expect(
      filterDiscoveryPoints(points, {
        kind: "topic",
        status: "want_to_understand",
        theme: "relationship_learning",
        source: "episode",
      }).map((item) => item.id),
    ).toEqual(["topic_1"]);
  });

  it("treats naturally reached as reviewed in the status filter", () => {
    const points = [
      point("reviewed", { status: "reviewed" }),
      point("naturally_reached", { status: "naturally_reached" }),
      point("stored", { status: "stored_for_later" }),
    ];

    expect(
      filterDiscoveryPoints(points, {
        kind: "all",
        status: "reviewed",
        theme: "all",
        source: "all",
      }).map((item) => item.id),
    ).toEqual(["reviewed", "naturally_reached"]);
  });
});
