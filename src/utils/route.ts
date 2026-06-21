export type AppRoute =
  | "/"
  | "/home"
  | "/setup"
  | "/trigger"
  | "/return-to-self"
  | "/record"
  | "/record/new"
  | `/record/${string}`
  | "/settings"
  | "/topics"
  | `/topics/${string}`
  | "/experiments"
  | `/experiments/${string}`
  | "/signal-check"
  | "/draft-check"
  | "/rich-incoming"
  | "/emotion-calibration"
  | "/empowerment-shift"
  | "/seeing-evidence"
  | "/healthy-love"
  | "/connection-continuity"
  | "/old-echo"
  | "/boundary-clarity"
  | "/self-compassion"
  | "/accounts/connection"
  | "/accounts/self"
  | "/accounts/energy";

export type RouteState = {
  quickRecordPrefill?: import("../domain/types").QuickRecordPrefill;
  returnToSelfAnchor?: string;
  branchActivation?: BranchActivationContext;
};

export type BranchActivationSource = "draft_check" | "signal_check" | "emotion_calibration";

export type BranchActivationContext = {
  kind: "high_activation";
  source: BranchActivationSource;
};

export function buildHighActivationBranchState(source: BranchActivationSource): RouteState {
  return {
    branchActivation: {
      kind: "high_activation",
      source,
    },
  };
}

export function getBranchActivationContext(value: unknown): BranchActivationContext | null {
  if (!isRecord(value) || !isRecord(value.branchActivation)) {
    return null;
  }

  const { kind, source } = value.branchActivation;

  if (kind !== "high_activation" || !isBranchActivationSource(source)) {
    return null;
  }

  return { kind, source };
}

export function normalizeRoute(pathname: string): AppRoute {
  if (pathname.startsWith("/accounts/connection")) return "/accounts/connection";
  if (pathname.startsWith("/accounts/self")) return "/accounts/self";
  if (pathname.startsWith("/accounts/energy")) return "/accounts/energy";
  const recordRoute = getNormalizedRecordRoute(pathname);
  if (recordRoute) return recordRoute;
  const topicRoute = getNormalizedTopicRoute(pathname);
  if (topicRoute) return topicRoute;
  const experimentRoute = getNormalizedExperimentRoute(pathname);
  if (experimentRoute) return experimentRoute;

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
    "/rich-incoming",
    "/emotion-calibration",
    "/empowerment-shift",
    "/seeing-evidence",
    "/healthy-love",
    "/connection-continuity",
    "/old-echo",
    "/boundary-clarity",
    "/self-compassion",
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

export function getRecordRouteId(pathname: string): string | null {
  const match = pathname.match(/^\/record\/([^/]+)\/?$/);
  if (!match?.[1] || match[1] === "new") {
    return null;
  }

  return decodeURIComponent(match[1]);
}

export function buildRecordRoute(id: string): `/record/${string}` {
  return `/record/${encodeURIComponent(id)}`;
}

export function getExperimentRouteId(pathname: string): string | null {
  const match = pathname.match(/^\/experiments\/([^/]+)\/?$/);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

export function buildExperimentRoute(id: string): `/experiments/${string}` {
  return `/experiments/${encodeURIComponent(id)}`;
}

function getNormalizedRecordRoute(pathname: string): `/record/${string}` | null {
  const match = pathname.match(/^\/record\/([^/]+)\/?$/);
  if (!match?.[1] || match[1] === "new") {
    return null;
  }

  return `/record/${encodeURIComponent(decodeURIComponent(match[1]))}`;
}

function getNormalizedTopicRoute(pathname: string): `/topics/${string}` | null {
  const match = pathname.match(/^\/topics\/([^/]+)\/?$/);
  return match?.[1] ? `/topics/${encodeURIComponent(decodeURIComponent(match[1]))}` : null;
}

function getNormalizedExperimentRoute(pathname: string): `/experiments/${string}` | null {
  const match = pathname.match(/^\/experiments\/([^/]+)\/?$/);
  return match?.[1] ? `/experiments/${encodeURIComponent(decodeURIComponent(match[1]))}` : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isBranchActivationSource(value: unknown): value is BranchActivationSource {
  return value === "draft_check" || value === "signal_check" || value === "emotion_calibration";
}
