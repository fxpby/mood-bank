import { describe, expect, it } from "vitest";
import { buildQuickRecordImpacts, deriveAllAccountSummaries } from "./accounts";
import {
  buildConnectionContinuityDiscoveryPointInput,
  getConnectionContinuitySummary,
  type ConnectionContinuityInput,
} from "./connectionContinuity";
import { createInitialState } from "./defaults";
import { addDiscoveryPointToState } from "./topics";
import type { AppState, Episode } from "./types";

const spaceId = "space_1";
const timestamp = "2026-06-20T10:00:00.000Z";

function input(overrides: Partial<ConnectionContinuityInput> = {}): ConnectionContinuityInput {
  return {
    spaceId,
    state: "urge_confirm",
    existedEvidence: "昨天我们有一次具体、温和的回应。",
    cannotProve: "现在没看到新信号，不能证明连接已经消失。",
    action: "delay_ten",
    ...overrides,
  };
}

describe("connection continuity helpers", () => {
  it("builds a connection continuity summary", () => {
    const summary = getConnectionContinuitySummary(input());

    expect(summary).toMatchObject({
      state: "我想马上确认它还在",
      existedEvidence: "昨天我们有一次具体、温和的回应。",
      cannotProve: "现在没看到新信号，不能证明连接已经消失。",
      action: "延迟 10 分钟再决定",
    });
    expect(summary.calibration).toContain("感觉像消失，不等于事实已经消失");
  });

  it("builds a manual relationship-learning discovery point", () => {
    const pointInput = buildConnectionContinuityDiscoveryPointInput(input());

    expect(pointInput).toMatchObject({
      spaceId,
      title: "连接感：事实和感觉先分开",
      kind: "discovery",
      theme: "relationship_learning",
      sourceType: "manual",
      sourceTitle: "连接感轻检查",
    });
    expect(pointInput.note).toContain("此刻连接感：我想马上确认它还在");
    expect(pointInput.note).toContain("现在还不能证明：现在没看到新信号");
  });

  it("can save as a topic when the next action is later review", () => {
    const pointInput = buildConnectionContinuityDiscoveryPointInput(
      input({ action: "save_later_topic" }),
    );

    expect(pointInput.kind).toBe("topic");
  });

  it("uses non-diagnostic push-pull defaults", () => {
    const summary = getConnectionContinuitySummary(
      input({
        state: "push_pull",
        existedEvidence: "",
        cannotProve: "",
        action: "return_to_self",
      }),
    );

    expect(summary.cannotProve).toContain("不能证明我矛盾失败");
    expect(summary.calibration).toContain("不是人格或关系判决");
  });

  it("does not affect storage jar summaries when saved as a discovery point", () => {
    const accountImpacts = buildQuickRecordImpacts(
      {
        spaceId,
        spaceType: "interpersonal",
        facts: "一次真实接触",
        connectionEvidence: "对方回应了具体内容",
        nextAction: "record_facts",
      },
      { sourceId: "episode_1", createdAt: timestamp },
    );
    const episode: Episode = {
      id: "episode_1",
      spaceId,
      source: "quick_record",
      title: "一次真实接触",
      facts: "一次真实接触",
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
      buildConnectionContinuityDiscoveryPointInput(input()),
      { id: "topic_1", timestamp },
    ).state;

    expect(deriveAllAccountSummaries(updated)).toEqual(before);
  });
});
