import { buildQuickRecordImpacts } from "./accounts";
import type { AppState, DeleteEpisodeInput, Episode, EpisodeUpdateInput, SpaceType } from "./types";

const DEFAULT_EPISODE_TITLE = "一次互动";

export function deleteEpisodeFromState(
  state: AppState,
  input: DeleteEpisodeInput,
): { state: AppState; episode?: Episode } {
  const episode = state.episodes.find((item) => item.id === input.id);

  if (!episode) {
    return { state };
  }

  const shouldDeleteLinkedAnchors = input.deleteLinkedAnchors !== false;

  return {
    episode,
    state: {
      ...state,
      episodes: state.episodes.filter((item) => item.id !== input.id),
      anchors: shouldDeleteLinkedAnchors
        ? state.anchors.filter(
            (anchor) => !(anchor.sourceType === "episode" && anchor.sourceId === input.id),
          )
        : state.anchors,
    },
  };
}

export function updateEpisodeInState(
  state: AppState,
  input: EpisodeUpdateInput,
  timestamp: string,
): { state: AppState; episode?: Episode } {
  let updatedEpisode: Episode | undefined;
  const episodes = state.episodes.map((episode) => {
    if (episode.id !== input.id) {
      return episode;
    }

    const spaceType = getEpisodeSpaceType(state, episode.spaceId);
    const facts = input.facts.trim();
    const interpretation = input.interpretation?.trim() ?? "";
    const title = input.title.trim() || DEFAULT_EPISODE_TITLE;
    const interpretationSkipped =
      !interpretation &&
      episode.accountImpacts.some(
        (impact) => impact.reasonCode === "fact_interpretation_split" && impact.evidence === "暂时不解释",
      );
    const accountImpacts = buildQuickRecordImpacts(
      {
        spaceId: episode.spaceId,
        spaceType,
        source: episode.source,
        title,
        facts,
        interpretation,
        interpretationSkipped,
        emotions: input.emotions?.length ? input.emotions : ["not_sure"],
        bodySensations: input.bodySensations?.length ? input.bodySensations : ["not_sure"],
        connectionLevel: input.connectionLevel ?? "not_sure",
        activationLevel: input.activationLevel ?? "not_sure",
        nextAction: input.nextAction ?? "not_now",
        connectionEvidence: input.connectionEvidence,
        selfContactEvidence: input.selfContactEvidence,
        energyEffect: input.energyEffect,
      },
      { sourceId: episode.id, createdAt: timestamp },
    );

    updatedEpisode = {
      ...episode,
      title,
      facts,
      interpretation,
      emotions: input.emotions?.length ? input.emotions : ["not_sure"],
      bodySensations: input.bodySensations?.length ? input.bodySensations : ["not_sure"],
      connectionLevel: input.connectionLevel ?? "not_sure",
      activationLevel: input.activationLevel ?? "not_sure",
      nextAction: input.nextAction ?? "not_now",
      accountImpacts,
      updatedAt: timestamp,
    };
    return updatedEpisode;
  });

  return {
    episode: updatedEpisode,
    state: {
      ...state,
      episodes,
    },
  };
}

function getEpisodeSpaceType(state: AppState, spaceId: string): SpaceType {
  return state.spaces.find((space) => space.id === spaceId)?.type ?? "interpersonal";
}
