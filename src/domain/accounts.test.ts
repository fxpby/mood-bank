import { describe, expect, it } from "vitest";
import { accountReasonCopy } from "../copy/accounts";
import { createInitialState } from "./defaults";
import {
  buildQuickRecordImpacts,
  buildReturnToSelfImpacts,
  buildTriggerCompletionImpacts,
  deriveAllAccountSummaries,
} from "./accounts";
import type { AccountImpact, AppState, QuickRecordInput } from "./types";

const createdAt = "2026-06-18T10:00:00.000Z";
const spaceId = "space_1";

function buildQuickRecord(input: Partial<QuickRecordInput> = {}) {
  return buildQuickRecordImpacts(
    {
      spaceId,
      spaceType: "interpersonal",
      facts: "对方具体回应了我的勇气",
      nextAction: "delay_10_min",
      energyEffect: "same",
      ...input,
    },
    { sourceId: "episode_1", createdAt },
  );
}

function codes(impacts: AccountImpact[]) {
  return impacts.map((impact) => [impact.account, impact.reasonCode, impact.value]);
}

describe("buildQuickRecordImpacts", () => {
  it("creates Connection and Self for observable warm contact with an owned action", () => {
    const impacts = buildQuickRecord({
      connectionEvidence: "对方具体回应了我的勇气",
      nextAction: "delay_10_min",
      energyEffect: "same",
    });

    expect(codes(impacts)).toEqual([
      ["connection", "observable_connection_evidence", 1],
      ["self", "owned_next_action", 1],
    ]);
  });

  it("creates fact split Self impact only when no owned next action exists", () => {
    const impacts = buildQuickRecord({
      facts: "我看到一封邮件",
      interpretation: "我猜这可能是善意",
      nextAction: "not_now",
      energyEffect: "not_sure",
    });

    expect(codes(impacts)).toEqual([["self", "fact_interpretation_split", 1]]);
  });

  it("prefers owned_next_action over fact_interpretation_split for one Self impact", () => {
    const impacts = buildQuickRecord({
      facts: "我看到一封邮件",
      interpretation: "我猜这可能是善意",
      nextAction: "delay_10_min",
    });

    expect(codes(impacts)).toEqual([["self", "owned_next_action", 1]]);
  });

  it("creates self-contact Connection impact in a self-facing space", () => {
    const impacts = buildQuickRecord({
      spaceType: "self",
      selfContactEvidence: "我看见自己其实很害怕",
      connectionEvidence: "不应使用这条人际证据",
      nextAction: "record_facts",
    });

    expect(codes(impacts)).toEqual([
      ["connection", "self_contact_evidence", 1],
      ["self", "owned_next_action", 1],
    ]);
  });

  it("does not create Connection impact from hope or fantasy without evidence", () => {
    const impacts = buildQuickRecord({
      facts: "我希望这代表关系变好了",
      connectionEvidence: "",
      nextAction: "not_now",
      energyEffect: "not_sure",
    });

    expect(codes(impacts)).toEqual([]);
  });

  it("creates Energy depletion only when explicitly marked heavier", () => {
    const impacts = buildQuickRecord({
      nextAction: "no_extra_message",
      energyEffect: "more_tired",
    });

    expect(codes(impacts)).toEqual([
      ["self", "owned_next_action", 1],
      ["energy", "energy_depleted", -1],
    ]);
  });

  it("creates Energy restoration only when explicitly marked lighter", () => {
    const impacts = buildQuickRecord({
      nextAction: "record_facts",
      energyEffect: "lighter",
    });

    expect(codes(impacts)).toEqual([
      ["self", "owned_next_action", 1],
      ["energy", "energy_restored", 1],
    ]);
  });

  it("uses deterministic reason copy for every persisted impact", () => {
    const impacts = buildQuickRecord({
      connectionEvidence: "对方具体回应了我的勇气",
      nextAction: "delay_10_min",
      energyEffect: "lighter",
    });

    for (const impact of impacts) {
      expect(impact.reason).toBe(accountReasonCopy[impact.reasonCode]);
      expect(impact.id).toContain(impact.reasonCode);
    }
  });
});

describe("buildTriggerCompletionImpacts", () => {
  it("creates Self impact for completed trigger with owned action and no quick record", () => {
    const impacts = buildTriggerCompletionImpacts(
      { completed: true, nextAction: "delay_10_min", savedAsQuickRecord: false },
      { sourceId: "trigger_1", createdAt },
    );

    expect(codes(impacts)).toEqual([["self", "trigger_owned_action", 1]]);
  });

  it("does not double count when trigger is saved as quick record", () => {
    const impacts = buildTriggerCompletionImpacts(
      { completed: true, nextAction: "delay_10_min", savedAsQuickRecord: true },
      { sourceId: "trigger_1", createdAt },
    );

    expect(impacts).toEqual([]);
  });

  it.each(["closed", "placeholder", "not_saved", "skipped"] as const)(
    "creates no impact for %s trigger completion",
    (reason) => {
      expect(
        buildTriggerCompletionImpacts(
          { reason, completed: true, nextAction: "delay_10_min" },
          { sourceId: "trigger_1", createdAt },
        ),
      ).toEqual([]);
    },
  );

  it.each(["not_now", "not_sure", undefined] as const)(
    "creates no impact for non-owned trigger action %s",
    (nextAction) => {
      expect(
        buildTriggerCompletionImpacts(
          { completed: true, nextAction },
          { sourceId: "trigger_1", createdAt },
        ),
      ).toEqual([]);
    },
  );

  it("creates no impact for unfinished trigger completion", () => {
    expect(
      buildTriggerCompletionImpacts(
        { completed: false, nextAction: "delay_10_min" },
        { sourceId: "trigger_1", createdAt },
      ),
    ).toEqual([]);
  });
});

describe("buildReturnToSelfImpacts", () => {
  it("creates Self and Energy for full return-to-self with lighter effect", () => {
    const impacts = buildReturnToSelfImpacts(
      { spaceId, completion: "full", energyEffect: "lighter" },
      { sourceId: "practice_1", createdAt },
    );

    expect(codes(impacts)).toEqual([
      ["self", "return_to_self_completed", 1],
      ["energy", "energy_restored", 1],
    ]);
  });

  it("creates partial pause Self impact without Energy by default", () => {
    const impacts = buildReturnToSelfImpacts(
      { spaceId, completion: "noticed_need" },
      { sourceId: "practice_1", createdAt },
    );

    expect(codes(impacts)).toEqual([["self", "return_to_self_partial_pause", 1]]);
  });

  it("creates body-only partial Self impact and explicit Energy depletion", () => {
    const impacts = buildReturnToSelfImpacts(
      { spaceId, completion: "body_only", energyEffect: "more_tired" },
      { sourceId: "practice_1", createdAt },
    );

    expect(codes(impacts)).toEqual([
      ["self", "return_to_self_partial_pause", 1],
      ["energy", "energy_depleted", -1],
    ]);
  });

  it("creates no impact when return-to-self is closed early", () => {
    const impacts = buildReturnToSelfImpacts(
      { spaceId, completion: "closed_early", energyEffect: "lighter" },
      { sourceId: "practice_1", createdAt },
    );

    expect(codes(impacts)).toEqual([]);
  });

  it("never creates Connection impact for return-to-self", () => {
    const impacts = buildReturnToSelfImpacts(
      { spaceId, completion: "full", energyEffect: "lighter" },
      { sourceId: "practice_1", createdAt },
    );

    expect(impacts.some((impact) => impact.account === "connection")).toBe(false);
  });
});

describe("deriveAllAccountSummaries", () => {
  it("derives account summaries from source-owned impacts and does not require stored balances", () => {
    const state: AppState = {
      ...createInitialState(),
      episodes: [
        {
          id: "episode_1",
          spaceId,
          source: "quick_record",
          title: "一次互动",
          facts: "事实",
          interpretation: "",
          emotions: [],
          bodySensations: [],
          connectionLevel: "not_sure",
          activationLevel: "not_sure",
          nextAction: "delay_10_min",
          accountImpacts: buildQuickRecord({
            connectionEvidence: "对方具体回应了我的勇气",
            energyEffect: "lighter",
          }),
          createdAt,
          updatedAt: createdAt,
        },
      ],
    };

    const summaries = deriveAllAccountSummaries(state);

    expect(summaries.map((summary) => [summary.account, summary.value])).toEqual([
      ["connection", 1],
      ["self", 1],
      ["energy", 1],
    ]);
    expect(summaries[0]?.reason).toBe(accountReasonCopy.observable_connection_evidence);
  });
});
