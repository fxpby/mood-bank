import type { AppState, DeleteEpisodeInput, Episode } from "./types";

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
