import { accountCopy } from "../copy/accounts";
import { marketCopy } from "../copy/markets";
import { DEFAULT_MARKET, todayKey } from "./defaults";
import type { AccountId, AccountImpact, AppState, DailyMarket, EmotionalSpace } from "./types";

export type AccountSummary = {
  account: AccountId;
  label: string;
  stateLabel: string;
  reason: string;
  value: number;
};

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
  return [
    ...state.episodes.flatMap((episode) => episode.accountImpacts),
    ...state.returnToSelfPractices.flatMap((practice) => practice.accountImpacts),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function selectAccountSummaries(state: AppState): AccountSummary[] {
  const impacts = selectAccountImpacts(state);

  return (["connection", "self", "energy"] as AccountId[]).map((account) => {
    const accountImpacts = impacts.filter((impact) => impact.account === account);
    const value = accountImpacts.reduce((sum, impact) => sum + impact.value, 0);
    const latestReason = accountImpacts[0]?.reason;
    const copy = accountCopy[account];

    return {
      account,
      label: copy.label,
      value,
      stateLabel: value > 0 ? copy.positive : copy.empty,
      reason: latestReason ?? copy.reminder,
    };
  });
}
