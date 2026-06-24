import { describe, expect, it } from "vitest";
import {
  buildRecordRoute,
  buildHighActivationBranchState,
  buildExperimentRoute,
  buildTopicRoute,
  getBranchActivationContext,
  getExperimentRouteId,
  getRecordRouteId,
  getTopicRouteId,
  normalizeRoute,
} from "./route";

describe("route helpers", () => {
  it("normalizes topic detail routes with ids", () => {
    expect(normalizeRoute("/topics/topic_1")).toBe("/topics/topic_1");
    expect(normalizeRoute("/topics/topic%20with%20space/")).toBe("/topics/topic%20with%20space");
  });

  it("extracts topic route ids", () => {
    expect(getTopicRouteId("/topics/topic_1")).toBe("topic_1");
    expect(getTopicRouteId("/topics")).toBeNull();
    expect(getTopicRouteId("/topics/topic_1/extra")).toBeNull();
  });

  it("builds encoded topic detail routes", () => {
    expect(buildTopicRoute("topic with space")).toBe("/topics/topic%20with%20space");
  });

  it("normalizes record detail routes with ids", () => {
    expect(normalizeRoute("/record/episode_1")).toBe("/record/episode_1");
    expect(normalizeRoute("/record/episode%20with%20space/")).toBe(
      "/record/episode%20with%20space",
    );
    expect(normalizeRoute("/record/new")).toBe("/record/new");
  });

  it("extracts record route ids", () => {
    expect(getRecordRouteId("/record/episode_1")).toBe("episode_1");
    expect(getRecordRouteId("/record")).toBeNull();
    expect(getRecordRouteId("/record/new")).toBeNull();
    expect(getRecordRouteId("/record/episode_1/extra")).toBeNull();
  });

  it("builds encoded record detail routes", () => {
    expect(buildRecordRoute("episode with space")).toBe("/record/episode%20with%20space");
  });

  it("normalizes experiment detail routes with ids", () => {
    expect(normalizeRoute("/experiments/experiment_1")).toBe("/experiments/experiment_1");
    expect(normalizeRoute("/experiments/experiment%20with%20space/")).toBe(
      "/experiments/experiment%20with%20space",
    );
  });

  it("extracts experiment route ids", () => {
    expect(getExperimentRouteId("/experiments/experiment_1")).toBe("experiment_1");
    expect(getExperimentRouteId("/experiments")).toBeNull();
    expect(getExperimentRouteId("/experiments/experiment_1/extra")).toBeNull();
  });

  it("builds encoded experiment detail routes", () => {
    expect(buildExperimentRoute("experiment with space")).toBe(
      "/experiments/experiment%20with%20space",
    );
  });

  it("recognizes the rich incoming review route", () => {
    expect(normalizeRoute("/rich-incoming")).toBe("/rich-incoming");
  });

  it("recognizes the emotion calibration route", () => {
    expect(normalizeRoute("/emotion-calibration")).toBe("/emotion-calibration");
  });

  it("recognizes the empowerment shift branch route", () => {
    expect(normalizeRoute("/empowerment-shift")).toBe("/empowerment-shift");
    expect(normalizeRoute("/empowerment-shift/")).toBe("/empowerment-shift");
  });

  it("recognizes the seeing evidence branch route", () => {
    expect(normalizeRoute("/seeing-evidence")).toBe("/seeing-evidence");
    expect(normalizeRoute("/seeing-evidence/")).toBe("/seeing-evidence");
  });

  it("recognizes the healthy love branch route", () => {
    expect(normalizeRoute("/healthy-love")).toBe("/healthy-love");
    expect(normalizeRoute("/healthy-love/")).toBe("/healthy-love");
  });

  it("recognizes the repair understanding branch route", () => {
    expect(normalizeRoute("/repair-understanding")).toBe("/repair-understanding");
    expect(normalizeRoute("/repair-understanding/")).toBe("/repair-understanding");
  });

  it("recognizes the connection continuity branch route", () => {
    expect(normalizeRoute("/connection-continuity")).toBe("/connection-continuity");
    expect(normalizeRoute("/connection-continuity/")).toBe("/connection-continuity");
  });

  it("recognizes the old echo branch route", () => {
    expect(normalizeRoute("/old-echo")).toBe("/old-echo");
    expect(normalizeRoute("/old-echo/")).toBe("/old-echo");
  });

  it("recognizes the boundary clarity branch route", () => {
    expect(normalizeRoute("/boundary-clarity")).toBe("/boundary-clarity");
    expect(normalizeRoute("/boundary-clarity/")).toBe("/boundary-clarity");
  });

  it("recognizes the self-compassion branch route", () => {
    expect(normalizeRoute("/self-compassion")).toBe("/self-compassion");
    expect(normalizeRoute("/self-compassion/")).toBe("/self-compassion");
  });

  it("keeps unknown routes on the home fallback", () => {
    expect(normalizeRoute("/not-real")).toBe("/");
  });

  it("builds and reads high activation branch route state for supported sources", () => {
    const sources = [
      "draft_check",
      "signal_check",
      "emotion_calibration",
      "rich_incoming",
      "quick_record",
      "trigger_support",
    ] as const;

    for (const source of sources) {
      const routeState = buildHighActivationBranchState(source);

      expect(getBranchActivationContext(routeState)).toEqual({
        kind: "high_activation",
        source,
      });
    }
  });

  it("ignores malformed branch route state", () => {
    expect(getBranchActivationContext({ branchActivation: { kind: "high_activation" } })).toBeNull();
    expect(getBranchActivationContext({ branchActivation: { kind: "other", source: "draft_check" } })).toBeNull();
    expect(getBranchActivationContext({ branchActivation: { kind: "high_activation", source: "other" } })).toBeNull();
    expect(getBranchActivationContext(null)).toBeNull();
  });
});
