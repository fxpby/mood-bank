import type {
  AppState,
  DiscoveryPoint,
  DiscoveryPointInput,
  DiscoveryPointReviewNoteInput,
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
