import { describe, expect, it } from "vitest";
import { deriveAllAccountSummaries } from "./accounts";
import { addAnchorToState, buildAnchor } from "./anchors";
import { createInitialState } from "./defaults";

const timestamp = "2026-06-19T09:00:00.000Z";
const spaceId = "space_1";

describe("anchor state helpers", () => {
  it("builds a trimmed anchor", () => {
    const anchor = buildAnchor(
      {
        spaceId,
        text: "  我可以先回到自己。  ",
      },
      { id: "anchor_1", timestamp },
    );

    expect(anchor).toMatchObject({
      id: "anchor_1",
      spaceId,
      text: "我可以先回到自己。",
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  });

  it("does not build a blank anchor", () => {
    const anchor = buildAnchor({ spaceId, text: "   " }, { id: "anchor_1", timestamp });

    expect(anchor).toBeUndefined();
  });

  it("adds anchors newest first", () => {
    const first = addAnchorToState(
      createInitialState(),
      { spaceId, text: "事实可以很小，结论可以慢一点。" },
      { id: "anchor_1", timestamp },
    ).state;

    const second = addAnchorToState(
      first,
      { spaceId, text: "我先回到自己，再决定下一步。" },
      { id: "anchor_2", timestamp: "2026-06-19T10:00:00.000Z" },
    );

    expect(second.state.anchors.map((anchor) => anchor.text)).toEqual([
      "我先回到自己，再决定下一步。",
      "事实可以很小，结论可以慢一点。",
    ]);
  });

  it("does not affect derived storage jar summaries", () => {
    const state = createInitialState();
    const before = deriveAllAccountSummaries(state);

    const next = addAnchorToState(
      state,
      { spaceId, text: "这只是一个锚点，不是账户证据。" },
      { id: "anchor_1", timestamp },
    ).state;

    expect(deriveAllAccountSummaries(next)).toEqual(before);
  });
});
