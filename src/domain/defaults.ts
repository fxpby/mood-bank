import { anchorsCopy } from "../copy/anchors";
import type { AppState, DailyMarket, SetupInput } from "./types";
import { SCHEMA_VERSION } from "./types";

export const DEFAULT_SPACE_NAME = "某段关系";
export const DEFAULT_MARKET: DailyMarket = "observe";

export function nowIso(): string {
  return new Date().toISOString();
}

export function todayKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function createId(prefix: string): string {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 12);

  return `${prefix}_${random}`;
}

export function createInitialState(): AppState {
  return {
    schemaVersion: SCHEMA_VERSION,
    spaces: [],
    activeSpaceId: null,
    dailyMarkets: {},
    episodes: [],
    returnToSelfPractices: [],
    anchors: [],
    drafts: [],
    topics: [],
    experiments: [],
    personalActions: [],
    settings: {
      hasCompletedSetup: false,
      hasAcknowledgedLocalOnly: false,
    },
  };
}

export function createSetupState(input: SetupInput): AppState {
  const state = createInitialState();
  const createdAt = nowIso();
  const spaceId = createId("space");
  const date = todayKey();
  const displayName = input.displayName.trim() || DEFAULT_SPACE_NAME;

  return {
    ...state,
    spaces: [
      {
        id: spaceId,
        displayName,
        description: input.description.trim(),
        type: input.type,
        defaultRecordingDepth: "quick",
        createdAt,
        updatedAt: createdAt,
      },
    ],
    activeSpaceId: spaceId,
    dailyMarkets: {
      [date]: {
        id: createId("market"),
        date,
        market: input.dailyMarket,
        createdAt,
        updatedAt: createdAt,
      },
    },
    anchors: [
      {
        id: createId("anchor"),
        spaceId,
        text: anchorsCopy.facts_slow_conclusion,
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: createId("anchor"),
        spaceId,
        text: anchorsCopy.return_then_decide,
        createdAt,
        updatedAt: createdAt,
      },
    ],
    settings: {
      hasCompletedSetup: true,
      hasAcknowledgedLocalOnly: true,
    },
  };
}
