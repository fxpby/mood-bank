import { describe, expect, it } from "vitest";
import {
  buildRecordRoute,
  buildTopicRoute,
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

  it("recognizes the rich incoming review route", () => {
    expect(normalizeRoute("/rich-incoming")).toBe("/rich-incoming");
  });

  it("keeps unknown routes on the home fallback", () => {
    expect(normalizeRoute("/not-real")).toBe("/");
  });
});
