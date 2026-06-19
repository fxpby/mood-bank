import { describe, expect, it } from "vitest";
import { deriveAllAccountSummaries } from "./accounts";
import { createInitialState } from "./defaults";
import {
  getNextPersonalActionRotation,
  getPersonalActionSet,
  personalActions,
} from "./personalActions";

describe("getPersonalActionSet", () => {
  it("returns one recommended action and two alternatives", () => {
    const set = getPersonalActionSet({ market: "triggered" });

    expect(set.recommended.category).toBe("lower_activation");
    expect(set.alternatives).toHaveLength(2);
    expect(new Set([set.recommended.id, ...set.alternatives.map((action) => action.id)]).size).toBe(3);
  });

  it("keeps the action set deterministic for the same market and rotation", () => {
    const first = getPersonalActionSet({ market: "sensitive", rotationIndex: 2 });
    const second = getPersonalActionSet({ market: "sensitive", rotationIndex: 2 });

    expect(second).toEqual(first);
  });

  it("rotates to a different recommended action for categories with multiple actions", () => {
    const first = getPersonalActionSet({ market: "steady", rotationIndex: 0 });
    const second = getPersonalActionSet({
      market: "steady",
      rotationIndex: getNextPersonalActionRotation(0),
    });

    expect(first.recommended.id).not.toBe(second.recommended.id);
  });

  it("does not mutate app state or derived storage jars", () => {
    const state = createInitialState();
    const before = deriveAllAccountSummaries(state);

    getPersonalActionSet({ market: "observe" });

    expect(deriveAllAccountSummaries(state)).toEqual(before);
  });

  it("keeps action copy free of pressure framing", () => {
    const forbiddenTerms = [
      ["stre", "ak"].join(""),
      ["re", "ward"].join(""),
      ["连", "续"].join(""),
      ["打", "卡"].join(""),
      ["奖", "励"].join(""),
      ["逾", "期"].join(""),
      ["待", "办"].join(""),
    ];

    for (const action of personalActions) {
      const copy = `${action.label}${action.helper}${action.completionMarker}`;
      for (const term of forbiddenTerms) {
        expect(copy).not.toContain(term);
      }
    }
  });
});
