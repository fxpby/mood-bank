import { marketCopy } from "../copy/markets";
import { getAccountEvidenceCopy } from "../copy/accounts";
import { DEFAULT_MARKET, todayKey } from "./defaults";
import {
  collectAccountImpacts,
  deriveAllAccountSummaries,
  deriveAccountSummary,
  type AccountSummary,
} from "./accounts";
import type {
  AccountId,
  AccountImpact,
  AppState,
  Anchor,
  DailyMarket,
  DiscoveryPoint,
  EmotionalSpace,
  Episode,
  ReturnToSelfPractice,
} from "./types";

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

export type AccountImpactSourceLabel = "互动记录" | "回到自己" | "触发支持";

export type AccountDetailSourceRow = {
  impact: AccountImpact;
  sourceLabel: AccountImpactSourceLabel;
  sourceTitle: string;
  sourceContext: string;
  evidence?: string;
};

export type AccountDetail = {
  summary: AccountSummary;
  rows: AccountDetailSourceRow[];
};

export type EpisodeDetail = {
  episode: Episode;
  accountRows: AccountDetailSourceRow[];
  linkedAnchors: Anchor[];
  linkedTopics: DiscoveryPoint[];
};

export function selectAccountDetail(state: AppState, account: AccountId): AccountDetail {
  const impacts = selectAccountImpacts(state).filter((impact) => impact.account === account);

  return {
    summary: deriveAccountSummary(account, impacts),
    rows: impacts.map((impact) => buildAccountDetailRow(impact, state)),
  };
}

export function selectLatestEpisode(state: AppState): Episode | null {
  return selectEpisodesNewestFirst(state)[0] ?? null;
}

export function selectEpisodesNewestFirst(state: AppState): Episode[] {
  return [...state.episodes].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function selectEpisodeDetail(state: AppState, episodeId: string | null): EpisodeDetail | null {
  if (!episodeId) {
    return null;
  }

  const episode = state.episodes.find((item) => item.id === episodeId);
  if (!episode) {
    return null;
  }

  return {
    episode,
    accountRows: [...episode.accountImpacts]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((impact) => buildAccountDetailRow(impact, state)),
    linkedAnchors: state.anchors
      .filter((anchor) => anchor.sourceType === "episode" && anchor.sourceId === episode.id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    linkedTopics: state.topics
      .filter((point) => point.sourceType === "episode" && point.sourceId === episode.id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  };
}

function buildAccountDetailRow(impact: AccountImpact, state: AppState): AccountDetailSourceRow {
  if (impact.sourceType === "episode") {
    const episode = state.episodes.find((item) => item.id === impact.sourceId);
    return {
      impact,
      sourceLabel: "互动记录",
      sourceTitle: episode?.title || "一次互动",
      sourceContext: episode?.facts || "这条来源记录暂时无法读取。",
      evidence: getReadableEvidence(impact.evidence),
    };
  }

  if (impact.sourceType === "return_to_self") {
    const practice = state.returnToSelfPractices.find((item) => item.id === impact.sourceId);
    return {
      impact,
      sourceLabel: "回到自己",
      sourceTitle: getReturnToSelfTitle(practice),
      sourceContext: getReturnToSelfContext(practice),
      evidence: getReadableEvidence(impact.evidence),
    };
  }

  return {
    impact,
    sourceLabel: "触发支持",
    sourceTitle: "一次触发支持",
    sourceContext: "这次只保存了完成信息，没有单独记录互动内容。",
    evidence: getReadableEvidence(impact.evidence),
  };
}

function getReadableEvidence(evidence: string | undefined): string | undefined {
  if (!evidence) {
    return undefined;
  }

  return getAccountEvidenceCopy(evidence);
}

function getReturnToSelfTitle(practice: ReturnToSelfPractice | undefined): string {
  if (!practice) {
    return "一次回到自己";
  }

  if (practice.completion === "full") {
    return "完成了一次回到自己";
  }

  if (practice.completion === "body_only") {
    return "先照顾了身体";
  }

  return "看见了一个需要";
}

function getReturnToSelfContext(practice: ReturnToSelfPractice | undefined): string {
  if (!practice) {
    return "这条回到自己的练习暂时无法读取。";
  }

  return (
    practice.anchor?.trim() ||
    practice.bodyAction?.trim() ||
    practice.returnToLifeAction?.trim() ||
    "这次练习没有留下更多文字。"
  );
}
