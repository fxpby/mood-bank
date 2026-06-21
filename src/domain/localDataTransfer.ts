import type { AppState } from "./types";
import { validateMinimumAppState } from "./validation";

export type LocalDataImportErrorReason = "invalid_json" | "unsupported_version" | "corrupted";

export type LocalDataImportResult =
  | { ok: true; state: AppState }
  | { ok: false; reason: LocalDataImportErrorReason; error: string };

export type LocalDataSummary = {
  spaces: number;
  episodes: number;
  returnToSelfPractices: number;
  anchors: number;
  drafts: number;
  topics: number;
  experiments: number;
};

export function serializeLocalData(state: AppState): string {
  return `${JSON.stringify(state, null, 2)}\n`;
}

export function parseLocalDataImport(text: string): LocalDataImportResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(text) as unknown;
  } catch (error) {
    return {
      ok: false,
      reason: "invalid_json",
      error: error instanceof Error ? error.message : "这个文件不是有效的 JSON。",
    };
  }

  const validated = validateMinimumAppState(parsed);

  if (!validated.ok) {
    return {
      ok: false,
      reason: validated.unsupportedVersion ? "unsupported_version" : "corrupted",
      error: validated.error,
    };
  }

  return { ok: true, state: validated.state };
}

export function getLocalDataSummary(state: AppState): LocalDataSummary {
  return {
    spaces: state.spaces.length,
    episodes: state.episodes.length,
    returnToSelfPractices: state.returnToSelfPractices.length,
    anchors: state.anchors.length,
    drafts: state.drafts.length,
    topics: state.topics.length,
    experiments: state.experiments.length,
  };
}

export function buildLocalDataExportFileName(now = new Date()): string {
  const date = Number.isNaN(now.getTime()) ? "unknown-date" : now.toISOString().slice(0, 10);
  return `mood-bank-backup-${date}.json`;
}

