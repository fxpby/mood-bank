import { describe, expect, it } from "vitest";
import { buildQuickRecordImpacts, deriveAllAccountSummaries } from "./accounts";
import { createInitialState } from "./defaults";
import {
  buildSeeingEvidenceDiscoveryPointInput,
  getSeeingEvidenceSummary,
  type SeeingEvidenceInput,
} from "./seeingEvidence";
import { addDiscoveryPointToState } from "./topics";
import type { AppState, Episode } from "./types";

const spaceId = "space_1";
const timestamp = "2026-06-20T10:00:00.000Z";

function input(overrides: Partial<SeeingEvidenceInput> = {}): SeeingEvidenceInput {
  return {
    spaceId,
    focus: "witnessed",
    signal: "specific_words",
    evidenceText: "对方具体回应了我说出的勇气。",
    calibration: "moment_evidence",
    capacity: "limited",
    nextDirection: "receive_it",
    ...overrides,
  };
}

describe("seeing evidence helpers", () => {
  it("builds a seeing evidence summary", () => {
    expect(getSeeingEvidenceSummary(input())).toMatchObject({
      focus: "我的勇气或真实被看见了",
      signal: "对方回应了具体内容",
      evidenceText: "对方具体回应了我说出的勇气。",
      calibration: "这是这一刻的证据，先不用变成未来结论。",
      capacity: "容量有限，只能轻轻回应一点",
      nextDirection: "先收下这份被看见",
    });
  });

  it("builds a manual relationship-learning discovery point", () => {
    const pointInput = buildSeeingEvidenceDiscoveryPointInput(input());

    expect(pointInput).toMatchObject({
      spaceId,
      title: "被看见证据：这一刻有真实接触",
      kind: "discovery",
      theme: "relationship_learning",
      sourceType: "manual",
      sourceTitle: "被看见证据轻检查",
    });
    expect(pointInput.note).toContain("这次被看见的是：我的勇气或真实被看见了");
    expect(pointInput.note).toContain("可观察证据：对方回应了具体内容");
    expect(pointInput.note).toContain("校准：这是这一刻的证据");
  });

  it("can save as a topic when the next direction is later review", () => {
    const pointInput = buildSeeingEvidenceDiscoveryPointInput(
      input({ nextDirection: "later_topic" }),
    );

    expect(pointInput.kind).toBe("topic");
  });

  it("uses non-proof default evidence copy when no text is provided", () => {
    const summary = getSeeingEvidenceSummary(
      input({
        evidenceText: "",
        signal: "repair_attempt",
        calibration: "not_future_proof",
      }),
    );

    expect(summary.evidenceText).toBe("这里有一个靠近、解释、道歉或修复的动作。");
    expect(summary.calibration).toBe("它可以很珍贵，但不能证明以后一定会怎样。");
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
      buildSeeingEvidenceDiscoveryPointInput(input()),
      { id: "topic_1", timestamp },
    ).state;

    expect(deriveAllAccountSummaries(updated)).toEqual(before);
  });
});
