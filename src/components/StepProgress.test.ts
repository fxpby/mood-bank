import { describe, expect, it } from "vitest";
import { parseStepProgress } from "./StepProgress";

describe("parseStepProgress", () => {
  it("parses numbered step labels with flexible spacing", () => {
    expect(parseStepProgress(" 2 / 4  回到自己 ")).toEqual({
      current: 2,
      total: 4,
      label: "回到自己",
    });
  });

  it.each(["回到自己", "0/4 回到自己", "5/4 回到自己", "1/0 回到自己", "1/4"])(
    "rejects invalid progress value %s",
    (value) => {
      expect(parseStepProgress(value)).toBeNull();
    },
  );
});
