import { describe, expect, it } from "vitest";
import { accountReasonCopy } from "../copy/accounts";
import { createInitialState } from "./defaults";
import { selectAccountDetail } from "./selectors";
import type { AccountImpact, AppState } from "./types";

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
      evidence: "record_facts",
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
    });
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
