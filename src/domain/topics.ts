import type {
  AppState,
  DeleteDiscoveryPointInput,
  DiscoveryPoint,
  DiscoveryPointInput,
  DiscoveryPointKind,
  DiscoveryPointReviewNoteInput,
  DiscoveryPointSourceType,
  DiscoveryPointStatusInput,
  DiscoveryPointTheme,
  DiscoveryPointUpdateInput,
} from "./types";

export type DiscoveryPointBuildOptions = {
  id: string;
  timestamp: string;
};

export type TopicKindFilter = "all" | DiscoveryPointKind;
export type TopicStatusFilter =
  | "all"
  | "want_to_understand"
  | "want_to_share"
  | "leave_for_now"
  | "reviewed"
  | "no_longer_needed";
export type TopicThemeFilter = "all" | DiscoveryPointTheme;
export type TopicSourceFilter = "all" | DiscoveryPointSourceType;

export type TopicFilters = {
  kind: TopicKindFilter;
  status: TopicStatusFilter;
  theme: TopicThemeFilter;
  source: TopicSourceFilter;
  query?: string;
};

export function addDiscoveryPointToState(
  state: AppState,
  input: DiscoveryPointInput,
  options: DiscoveryPointBuildOptions,
): { state: AppState; point: DiscoveryPoint } {
  const point = buildDiscoveryPoint(input, options);

  return {
    point,
    state: {
      ...state,
      topics: [point, ...state.topics],
    },
  };
}

export function addDiscoveryPointsToState(
  state: AppState,
  inputs: DiscoveryPointInput[],
  options: { ids: string[]; timestamp: string },
): { state: AppState; points: DiscoveryPoint[] } {
  const points = inputs.map((input, index) =>
    buildDiscoveryPoint(input, {
      id: options.ids[index] ?? `topic_${index + 1}`,
      timestamp: options.timestamp,
    }),
  );

  return {
    points,
    state: {
      ...state,
      topics: [...points, ...state.topics],
    },
  };
}

export function filterDiscoveryPoints(
  points: DiscoveryPoint[],
  filters: TopicFilters,
): DiscoveryPoint[] {
  return points.filter((point) => matchesTopicFilters(point, filters));
}

export function matchesTopicFilters(point: DiscoveryPoint, filters: TopicFilters): boolean {
  if (filters.kind !== "all" && point.kind !== filters.kind) {
    return false;
  }

  if (filters.status === "reviewed") {
    if (point.status !== "reviewed" && point.status !== "naturally_reached") {
      return false;
    }
  } else if (filters.status !== "all" && point.status !== filters.status) {
    return false;
  }

  if (filters.theme !== "all" && point.theme !== filters.theme) {
    return false;
  }

  if (filters.source !== "all" && point.sourceType !== filters.source) {
    return false;
  }

  if (!matchesTopicSearch(point, filters.query)) {
    return false;
  }

  return true;
}

function matchesTopicSearch(point: DiscoveryPoint, query: string | undefined): boolean {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return true;
  }

  return [
    point.title,
    point.note,
    point.exploreQuestion,
    point.sourceTitle,
    point.sourceSnippet,
  ].some((value) => normalizeSearchText(value).includes(normalizedQuery));
}

function normalizeSearchText(value: string | undefined): string {
  return value?.trim().replace(/\s+/g, " ").toLocaleLowerCase("zh-CN") ?? "";
}

export function updateDiscoveryPointStatusInState(
  state: AppState,
  input: DiscoveryPointStatusInput,
  timestamp: string,
): { state: AppState; point?: DiscoveryPoint } {
  let updatedPoint: DiscoveryPoint | undefined;
  const topics = state.topics.map((point) => {
    if (point.id !== input.id) {
      return point;
    }

    updatedPoint = {
      ...point,
      status: input.status,
      updatedAt: timestamp,
    };
    return updatedPoint;
  });

  return {
    point: updatedPoint,
    state: {
      ...state,
      topics,
    },
  };
}

export function updateDiscoveryPointNoteInState(
  state: AppState,
  input: DiscoveryPointReviewNoteInput,
  timestamp: string,
): { state: AppState; point?: DiscoveryPoint } {
  let updatedPoint: DiscoveryPoint | undefined;
  const topics = state.topics.map((point) => {
    if (point.id !== input.id) {
      return point;
    }

    updatedPoint = {
      ...point,
      note: cleanOptional(input.note),
      updatedAt: timestamp,
    };
    return updatedPoint;
  });

  return {
    point: updatedPoint,
    state: {
      ...state,
      topics,
    },
  };
}

export function updateDiscoveryPointInState(
  state: AppState,
  input: DiscoveryPointUpdateInput,
  timestamp: string,
): { state: AppState; point?: DiscoveryPoint } {
  let updatedPoint: DiscoveryPoint | undefined;
  const topics = state.topics.map((point) => {
    if (point.id !== input.id) {
      return point;
    }

    updatedPoint = {
      ...point,
      title: input.title.trim() || "一个稍后再看的点",
      kind: input.kind,
      theme: input.theme,
      note: cleanOptional(input.note),
      exploreQuestion: cleanOptional(input.exploreQuestion),
      updatedAt: timestamp,
    };
    return updatedPoint;
  });

  return {
    point: updatedPoint,
    state: {
      ...state,
      topics,
    },
  };
}

export function deleteDiscoveryPointFromState(
  state: AppState,
  input: DeleteDiscoveryPointInput,
): { state: AppState; point?: DiscoveryPoint } {
  const deletedPoint = state.topics.find((point) => point.id === input.id);

  if (!deletedPoint) {
    return { state };
  }

  return {
    point: deletedPoint,
    state: {
      ...state,
      topics: state.topics.filter((point) => point.id !== input.id),
    },
  };
}

export function buildDiscoveryPoint(
  input: DiscoveryPointInput,
  options: DiscoveryPointBuildOptions,
): DiscoveryPoint {
  return {
    id: options.id,
    spaceId: input.spaceId,
    title: input.title.trim() || "一个稍后再看的点",
    kind: input.kind,
    status: "stored_for_later",
    sourceType: input.sourceType ?? "manual",
    sourceId: cleanOptional(input.sourceId),
    sourceTitle: cleanOptional(input.sourceTitle),
    sourceSnippet: cleanOptional(input.sourceSnippet),
    theme: input.theme,
    note: cleanOptional(input.note),
    exploreQuestion: cleanOptional(input.exploreQuestion),
    createdAt: options.timestamp,
    updatedAt: options.timestamp,
  };
}

function cleanOptional(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}
