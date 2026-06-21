import { describe, expect, it } from "vitest";
import { deriveAllAccountSummaries } from "./accounts";
import { createInitialState } from "./defaults";
import {
  buildRepairUnderstandingDiscoveryPointInput,
  getRepairUnderstandingSummary,
  type RepairUnderstandingInput,
} from "./repairUnderstanding";
import { addDiscoveryPointToState } from "./topics";

const spaceId = "space_1";
const timestamp = "2026-06-21T12:00:00.000Z";

function input(overrides: Partial<RepairUnderstandingInput> = {}): RepairUnderstandingInput {
  return {
    spaceId,
    wantUnderstood: "care_under_conflict",
    mayNotUnderstand: "my_impact",
    myPart: "own_my_impact",
    nextDirection: "repair_attempt",
    note: "我想修复，但不想把自己全盘否定。",
    ...overrides,
  };
}

describe("repair understanding helpers", () => {
  it("builds a repair understanding summary", () => {
    const summary = getRepairUnderstandingSummary(input());

    expect(summary).toMatchObject({
      wantUnderstood: "我还在乎，但我也受伤/紧张",
      mayNotUnderstand: "我的表达可能给对方造成的影响",
      myPart: "承认我造成的影响",
      nextDirection: "做一次很小的修复尝试",
      note: "我想修复，但不想把自己全盘否定。",
    });
    expect(summary.calibration).toContain("为具体影响负责");
  });

  it("uses non-verdict defaults when optional note is blank", () => {
    const summary = getRepairUnderstandingSummary(
      input({
        note: "   ",
        mayNotUnderstand: "their_intent",
        myPart: "ask_without_pressing",
        nextDirection: "ask_to_understand",
      }),
    );

    expect(summary.note).toContain("对方的本意还需要被慢慢确认");
    expect(summary.note).toContain("不是被我直接判定");
    expect(summary.calibration).toContain("修复不是赢");
  });

  it("builds a manual relationship-learning discovery point", () => {
    const pointInput = buildRepairUnderstandingDiscoveryPointInput(input());

    expect(pointInput).toMatchObject({
      spaceId,
      title: "修复/理解：一次冲突后的看见",
      kind: "discovery",
      theme: "relationship_learning",
      sourceType: "manual",
      sourceTitle: "修复/理解轻检查",
      sourceSnippet: "我想修复，但不想把自己全盘否定。",
    });
    expect(pointInput.note).toContain("我想被理解的是：我还在乎");
    expect(pointInput.note).toContain("我能负责的部分：承认我造成的影响");
  });

  it("can save as a topic when the next direction is later topic", () => {
    const pointInput = buildRepairUnderstandingDiscoveryPointInput(
      input({ nextDirection: "later_topic" }),
    );

    expect(pointInput.kind).toBe("topic");
  });

  it("does not affect storage jar summaries when saved as a discovery point", () => {
    const state = createInitialState();
    const before = deriveAllAccountSummaries(state);

    const updated = addDiscoveryPointToState(
      state,
      buildRepairUnderstandingDiscoveryPointInput(input()),
      { id: "topic_1", timestamp },
    ).state;

    expect(updated.topics).toHaveLength(1);
    expect(deriveAllAccountSummaries(updated)).toEqual(before);
  });
});
