import type { Anchor, AnchorInput, AppState } from "./types";

export type AnchorBuildOptions = {
  id: string;
  timestamp: string;
};

export function addAnchorToState(
  state: AppState,
  input: AnchorInput,
  options: AnchorBuildOptions,
): { state: AppState; anchor?: Anchor } {
  const anchor = buildAnchor(input, options);

  if (!anchor) {
    return { state };
  }

  return {
    anchor,
    state: {
      ...state,
      anchors: [anchor, ...state.anchors],
    },
  };
}

export function buildAnchor(
  input: AnchorInput,
  options: AnchorBuildOptions,
): Anchor | undefined {
  const text = input.text.trim();

  if (!text) {
    return undefined;
  }

  return {
    id: options.id,
    spaceId: input.spaceId,
    text,
    sourceType: input.sourceType,
    sourceId: input.sourceId,
    createdAt: options.timestamp,
    updatedAt: options.timestamp,
  };
}
