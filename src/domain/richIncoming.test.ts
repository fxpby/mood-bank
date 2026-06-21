import { describe, expect, it } from "vitest";
import { deriveAllAccountSummaries } from "./accounts";
import { createInitialState } from "./defaults";
import {
  buildRichIncomingDiscoveryPointInputs,
  getRichIncomingAnchorSuggestion,
  getActiveRichIncomingThreads,
  getOverflowRichIncomingThreads,
  getRichIncomingSummary,
  type RichIncomingInput,
} from "./richIncoming";
import { addAnchorToState } from "./anchors";
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

  it("suggests a support anchor from the selected rich incoming state", () => {
    expect(getRichIncomingAnchorSuggestion(input())).toBe(
      "我可以先收下被看见的部分，不急着一次回应全部。",
    );

    expect(
      getRichIncomingAnchorSuggestion(
        input({
          selectedThreads: ["rumination_sleep"],
          emotions: ["ruminate_sleep"],
          direction: "save_without_reply",
        }),
      ),
    ).toBe("这段内容可以明天再看，今晚先让身体停下来。");

    expect(
      getRichIncomingAnchorSuggestion(
        input({
          selectedThreads: ["clarification"],
          emotions: ["pressure"],
          direction: "return_to_self",
        }),
      ),
    ).toBe("我可以先回到自己，再决定要不要回应。");
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

  it("saving a rich incoming support anchor does not affect derived storage jar summaries", () => {
    const state = createInitialState();
    const before = deriveAllAccountSummaries(state);
    const next = addAnchorToState(
      state,
      {
        spaceId,
        text: getRichIncomingAnchorSuggestion(input()),
      },
      {
        id: "anchor_1",
        timestamp,
      },
    ).state;

    expect(next.anchors).toHaveLength(1);
    expect(next.anchors[0]).toMatchObject({
      text: "我可以先收下被看见的部分，不急着一次回应全部。",
      sourceType: undefined,
      sourceId: undefined,
    });
    expect(deriveAllAccountSummaries(next)).toEqual(before);
  });
});
