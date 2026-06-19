import { describe, expect, it } from "vitest";
import { buildQuickRecordImpacts, deriveAllAccountSummaries } from "./accounts";
import { createInitialState } from "./defaults";
import {
  buildDraftCheckDiscoveryPointInput,
  buildDraftCheckDraftInput,
  buildDraftCheckPrivateRecordInput,
  getDraftCheckRecommendation,
  type DraftCheckSaveInput,
} from "./draftCheck";
import { addDiscoveryPointToState } from "./topics";

const spaceId = "space_1";
const timestamp = "2026-06-19T12:00:00.000Z";

function input(overrides: Partial<DraftCheckSaveInput> = {}): DraftCheckSaveInput {
  return {
    spaceId,
    spaceType: "interpersonal",
    draftText: "我想认真表达我的感受，也说明我需要一点时间。",
    state: "present",
    motivation: "express_feeling",
    noResponseTolerance: "hard_but_wait",
    contentRisk: "low_risk",
    stance: "creator",
    afterSend: "return_to_life",
    ...overrides,
  };
}

describe("getDraftCheckRecommendation", () => {
  it("returns ready enough for low-pressure empowered drafts", () => {
    const result = getDraftCheckRecommendation(input());

    expect(result).toMatchObject({
      recommendation: "ready_enough",
    });
    expect(result.reason).toContain("动机清楚");
  });

  it("prioritizes return to self when overload is high", () => {
    const result = getDraftCheckRecommendation(input({ state: "body_overload" }));

    expect(result.recommendation).toBe("return_to_self_first");
  });

  it("recommends private record for old echo or self-proving", () => {
    const result = getDraftCheckRecommendation(input({ motivation: "prove_self" }));

    expect(result.recommendation).toBe("private_record_first");
  });

  it("recommends boundary expression for unclear limits", () => {
    const result = getDraftCheckRecommendation(input({ contentRisk: "unclear_boundary" }));

    expect(result.recommendation).toBe("boundary_expression");
  });

  it("recommends saving as draft when checking urge is high", () => {
    const result = getDraftCheckRecommendation(input({ noResponseTolerance: "check_repeatedly" }));

    expect(result.recommendation).toBe("save_as_draft");
  });

  it("recommends lightening for high-risk wording", () => {
    const result = getDraftCheckRecommendation(input({ contentRisk: "too_many_topics" }));

    expect(result.recommendation).toBe("lighten_it");
  });
});

describe("draft check save payload builders", () => {
  it("builds a draft-check discovery point", () => {
    const pointInput = buildDraftCheckDiscoveryPointInput(input(), "ready_enough");

    expect(pointInput).toMatchObject({
      title: "草稿自检：可以发：足够真实，也足够低压",
      kind: "discovery",
      theme: "action_experiment",
      sourceType: "draft_check",
      sourceTitle: "草稿自检",
    });
    expect(pointInput.note).toContain("当前状态：基本在当下");
  });

  it("builds a local quick-record draft payload", () => {
    const draftInput = buildDraftCheckDraftInput(input({ draftText: "  先存下来  " }));

    expect(draftInput).toMatchObject({
      spaceId,
      kind: "quick_record",
      data: {
        title: "草稿自检保存的草稿",
        facts: "先存下来",
        nextAction: "save_draft_do_not_send",
      },
    });
  });

  it("builds an explicit private record payload", () => {
    const recordInput = buildDraftCheckPrivateRecordInput(input());

    expect(recordInput).toMatchObject({
      spaceId,
      spaceType: "interpersonal",
      title: "草稿自检后的私下记录",
      nextAction: "not_now",
    });
  });

  it("private record conversion does not create account impacts by default", () => {
    const recordInput = buildDraftCheckPrivateRecordInput(input());
    const impacts = buildQuickRecordImpacts(recordInput, {
      sourceId: "episode_1",
      createdAt: timestamp,
    });

    expect(impacts).toEqual([]);
  });

  it("saving a discovery point does not affect derived storage jar summaries", () => {
    const state = createInitialState();
    const before = deriveAllAccountSummaries(state);
    const pointInput = buildDraftCheckDiscoveryPointInput(input(), "ready_enough");
    const next = addDiscoveryPointToState(state, pointInput, { id: "topic_1", timestamp }).state;

    expect(next.topics).toHaveLength(1);
    expect(deriveAllAccountSummaries(next)).toEqual(before);
  });
});
