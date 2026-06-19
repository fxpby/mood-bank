import { describe, expect, it } from "vitest";
import { deriveAllAccountSummaries } from "./accounts";
import { createInitialState } from "./defaults";
import {
  buildRichIncomingDiscoveryPointInputs,
  getActiveRichIncomingThreads,
  getOverflowRichIncomingThreads,
  getRichIncomingSummary,
  type RichIncomingInput,
} from "./richIncoming";
import { addDiscoveryPointToState } from "./topics";

const spaceId = "space_1";
const timestamp = "2026-06-19T12:00:00.000Z";

function input(overrides: Partial<RichIncomingInput> = {}): RichIncomingInput {
  return {
    spaceId,
    messageNote: "对方写了很长一段，具体回应了我的勇气，也解释了自己的混乱。",
    shapes: ["warm", "many_threads"],
    selectedThreads: ["being_seen", "clarification", "values_meaning"],
    emotions: ["warm", "pressure"],
    handlingByThread: {
      being_seen: "received",
      clarification: "needs_response",
      values_meaning: "save_later",
    },
    direction: "respond_one_thread",
    ...overrides,
  };
}

describe("rich incoming helpers", () => {
  it("limits active threads to three and keeps overflow separate", () => {
    const threads = [
      "being_seen",
      "clarification",
      "values_meaning",
      "mutual_care",
      "later_topic",
    ] as const;

    expect(getActiveRichIncomingThreads([...threads])).toEqual([
      "being_seen",
      "clarification",
      "values_meaning",
    ]);
    expect(getOverflowRichIncomingThreads([...threads])).toEqual(["mutual_care", "later_topic"]);
  });

  it("builds a readable completion summary", () => {
    const summary = getRichIncomingSummary(input());

    expect(summary).toMatchObject({
      warmth: "被看见/被理解",
      response: "澄清/解释",
      later: "价值观/意义",
      next: "先回应最重要的一条",
    });
    expect(summary.state).toContain("温暖");
  });

  it("builds discovery points for later and overflow threads", () => {
    const points = buildRichIncomingDiscoveryPointInputs(
      input({
        selectedThreads: ["being_seen", "clarification", "values_meaning", "mutual_care"],
        handlingByThread: {
          being_seen: "received",
          clarification: "needs_response",
          values_meaning: "save_later",
        },
      }),
    );

    expect(points).toHaveLength(2);
    expect(points.map((point) => point.title)).toEqual([
      "长消息线索：价值观/意义",
      "长消息线索：自我照顾/互相照顾",
    ]);
    expect(points[0]).toMatchObject({
      sourceType: "rich_incoming",
      sourceTitle: "收到很多内容",
    });
  });

  it("saving rich incoming discovery points does not affect derived storage jar summaries", () => {
    const state = createInitialState();
    const before = deriveAllAccountSummaries(state);
    const [pointInput] = buildRichIncomingDiscoveryPointInputs(input());
    const next = addDiscoveryPointToState(state, pointInput, {
      id: "topic_1",
      timestamp,
    }).state;

    expect(next.topics).toHaveLength(1);
    expect(deriveAllAccountSummaries(next)).toEqual(before);
  });
});
