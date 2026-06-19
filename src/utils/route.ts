export type AppRoute =
  | "/"
  | "/home"
  | "/setup"
  | "/trigger"
  | "/return-to-self"
  | "/record"
  | "/record/new"
  | "/settings"
  | "/topics"
  | `/topics/${string}`
  | "/experiments"
  | "/signal-check"
  | "/draft-check"
  | "/accounts/connection"
  | "/accounts/self"
  | "/accounts/energy";

export type RouteState = {
  quickRecordPrefill?: import("../domain/types").QuickRecordPrefill;
};

export function normalizeRoute(pathname: string): AppRoute {
  if (pathname.startsWith("/accounts/connection")) return "/accounts/connection";
  if (pathname.startsWith("/accounts/self")) return "/accounts/self";
  if (pathname.startsWith("/accounts/energy")) return "/accounts/energy";
  const topicRoute = getNormalizedTopicRoute(pathname);
  if (topicRoute) return topicRoute;

  const cleanPath = pathname.replace(/\/+$/, "") || "/";
  const knownRoutes: AppRoute[] = [
    "/",
    "/home",
    "/setup",
    "/trigger",
    "/return-to-self",
    "/record",
    "/record/new",
    "/settings",
    "/topics",
    "/experiments",
    "/signal-check",
    "/draft-check",
  ];

  return knownRoutes.includes(cleanPath as AppRoute) ? (cleanPath as AppRoute) : "/";
}

export function isSetupRoute(route: AppRoute): boolean {
  return route === "/setup";
}

export function getTopicRouteId(pathname: string): string | null {
  const match = pathname.match(/^\/topics\/([^/]+)\/?$/);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

export function buildTopicRoute(id: string): `/topics/${string}` {
  return `/topics/${encodeURIComponent(id)}`;
}

function getNormalizedTopicRoute(pathname: string): `/topics/${string}` | null {
  const match = pathname.match(/^\/topics\/([^/]+)\/?$/);
  return match?.[1] ? `/topics/${encodeURIComponent(decodeURIComponent(match[1]))}` : null;
}
