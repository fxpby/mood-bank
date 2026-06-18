import type { AppState } from "./types";
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
    topics: asArray(state.topics),
    experiments: asArray(state.experiments),
    personalActions: asArray(state.personalActions),
    settings: {
      hasCompletedSetup: settings.hasCompletedSetup,
      hasAcknowledgedLocalOnly: Boolean(settings.hasAcknowledgedLocalOnly),
    },
  };

  return { ok: true, state: normalized };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asArray<T>(value: T[] | undefined): T[] {
  return Array.isArray(value) ? value : [];
}
