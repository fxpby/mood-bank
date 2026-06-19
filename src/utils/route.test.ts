import { describe, expect, it } from "vitest";
import { buildTopicRoute, getTopicRouteId, normalizeRoute } from "./route";

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

  it("keeps unknown routes on the home fallback", () => {
    expect(normalizeRoute("/not-real")).toBe("/");
  });
});
