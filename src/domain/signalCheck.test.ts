import { describe, expect, it } from "vitest";
import { deriveAllAccountSummaries } from "./accounts";
import { createInitialState } from "./defaults";
import { buildSignalCheckDiscoveryPointInput } from "./signalCheck";
import { addDiscoveryPointToState } from "./topics";

const spaceId = "space_1";
const timestamp = "2026-06-19T10:00:00.000Z";

describe("buildSignalCheckDiscoveryPointInput", () => {
  it("builds a non-checking action idea for a 10-minute buffer", () => {
    const input = buildSignalCheckDiscoveryPointInput({
      spaceId,
      target: "cold_connection",
      goodReaction: "want_more",
      absentReaction: "keep_refreshing",
      action: "phone_down_10",
    });

    expect(input).toMatchObject({
      spaceId,
      title: "10 分钟缓冲：把手机扣下 10 分钟",
      kind: "action_idea",
      theme: "action_experiment",
      sourceType: "manual",
      exploreQuestion: "这 10 分钟里，什么动作最能把主动权带回来一点？",
    });
    expect(input.note).toContain("想确认：连接有没有变冷");
    expect(input.note).toContain("这次选择：把手机扣下 10 分钟");
  });

  it("builds a non-shaming discovery point for checking anyway", () => {
    const input = buildSignalCheckDiscoveryPointInput({
      spaceId,
      target: "my_fault",
      goodReaction: "still_unsure",
      absentReaction: "self_blame",
      action: "still_check",
      result: "more_anxious",
    });

    expect(input).toMatchObject({
      title: "想检查信号：我是不是做错了",
      kind: "discovery",
      theme: "old_echo",
      sourceType: "manual",
      exploreQuestion: "我想通过检查把什么交给外面的信号来决定？",
    });
    expect(input.note).toContain("检查后：检查后更不安");
  });

  it("does not affect derived storage jar summaries when saved as a discovery point", () => {
    const state = createInitialState();
    const before = deriveAllAccountSummaries(state);
    const input = buildSignalCheckDiscoveryPointInput({
      spaceId,
      target: "ease_anxiety",
      goodReaction: "relieved",
      absentReaction: "ruminate_sleep",
      action: "five_senses",
    });

    const next = addDiscoveryPointToState(state, input, { id: "topic_1", timestamp }).state;

    expect(next.topics).toHaveLength(1);
    expect(deriveAllAccountSummaries(next)).toEqual(before);
  });
});
