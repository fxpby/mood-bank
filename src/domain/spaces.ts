import { DEFAULT_SPACE_NAME } from "./defaults";
import type { AppState, EmotionalSpace, SpaceInput } from "./types";

export type UpdateActiveSpaceResult = {
  state: AppState;
  space?: EmotionalSpace;
};

export function updateActiveSpaceInState(
  state: AppState,
  input: SpaceInput,
  timestamp: string,
): UpdateActiveSpaceResult {
  const activeSpaceId = state.activeSpaceId;

  if (!activeSpaceId) {
    return { state };
  }

  let updatedSpace: EmotionalSpace | undefined;
  const spaces = state.spaces.map((space) => {
    if (space.id !== activeSpaceId) {
      return space;
    }

    updatedSpace = {
      ...space,
      displayName: input.displayName.trim() || DEFAULT_SPACE_NAME,
      description: input.description.trim(),
      updatedAt: timestamp,
    };
    return updatedSpace;
  });

  if (!updatedSpace) {
    return { state };
  }

  return {
    space: updatedSpace,
    state: {
      ...state,
      spaces,
    },
  };
}
