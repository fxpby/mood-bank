import { describe, expect, it } from "vitest";
import { accountReasonCopy } from "../copy/accounts";
import { createInitialState } from "./defaults";
import {
  selectAccountDetail,
  selectAccountSummaries,
  selectEpisodeDetail,
  selectEpisodesNewestFirst,
} from "./selectors";
import type { AccountImpact, Anchor, AppState, Episode } from "./types";

const spaceId = "space_1";
const olderAt = "2026-06-18T08:00:00.000Z";
const newerAt = "2026-06-18T10:00:00.000Z";

function impact(
  id: string,
  overrides: Partial<AccountImpact> = {},
): AccountImpact {
  return {
    id,
    sourceType: "episode",
    sourceId: "episode_1",
    account: "self",
    value: 1,
    reasonCode: "owned_next_action",
    reason: accountReasonCopy.owned_next_action,
    evidence: "delay_10_min",
    createdAt: olderAt,
    ...overrides,
  };
}

function episode(id: string, overrides: Partial<Episode> = {}): Episode {
  return {
    id,
    spaceId,
    source: "quick_record",
    title: "收到一封邮件",
    facts: "对方具体回应了我的勇气",
    interpretation: "",
    emotions: ["warm"],
    bodySensations: [],
    connectionLevel: "not_sure",
    activationLevel: "not_sure",
    nextAction: "delay_10_min",
    accountImpacts: [],
    createdAt: olderAt,
    updatedAt: olderAt,
    ...overrides,
  };
}

function anchor(id: string, overrides: Partial<Anchor> = {}): Anchor {
  return {
    id,
    spaceId,
    text: "我可以先回到事实。",
    sourceType: "episode",
    sourceId: "episode_1",
    createdAt: olderAt,
    updatedAt: olderAt,
    ...overrides,
  };
}

describe("selectAccountDetail", () => {
  it("lists account impacts newest first with readable episode source context", () => {
    const state: AppState = {
      ...createInitialState(),
      episodes: [
        {
          id: "episode_1",
          spaceId,
          source: "quick_record",
          title: "收到一封邮件",
          facts: "对方具体回应了我的勇气",
          interpretation: "",
          emotions: ["warm"],
          bodySensations: [],
          connectionLevel: "not_sure",
          activationLevel: "not_sure",
          nextAction: "delay_10_min",
          accountImpacts: [
            impact("impact_old", { createdAt: olderAt }),
            impact("impact_new", { createdAt: newerAt, evidence: "record_facts" }),
          ],
          createdAt: olderAt,
          updatedAt: olderAt,
        },
      ],
    };

    const detail = selectAccountDetail(state, "self");

    expect(detail.summary.value).toBe(2);
    expect(detail.rows.map((row) => row.impact.id)).toEqual(["impact_new", "impact_old"]);
    expect(detail.rows[0]).toMatchObject({
      sourceLabel: "互动记录",
      sourceTitle: "收到一封邮件",
      sourceContext: "对方具体回应了我的勇气",
      evidence: "记录事实",
    });
  });

  it("maps return-to-self impacts to practice context", () => {
    const state: AppState = {
      ...createInitialState(),
      returnToSelfPractices: [
        {
          id: "practice_1",
          spaceId,
          source: "return_to_self",
          completion: "full",
          anchor: "我可以慢一点回应。",
          accountImpacts: [
            impact("impact_self", {
              sourceType: "return_to_self",
              sourceId: "practice_1",
              reasonCode: "return_to_self_completed",
              reason: accountReasonCopy.return_to_self_completed,
              evidence: "full",
            }),
          ],
          createdAt: newerAt,
          updatedAt: newerAt,
        },
      ],
    };

    const detail = selectAccountDetail(state, "self");

    expect(detail.rows[0]).toMatchObject({
      sourceLabel: "回到自己",
      sourceTitle: "完成了一次回到自己",
      sourceContext: "我可以慢一点回应。",
      evidence: "完成整段回到自己",
    });
  });

  it("keeps user-written evidence readable as original text", () => {
    const state: AppState = {
      ...createInitialState(),
      episodes: [
        {
          id: "episode_1",
          spaceId,
          source: "quick_record",
          title: "收到一封邮件",
          facts: "对方具体回应了我的勇气",
          interpretation: "",
          emotions: ["warm"],
          bodySensations: [],
          connectionLevel: "not_sure",
          activationLevel: "not_sure",
          nextAction: "not_now",
          accountImpacts: [
            impact("impact_connection", {
              account: "connection",
              reasonCode: "observable_connection_evidence",
              reason: accountReasonCopy.observable_connection_evidence,
              evidence: "对方具体回应了我的勇气",
            }),
          ],
          createdAt: olderAt,
          updatedAt: olderAt,
        },
      ],
    };

    const detail = selectAccountDetail(state, "connection");

    expect(detail.rows[0]?.evidence).toBe("对方具体回应了我的勇气");
  });

  it("ignores drafts when building account detail rows", () => {
    const state: AppState = {
      ...createInitialState(),
      drafts: [
        {
          id: "draft_1",
          spaceId,
          kind: "quick_record",
          data: {
            facts: "草稿不应进入明细",
            nextAction: "delay_10_min",
          },
          createdAt: newerAt,
          updatedAt: newerAt,
        },
      ],
    };

    const detail = selectAccountDetail(state, "self");

    expect(detail.summary.value).toBe(0);
    expect(detail.rows).toEqual([]);
  });
});

describe("episode selectors", () => {
  it("lists saved episodes newest first", () => {
    const state: AppState = {
      ...createInitialState(),
      episodes: [
        episode("episode_old", { createdAt: olderAt, updatedAt: olderAt }),
        episode("episode_new", { createdAt: newerAt, updatedAt: newerAt }),
      ],
    };

    expect(selectEpisodesNewestFirst(state).map((item) => item.id)).toEqual([
      "episode_new",
      "episode_old",
    ]);
  });

  it("builds episode detail with localized account rows and linked topics", () => {
    const state: AppState = {
      ...createInitialState(),
      episodes: [
        episode("episode_1", {
          accountImpacts: [
            impact("impact_old", { createdAt: olderAt }),
            impact("impact_new", { createdAt: newerAt, evidence: "record_facts" }),
          ],
        }),
      ],
      topics: [
        {
          id: "topic_old",
          spaceId,
          title: "旧一点的发现",
          kind: "discovery",
          status: "stored_for_later",
          sourceType: "episode",
          sourceId: "episode_1",
          createdAt: olderAt,
          updatedAt: olderAt,
        },
        {
          id: "topic_new",
          spaceId,
          title: "新一点的发现",
          kind: "topic",
          status: "want_to_understand",
          sourceType: "episode",
          sourceId: "episode_1",
          createdAt: newerAt,
          updatedAt: newerAt,
        },
        {
          id: "manual_topic",
          spaceId,
          title: "手动存下",
          kind: "question",
          status: "stored_for_later",
          sourceType: "manual",
          createdAt: newerAt,
          updatedAt: newerAt,
        },
      ],
      anchors: [
        anchor("anchor_old", { text: "旧一点的锚点", createdAt: olderAt, updatedAt: olderAt }),
        anchor("anchor_new", { text: "新一点的锚点", createdAt: newerAt, updatedAt: newerAt }),
        anchor("anchor_other", {
          text: "其他记录的锚点",
          sourceId: "episode_other",
          createdAt: newerAt,
          updatedAt: newerAt,
        }),
        anchor("anchor_return", {
          text: "回到自己的锚点",
          sourceType: "return_to_self",
          sourceId: "practice_1",
          createdAt: newerAt,
          updatedAt: newerAt,
        }),
      ],
    };

    const beforeSummaries = selectAccountSummaries(state);
    const detail = selectEpisodeDetail(state, "episode_1");
    const afterSummaries = selectAccountSummaries(state);

    expect(detail?.episode.id).toBe("episode_1");
    expect(detail?.accountRows.map((row) => row.impact.id)).toEqual(["impact_new", "impact_old"]);
    expect(detail?.accountRows[0]?.evidence).toBe("记录事实");
    expect(detail?.linkedAnchors.map((item) => item.id)).toEqual(["anchor_new", "anchor_old"]);
    expect(detail?.linkedTopics.map((point) => point.id)).toEqual(["topic_new", "topic_old"]);
    expect(afterSummaries).toEqual(beforeSummaries);
  });

  it("returns null for missing episode detail ids", () => {
    const state = createInitialState();

    expect(selectEpisodeDetail(state, null)).toBeNull();
    expect(selectEpisodeDetail(state, "missing")).toBeNull();
  });
});
