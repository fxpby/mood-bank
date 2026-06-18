import type {
  AppState,
  DiscoveryPoint,
  DiscoveryPointInput,
  DiscoveryPointStatusInput,
} from "./types";

export type DiscoveryPointBuildOptions = {
  id: string;
  timestamp: string;
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
