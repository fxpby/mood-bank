import type {
  AppState,
  DiscoveryPoint,
  DiscoveryPointKind,
  DiscoveryPointSourceType,
  DiscoveryPointStatus,
  DiscoveryPointTheme,
  PersonalExperiment,
  PersonalExperimentAttempt,
  PersonalExperimentAttemptOutcome,
  PersonalExperimentSource,
} from "./types";
import { SCHEMA_VERSION } from "./types";

type MinimumShapeResult =
  | { ok: true; state: AppState }
  | { ok: false; error: string; unsupportedVersion?: boolean };

export function validateMinimumAppState(value: unknown): MinimumShapeResult {
  if (!isRecord(value)) {
    return { ok: false, error: "Root state is not an object." };
  }

  if (value.schemaVersion !== SCHEMA_VERSION) {
    return {
      ok: false,
      error: "Unsupported schema version.",
      unsupportedVersion: typeof value.schemaVersion === "number" && value.schemaVersion > SCHEMA_VERSION,
    };
  }

  if (!isRecord(value.settings) || typeof value.settings.hasCompletedSetup !== "boolean") {
    return { ok: false, error: "Settings shape is invalid." };
  }

  const state = value as Partial<AppState>;
  const settings = value.settings as AppState["settings"];
  const normalized: AppState = {
    schemaVersion: SCHEMA_VERSION,
    spaces: asArray(state.spaces),
    activeSpaceId: typeof state.activeSpaceId === "string" ? state.activeSpaceId : null,
    dailyMarkets: isRecord(state.dailyMarkets) ? state.dailyMarkets : {},
    episodes: asArray(state.episodes),
    returnToSelfPractices: asArray(state.returnToSelfPractices),
    anchors: asArray(state.anchors),
    drafts: asArray(state.drafts),
    topics: normalizeDiscoveryPoints(state.topics),
    experiments: normalizePersonalExperiments(state.experiments),
    personalActions: asArray(state.personalActions),
    settings: {
      hasCompletedSetup: settings.hasCompletedSetup,
      hasAcknowledgedLocalOnly: Boolean(settings.hasAcknowledgedLocalOnly),
    },
  };

  return { ok: true, state: normalized };
}

function normalizePersonalExperiments(value: unknown): PersonalExperiment[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((item) => {
    const createdAt = getString(item.createdAt) ?? new Date(0).toISOString();
    const updatedAt = getString(item.updatedAt) ?? createdAt;
    const id = getString(item.id) ?? `experiment_${createdAt}`;

    return {
      id,
      spaceId: getString(item.spaceId) ?? "",
      focus: getString(item.focus) ?? getString(item.title) ?? "一个小练习",
      tinyAction: getString(item.tinyAction) ?? getString(item.label) ?? "做一个今天能完成的小动作",
      completionMarker: getString(item.completionMarker) ?? "我试过一次就算",
      source: asPersonalExperimentSource(item.source),
      sourceActionId: getString(item.sourceActionId),
      attempts: normalizeExperimentAttempts(item.attempts),
      createdAt,
      updatedAt,
    };
  });
}

function normalizeExperimentAttempts(value: unknown): PersonalExperimentAttempt[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((item) => {
    const createdAt = getString(item.createdAt) ?? new Date(0).toISOString();
    const updatedAt = getString(item.updatedAt) ?? createdAt;

    return {
      id: getString(item.id) ?? `experiment_attempt_${createdAt}`,
      outcome: asExperimentAttemptOutcome(item.outcome),
      note: getString(item.note),
      accountImpacts: Array.isArray(item.accountImpacts) ? item.accountImpacts : [],
      createdAt,
      updatedAt,
    };
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asArray<T>(value: T[] | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

function normalizeDiscoveryPoints(value: unknown): DiscoveryPoint[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((item) => {
    const createdAt = getString(item.createdAt) ?? new Date(0).toISOString();
    const updatedAt = getString(item.updatedAt) ?? createdAt;

    return {
      id: getString(item.id) ?? `topic_${createdAt}`,
      spaceId: getString(item.spaceId) ?? "",
      title: getString(item.title) ?? "一个稍后再看的点",
      kind: asDiscoveryPointKind(item.kind),
      status: asDiscoveryPointStatus(item.status),
      sourceType: asDiscoveryPointSourceType(item.sourceType),
      sourceId: getString(item.sourceId),
      sourceTitle: getString(item.sourceTitle),
      sourceSnippet: getString(item.sourceSnippet),
      theme: asDiscoveryPointTheme(item.theme),
      note: getString(item.note),
      exploreQuestion: getString(item.exploreQuestion),
      createdAt,
      updatedAt,
    };
  });
}

function getString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function asDiscoveryPointKind(value: unknown): DiscoveryPointKind {
  if (
    value === "topic" ||
    value === "discovery" ||
    value === "question" ||
    value === "action_idea"
  ) {
    return value;
  }

  return "discovery";
}

function asDiscoveryPointStatus(value: unknown): DiscoveryPointStatus {
  if (
    value === "stored_for_later" ||
    value === "want_to_understand" ||
    value === "want_to_share" ||
    value === "leave_for_now" ||
    value === "reviewed" ||
    value === "naturally_reached" ||
    value === "no_longer_needed"
  ) {
    return value;
  }

  return "stored_for_later";
}

function asDiscoveryPointSourceType(value: unknown): DiscoveryPointSourceType {
  if (
    value === "manual" ||
    value === "episode" ||
    value === "return_to_self" ||
    value === "trigger" ||
    value === "draft_check" ||
    value === "rich_incoming"
  ) {
    return value;
  }

  return "manual";
}

function asDiscoveryPointTheme(value: unknown): DiscoveryPointTheme | undefined {
  if (
    value === "emotion" ||
    value === "boundary" ||
    value === "old_echo" ||
    value === "relationship_learning" ||
    value === "expression" ||
    value === "self_care" ||
    value === "action_experiment"
  ) {
    return value;
  }

  return undefined;
}

function asPersonalExperimentSource(value: unknown): PersonalExperimentSource {
  if (value === "personal_action" || value === "discovery_point") {
    return value;
  }

  return "manual";
}

function asExperimentAttemptOutcome(value: unknown): PersonalExperimentAttemptOutcome {
  if (
    value === "completed" ||
    value === "partial" ||
    value === "noticed" ||
    value === "not_suitable"
  ) {
    return value;
  }

  return "noticed";
}
