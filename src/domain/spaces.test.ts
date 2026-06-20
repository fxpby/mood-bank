import { describe, expect, it } from "vitest";
import { createInitialState, createSetupState, DEFAULT_SPACE_NAME } from "./defaults";
import { updateActiveSpaceInState } from "./spaces";

const timestamp = "2026-06-20T10:00:00.000Z";

describe("space state helpers", () => {
  it("updates the active space name and description", () => {
    const state = createSetupState({
      displayName: "旧名称",
      description: "旧描述",
      type: "interpersonal",
      dailyMarket: "observe",
    });

    const result = updateActiveSpaceInState(
      state,
      {
        displayName: "  安的邮件  ",
        description: "  先看见事实  ",
      },
      timestamp,
    );

    expect(result.space).toMatchObject({
      id: state.activeSpaceId,
      displayName: "安的邮件",
      description: "先看见事实",
      updatedAt: timestamp,
    });
    expect(result.state.spaces[0]).toBe(result.space);
  });

  it("uses the default space name when the input name is blank", () => {
    const state = createSetupState({
      displayName: "旧名称",
      description: "",
      type: "self",
      dailyMarket: "steady",
    });

    const result = updateActiveSpaceInState(
      state,
      {
        displayName: "   ",
        description: "   ",
      },
      timestamp,
    );

    expect(result.space?.displayName).toBe(DEFAULT_SPACE_NAME);
    expect(result.space?.description).toBe("");
  });

  it("returns no-op state when there is no active space", () => {
    const state = createInitialState();

    const result = updateActiveSpaceInState(
      state,
      {
        displayName: "不会保存",
        description: "没有空间",
      },
      timestamp,
    );

    expect(result.space).toBeUndefined();
    expect(result.state).toBe(state);
  });

  it("returns no-op state when active space id is stale", () => {
    const state = {
      ...createInitialState(),
      activeSpaceId: "missing_space",
    };

    const result = updateActiveSpaceInState(
      state,
      {
        displayName: "不会保存",
        description: "没有空间",
      },
      timestamp,
    );

    expect(result.space).toBeUndefined();
    expect(result.state).toBe(state);
  });
});
