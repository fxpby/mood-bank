import { describe, expect, it } from "vitest";
import { getSupportBoundaryKind, shouldShowSupportBoundary } from "./safety";

describe("safety support boundary helpers", () => {
  it("returns null when no selected values match support categories", () => {
    expect(
      getSupportBoundaryKind({
        selected: "return_to_self",
        supportValues: ["support_person"],
        overwhelmValues: ["collapse"],
      }),
    ).toBeNull();
  });

  it("detects an explicit human support choice first", () => {
    expect(
      getSupportBoundaryKind({
        selected: ["collapse", "support_person"],
        supportValues: ["support_person"],
        overwhelmValues: ["collapse"],
      }),
    ).toBe("human_support");
  });

  it("detects physical safety before general overwhelm", () => {
    expect(
      getSupportBoundaryKind({
        selected: ["body_overload", "leave_scene"],
        overwhelmValues: ["body_overload"],
        physicalSafetyValues: ["leave_scene"],
      }),
    ).toBe("physical_safety");
  });

  it("detects violence and dissociative categories", () => {
    expect(
      getSupportBoundaryKind({
        selected: "attack_blame",
        violenceValues: ["attack_blame"],
      }),
    ).toBe("violence");

    expect(
      getSupportBoundaryKind({
        selected: "numb",
        dissociativeValues: ["numb"],
      }),
    ).toBe("dissociative");
  });

  it("provides a boolean helper for route rendering", () => {
    expect(
      shouldShowSupportBoundary({
        selected: "collapse",
        overwhelmValues: ["collapse"],
      }),
    ).toBe(true);

    expect(
      shouldShowSupportBoundary({
        selected: "present",
        overwhelmValues: ["collapse"],
      }),
    ).toBe(false);
  });
});
