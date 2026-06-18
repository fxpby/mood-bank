import { marketCopy } from "../copy/markets";
import { DEFAULT_MARKET, todayKey } from "./defaults";
import {
  collectAccountImpacts,
  deriveAllAccountSummaries,
  type AccountSummary,
} from "./accounts";
import type { AccountImpact, AppState, DailyMarket, EmotionalSpace, Episode } from "./types";

export type { AccountSummary } from "./accounts";

export function selectActiveSpace(state: AppState): EmotionalSpace | null {
  if (!state.activeSpaceId) {
    return null;
  }

  return state.spaces.find((space) => space.id === state.activeSpaceId) ?? null;
}

export function selectTodayMarket(state: AppState): DailyMarket {
  return state.dailyMarkets[todayKey()]?.market ?? DEFAULT_MARKET;
}

export function selectTodayMarketLabel(state: AppState): string {
  return marketCopy[selectTodayMarket(state)].label;
}

export function selectTodayMarketNote(state: AppState): string {
  return marketCopy[selectTodayMarket(state)].note;
}

export function selectAccountImpacts(state: AppState): AccountImpact[] {
  return collectAccountImpacts(state);
}

export function selectAccountSummaries(state: AppState): AccountSummary[] {
  return deriveAllAccountSummaries(state);
}

export function selectLatestEpisode(state: AppState): Episode | null {
  return [...state.episodes].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0] ?? null;
}
