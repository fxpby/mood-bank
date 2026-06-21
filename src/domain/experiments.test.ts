import { describe, expect, it } from "vitest";
import { deriveAllAccountSummaries } from "./accounts";
import { createInitialState } from "./defaults";
import {
  addExperimentAttemptToState,
  addExperimentToState,
  buildDiscoveryPointExperimentInput,
  buildExperimentAttemptImpacts,
  getExperimentById,
  getExperimentsNewestFirst,
} from "./experiments";
import { buildPersonalActionExperimentInput, personalActions } from "./personalActions";
import type { DiscoveryPoint } from "./types";

describe("personal experiments", () => {
  it("adds a small practice newest first without account impacts", () => {
    const state = createInitialState();
    const before = deriveAllAccountSummaries(state);
    const first = addExperimentToState(
      state,
      {
        spaceId: "space_1",
        focus: "练习慢一点回复",
        tinyAction: "先写一句事实",
        completionMarker: "写出来就算",
      },
      { id: "experiment_1", timestamp: "2026-06-20T09:00:00.000Z" },
    );
    const second = addExperimentToState(
      first.state,
      {
        spaceId: "space_1",
        focus: "练习收下照顾",
        tinyAction: "停一下说我收到了",
        completionMarker: "停一下就算",
      },
      { id: "experiment_2", timestamp: "2026-06-20T10:00:00.000Z" },
    );

    expect(getExperimentsNewestFirst(second.state).map((experiment) => experiment.id)).toEqual([
      "experiment_2",
      "experiment_1",
    ]);
    expect(deriveAllAccountSummaries(first.state)).toEqual(before);
  });

  it("builds a small practice input from a discovery point", () => {
    const point = createDiscoveryPoint({
      id: "topic_1",
      title: "我会在解释里越写越多",
      kind: "question",
      note: "我想练习先停一下。",
      exploreQuestion: "我能不能只写一句事实？",
    });

    expect(buildDiscoveryPointExperimentInput(point)).toEqual({
      spaceId: "space_1",
      focus: "练习回应：我会在解释里越写越多",
      tinyAction: "只写一句：我能不能只写一句事实？",
      completionMarker: "我试过一次，或只是看见自己愿不愿意试，就算练习过。",
      source: "discovery_point",
      sourceActionId: "topic_1",
    });
  });

  it("creates discovery-point sourced experiments without account impacts", () => {
    const state = createInitialState();
    const before = deriveAllAccountSummaries(state);
    const result = addExperimentToState(
      state,
      buildDiscoveryPointExperimentInput(
        createDiscoveryPoint({
          id: "topic_2",
          title: "边界可以更轻一点",
          kind: "action_idea",
          note: "今天只说一句真实限度。",
        }),
      ),
      { id: "experiment_1", timestamp: "2026-06-20T09:00:00.000Z" },
    );

    expect(result.experiment).toMatchObject({
      source: "discovery_point",
      sourceActionId: "topic_2",
    });
    expect(deriveAllAccountSummaries(result.state)).toEqual(before);
  });

  it("keeps personal-action experiment creation no-impact and completed attempt self/energy only", () => {
    const state = createInitialState();
    const before = deriveAllAccountSummaries(state);
    const created = addExperimentToState(
      state,
      buildPersonalActionExperimentInput(personalActions[0], "space_1"),
      { id: "experiment_1", timestamp: "2026-06-20T09:00:00.000Z" },
    );

    expect(created.experiment).toMatchObject({
      source: "personal_action",
      sourceActionId: personalActions[0].id,
    });
    expect(deriveAllAccountSummaries(created.state)).toEqual(before);

    const attempted = addExperimentAttemptToState(
      created.state,
      {
        experimentId: created.experiment.id,
        outcome: "completed",
        note: personalActions[0].completionMarker,
      },
      { id: "attempt_1", timestamp: "2026-06-20T10:00:00.000Z" },
    );

    expect(attempted.attempt?.accountImpacts.map((impact) => impact.account)).toEqual([
      "self",
      "energy",
    ]);
    expect(
      attempted.attempt?.accountImpacts.some((impact) => impact.account === "connection"),
    ).toBe(false);
  });

  it("records attempts newest first", () => {
    const created = addExperimentToState(
      createInitialState(),
      {
        spaceId: "space_1",
        focus: "练习边界",
        tinyAction: "写一句我能做什么",
        completionMarker: "写一句就算",
      },
      { id: "experiment_1", timestamp: "2026-06-20T09:00:00.000Z" },
    );
    const firstAttempt = addExperimentAttemptToState(
      created.state,
      { experimentId: "experiment_1", outcome: "noticed", note: "先看见也算" },
      { id: "attempt_1", timestamp: "2026-06-20T10:00:00.000Z" },
    );
    const secondAttempt = addExperimentAttemptToState(
      firstAttempt.state,
      { experimentId: "experiment_1", outcome: "partial" },
      { id: "attempt_2", timestamp: "2026-06-20T11:00:00.000Z" },
    );

    expect(getExperimentById(secondAttempt.state, "experiment_1")?.attempts.map((attempt) => attempt.id)).toEqual([
      "attempt_2",
      "attempt_1",
    ]);
  });

  it("creates transparent self and energy impacts for completed attempts", () => {
    const impacts = buildExperimentAttemptImpacts(
      { experimentId: "experiment_1", outcome: "completed" },
      { sourceId: "attempt_1", createdAt: "2026-06-20T10:00:00.000Z" },
    );

    expect(impacts.map((impact) => [impact.account, impact.value, impact.reasonCode])).toEqual([
      ["self", 1, "experiment_completed"],
      ["energy", 1, "energy_restored"],
    ]);
  });

  it("keeps partial and noticed as self impacts only", () => {
    expect(
      buildExperimentAttemptImpacts(
        { experimentId: "experiment_1", outcome: "partial" },
        { sourceId: "attempt_1", createdAt: "2026-06-20T10:00:00.000Z" },
      ).map((impact) => [impact.account, impact.reasonCode]),
    ).toEqual([["self", "experiment_partial"]]);

    expect(
      buildExperimentAttemptImpacts(
        { experimentId: "experiment_1", outcome: "noticed" },
        { sourceId: "attempt_1", createdAt: "2026-06-20T10:00:00.000Z" },
      ).map((impact) => [impact.account, impact.reasonCode]),
    ).toEqual([["self", "experiment_noticed"]]);
  });

  it("does not punish not-suitable attempts", () => {
    expect(
      buildExperimentAttemptImpacts(
        { experimentId: "experiment_1", outcome: "not_suitable" },
        { sourceId: "attempt_1", createdAt: "2026-06-20T10:00:00.000Z" },
      ),
    ).toEqual([]);
  });
});

function createDiscoveryPoint(overrides: Partial<DiscoveryPoint>): DiscoveryPoint {
  return {
    id: "topic_1",
    spaceId: "space_1",
    title: "一个发现点",
    kind: "discovery",
    status: "stored_for_later",
    sourceType: "manual",
    createdAt: "2026-06-20T09:00:00.000Z",
    updatedAt: "2026-06-20T09:00:00.000Z",
    ...overrides,
  };
}
