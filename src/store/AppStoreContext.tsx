import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createInitialState, createSetupState, createId, nowIso, todayKey } from "../domain/defaults";
import type {
  Anchor,
  AnchorInput,
  AppState,
  DailyMarketInput,
  DeleteDiscoveryPointInput,
  DeleteEpisodeInput,
  DiscoveryPoint,
  DiscoveryPointInput,
  DiscoveryPointReviewNoteInput,
  DiscoveryPointStatusInput,
  DiscoveryPointUpdateInput,
  Draft,
  DraftInput,
  Episode,
  EmotionalSpace,
  PersonalExperiment,
  PersonalExperimentAttempt,
  PersonalExperimentAttemptInput,
  PersonalExperimentInput,
  PersonalExperimentStatusInput,
  PersonalExperimentUpdateInput,
  QuickRecordInput,
  ReturnToSelfInput,
  ReturnToSelfPractice,
  SetupInput,
  SpaceInput,
  StorageStatus,
  StoreNoWriteResult,
  StoreWriteResult,
  TriggerCompletionInput,
} from "../domain/types";
import {
  createLocalStorageAdapter,
  type LoadResult,
  type StorageAdapter,
} from "../storage/storageAdapter";
import { buildQuickRecordImpacts, buildReturnToSelfImpacts } from "../domain/accounts";
import { addAnchorToState } from "../domain/anchors";
import {
  addDiscoveryPointToState,
  addDiscoveryPointsToState,
  buildDiscoveryPoint,
  deleteDiscoveryPointFromState,
  updateDiscoveryPointInState,
  updateDiscoveryPointNoteInState,
  updateDiscoveryPointStatusInState,
} from "../domain/topics";
import { deleteEpisodeFromState } from "../domain/episodes";
import {
  addExperimentAttemptToState,
  addExperimentToState,
  buildExperimentDiscoveryPointInput,
  updateExperimentInState,
  updateExperimentStatusInState,
} from "../domain/experiments";
import { updateActiveSpaceInState } from "../domain/spaces";

export type AppStoreStatus =
  | "loading"
  | "ready"
  | "saving"
  | "save_error"
  | "storage_warning"
  | "resetting"
  | "reset_error";

export type AppActions = {
  completeSetup(input: SetupInput): StoreWriteResult;
  updateActiveSpace(input: SpaceInput): StoreWriteResult<EmotionalSpace>;
  updateDailyMarket(input: DailyMarketInput): StoreWriteResult;
  saveQuickRecord(input: QuickRecordInput): StoreWriteResult<Episode>;
  saveReturnToSelfPractice(input: ReturnToSelfInput): StoreWriteResult<ReturnToSelfPractice>;
  saveTriggerCompletion(input: TriggerCompletionInput): StoreWriteResult | StoreNoWriteResult;
  saveAnchor(input: AnchorInput): StoreWriteResult<Anchor>;
  saveDiscoveryPoint(input: DiscoveryPointInput): StoreWriteResult<DiscoveryPoint>;
  saveDiscoveryPoints(input: DiscoveryPointInput[]): StoreWriteResult<DiscoveryPoint[]>;
  updateDiscoveryPoint(input: DiscoveryPointUpdateInput): StoreWriteResult<DiscoveryPoint>;
  updateDiscoveryPointStatus(input: DiscoveryPointStatusInput): StoreWriteResult<DiscoveryPoint>;
  updateDiscoveryPointReviewNote(input: DiscoveryPointReviewNoteInput): StoreWriteResult<DiscoveryPoint>;
  deleteDiscoveryPoint(input: DeleteDiscoveryPointInput): StoreWriteResult;
  savePersonalExperiment(input: PersonalExperimentInput): StoreWriteResult<PersonalExperiment>;
  updatePersonalExperiment(input: PersonalExperimentUpdateInput): StoreWriteResult<PersonalExperiment>;
  updatePersonalExperimentStatus(input: PersonalExperimentStatusInput): StoreWriteResult<PersonalExperiment>;
  savePersonalExperimentDiscoveryPoint(input: {
    experimentId: string;
    note: string;
  }): StoreWriteResult<DiscoveryPoint>;
  savePersonalExperimentAttempt(
    input: PersonalExperimentAttemptInput,
  ): StoreWriteResult<PersonalExperimentAttempt>;
  saveDraft(input: DraftInput): StoreWriteResult<Draft>;
  deleteDraft(draftId: string): StoreWriteResult;
  deleteEpisode(input: DeleteEpisodeInput): StoreWriteResult;
  replaceLocalData(state: AppState): StoreWriteResult;
  resetLocalData(): StoreWriteResult;
  acknowledgeStorageWarning(): void;
};

export type AppStore = {
  state: AppState;
  status: AppStoreStatus;
  storageStatus: StorageStatus | "available";
  lastError?: string;
  lastSavedAt?: string;
  actions: AppActions;
};

const AppStoreContext = createContext<AppStore | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const adapterRef = useRef<StorageAdapter>(createLocalStorageAdapter());
  const initialLoad = useMemo(() => adapterRef.current.load(), []);
  const [state, setState] = useState<AppState>(() => loadState(initialLoad));
  const stateRef = useRef<AppState>(state);
  const [status, setStatus] = useState<AppStoreStatus>(() =>
    initialLoad.ok ? "ready" : "storage_warning",
  );
  const [storageStatus, setStorageStatus] = useState<StorageStatus | "available">(
    initialLoad.status,
  );
  const [lastError, setLastError] = useState<string | undefined>(() =>
    initialLoad.ok ? undefined : initialLoad.error,
  );
  const [lastSavedAt, setLastSavedAt] = useState<string | undefined>();

  const commitState = useCallback((nextState: AppState): StoreWriteResult => {
    setStatus("saving");
    const saveResult = adapterRef.current.save(nextState);

    if (!saveResult.ok) {
      setStatus("save_error");
      setStorageStatus(saveResult.status);
      setLastError(saveResult.error);
      return {
        ok: false,
        status: saveResult.status,
        error: saveResult.error,
        inMemoryOnly: true,
      };
    }

    const savedAt = nowIso();
    stateRef.current = nextState;
    setState(nextState);
    setStatus("ready");
    setStorageStatus("available");
    setLastError(undefined);
    setLastSavedAt(savedAt);
    return { ok: true, savedAt };
  }, []);

  const completeSetup = useCallback(
    (input: SetupInput): StoreWriteResult => {
      const nextState = createSetupState(input);
      return commitState(nextState);
    },
    [commitState],
  );

  const updateActiveSpace = useCallback(
    (input: SpaceInput): StoreWriteResult<EmotionalSpace> => {
      const timestamp = nowIso();
      const { state: nextState, space } = updateActiveSpaceInState(state, input, timestamp);

      if (!space) {
        return { ok: true, savedAt: timestamp };
      }

      const result = commitState(nextState);
      return result.ok ? { ...result, value: space } : result;
    },
    [commitState, state],
  );

  const updateDailyMarket = useCallback(
    (input: DailyMarketInput): StoreWriteResult => {
      const date = todayKey();
      const existing = state.dailyMarkets[date];
      const timestamp = nowIso();
      const nextState: AppState = {
        ...state,
        dailyMarkets: {
          ...state.dailyMarkets,
          [date]: {
            id: existing?.id ?? createId("market"),
            date,
            market: input.market,
            createdAt: existing?.createdAt ?? timestamp,
            updatedAt: timestamp,
          },
        },
      };

      return commitState(nextState);
    },
    [commitState, state],
  );

  const saveReturnToSelfPractice = useCallback(
    (input: ReturnToSelfInput): StoreWriteResult<ReturnToSelfPractice> => {
      const timestamp = nowIso();
      const practiceId = createId("return_to_self");
      const accountImpacts = buildReturnToSelfImpacts(input, {
        sourceId: practiceId,
        createdAt: timestamp,
      });
      const practice: ReturnToSelfPractice = {
        id: practiceId,
        spaceId: input.spaceId,
        source: "return_to_self",
        completion: input.completion,
        accountImpacts,
        bodyAction: input.bodyAction,
        anchor: input.anchor,
        anchorSaved: input.anchorSaved,
        returnToLifeAction: input.returnToLifeAction,
        energyEffect: input.energyEffect,
        completedAt: timestamp,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      const savedAnchor =
        input.anchorSaved && input.anchor?.trim()
          ? {
              id: createId("anchor"),
              spaceId: input.spaceId,
              text: input.anchor.trim(),
              sourceType: "return_to_self" as const,
              sourceId: practiceId,
              createdAt: timestamp,
              updatedAt: timestamp,
            }
          : null;
      const nextState: AppState = {
        ...state,
        returnToSelfPractices: [...state.returnToSelfPractices, practice],
        anchors: savedAnchor ? [savedAnchor, ...state.anchors] : state.anchors,
      };
      const result = commitState(nextState);

      return result.ok ? { ...result, value: practice } : result;
    },
    [commitState, state],
  );

  const saveQuickRecord = useCallback(
    (input: QuickRecordInput): StoreWriteResult<Episode> => {
      const timestamp = nowIso();
      const episodeId = createId("episode");
      const accountImpacts = buildQuickRecordImpacts(input, {
        sourceId: episodeId,
        createdAt: timestamp,
      });
      const facts = input.facts.trim();
      const title = input.title?.trim() || "一次互动";
      const episode: Episode = {
        id: episodeId,
        spaceId: input.spaceId,
        source: input.source ?? "quick_record",
        title,
        facts,
        interpretation: input.interpretation?.trim() ?? "",
        emotions: input.emotions?.length ? input.emotions : ["not_sure"],
        bodySensations: input.bodySensations?.length ? input.bodySensations : ["not_sure"],
        connectionLevel: input.connectionLevel ?? "not_sure",
        activationLevel: input.activationLevel ?? "not_sure",
        nextAction: input.nextAction ?? "not_now",
        accountImpacts,
        draftId: input.draftId,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      const linkedTopic =
        input.nextAction === "save_later_topic"
          ? buildDiscoveryPoint(
              {
                spaceId: input.spaceId,
                title: input.laterTopic?.title ?? title,
                kind: "topic",
                sourceType: "episode",
                sourceId: episodeId,
                sourceTitle: title,
                sourceSnippet: facts,
                note: input.laterTopic?.note ?? "来自这次选择：保存一个话题。",
              },
              {
                id: createId("topic"),
                timestamp,
              },
            )
          : null;
      const nextState: AppState = {
        ...state,
        episodes: [episode, ...state.episodes],
        topics: linkedTopic ? [linkedTopic, ...state.topics] : state.topics,
        drafts: input.draftId
          ? state.drafts.filter((draft) => draft.id !== input.draftId)
          : state.drafts,
      };
      const result = commitState(nextState);

      return result.ok ? { ...result, value: episode } : result;
    },
    [commitState, state],
  );

  const saveDraft = useCallback(
    (input: DraftInput): StoreWriteResult<Draft> => {
      const timestamp = nowIso();
      const draftId = input.draftId ?? createId("draft");
      const existingDraft = state.drafts.find((draft) => draft.id === draftId);
      const draft: Draft = {
        id: draftId,
        spaceId: input.spaceId,
        kind: input.kind,
        data: input.data,
        createdAt: existingDraft?.createdAt ?? timestamp,
        updatedAt: timestamp,
      };
      const nextState: AppState = {
        ...state,
        drafts: [draft, ...state.drafts.filter((item) => item.id !== draftId)],
      };
      const result = commitState(nextState);

      return result.ok ? { ...result, value: draft } : result;
    },
    [commitState, state],
  );

  const saveDiscoveryPoint = useCallback(
    (input: DiscoveryPointInput): StoreWriteResult<DiscoveryPoint> => {
      const timestamp = nowIso();
      const { state: nextState, point } = addDiscoveryPointToState(state, input, {
        id: createId("topic"),
        timestamp,
      });
      const result = commitState(nextState);

      return result.ok ? { ...result, value: point } : result;
    },
    [commitState, state],
  );

  const saveAnchor = useCallback(
    (input: AnchorInput): StoreWriteResult<Anchor> => {
      const timestamp = nowIso();
      const { state: nextState, anchor } = addAnchorToState(state, input, {
        id: createId("anchor"),
        timestamp,
      });

      if (!anchor) {
        return { ok: true, savedAt: timestamp };
      }

      const result = commitState(nextState);
      return result.ok ? { ...result, value: anchor } : result;
    },
    [commitState, state],
  );

  const saveDiscoveryPoints = useCallback(
    (inputs: DiscoveryPointInput[]): StoreWriteResult<DiscoveryPoint[]> => {
      const timestamp = nowIso();

      if (!inputs.length) {
        return { ok: true, savedAt: timestamp, value: [] };
      }

      const { state: nextState, points } = addDiscoveryPointsToState(state, inputs, {
        ids: inputs.map(() => createId("topic")),
        timestamp,
      });
      const result = commitState(nextState);

      return result.ok ? { ...result, value: points } : result;
    },
    [commitState, state],
  );

  const updateDiscoveryPointStatus = useCallback(
    (input: DiscoveryPointStatusInput): StoreWriteResult<DiscoveryPoint> => {
      const timestamp = nowIso();
      const { state: nextState, point } = updateDiscoveryPointStatusInState(state, input, timestamp);

      if (!point) {
        return { ok: true, savedAt: timestamp };
      }

      const result = commitState(nextState);
      return result.ok ? { ...result, value: point } : result;
    },
    [commitState, state],
  );

  const updateDiscoveryPoint = useCallback(
    (input: DiscoveryPointUpdateInput): StoreWriteResult<DiscoveryPoint> => {
      const timestamp = nowIso();
      const { state: nextState, point } = updateDiscoveryPointInState(state, input, timestamp);

      if (!point) {
        return { ok: true, savedAt: timestamp };
      }

      const result = commitState(nextState);
      return result.ok ? { ...result, value: point } : result;
    },
    [commitState, state],
  );

  const updateDiscoveryPointReviewNote = useCallback(
    (input: DiscoveryPointReviewNoteInput): StoreWriteResult<DiscoveryPoint> => {
      const timestamp = nowIso();
      const { state: nextState, point } = updateDiscoveryPointNoteInState(state, input, timestamp);

      if (!point) {
        return { ok: true, savedAt: timestamp };
      }

      const result = commitState(nextState);
      return result.ok ? { ...result, value: point } : result;
    },
    [commitState, state],
  );

  const deleteDiscoveryPoint = useCallback(
    (input: DeleteDiscoveryPointInput): StoreWriteResult => {
      const { state: nextState, point } = deleteDiscoveryPointFromState(state, input);

      if (!point) {
        return { ok: true, savedAt: nowIso() };
      }

      return commitState(nextState);
    },
    [commitState, state],
  );

  const savePersonalExperiment = useCallback(
    (input: PersonalExperimentInput): StoreWriteResult<PersonalExperiment> => {
      const timestamp = nowIso();
      const { state: nextState, experiment } = addExperimentToState(stateRef.current, input, {
        id: createId("experiment"),
        timestamp,
      });
      const result = commitState(nextState);

      return result.ok ? { ...result, value: experiment } : result;
    },
    [commitState],
  );

  const updatePersonalExperiment = useCallback(
    (input: PersonalExperimentUpdateInput): StoreWriteResult<PersonalExperiment> => {
      const timestamp = nowIso();
      const { state: nextState, experiment } = updateExperimentInState(
        stateRef.current,
        input,
        timestamp,
      );

      if (!experiment) {
        return { ok: true, savedAt: timestamp };
      }

      const result = commitState(nextState);
      return result.ok ? { ...result, value: experiment } : result;
    },
    [commitState],
  );

  const updatePersonalExperimentStatus = useCallback(
    (input: PersonalExperimentStatusInput): StoreWriteResult<PersonalExperiment> => {
      const timestamp = nowIso();
      const { state: nextState, experiment } = updateExperimentStatusInState(
        stateRef.current,
        input,
        timestamp,
      );

      if (!experiment) {
        return { ok: true, savedAt: timestamp };
      }

      const result = commitState(nextState);
      return result.ok ? { ...result, value: experiment } : result;
    },
    [commitState],
  );

  const savePersonalExperimentDiscoveryPoint = useCallback(
    (input: { experimentId: string; note: string }): StoreWriteResult<DiscoveryPoint> => {
      const timestamp = nowIso();
      const experiment = stateRef.current.experiments.find((item) => item.id === input.experimentId);

      if (!experiment) {
        return { ok: true, savedAt: timestamp };
      }

      const { state: nextState, point } = addDiscoveryPointToState(
        stateRef.current,
        buildExperimentDiscoveryPointInput(experiment, input.note),
        {
          id: createId("topic"),
          timestamp,
        },
      );
      const result = commitState(nextState);

      return result.ok ? { ...result, value: point } : result;
    },
    [commitState],
  );

  const savePersonalExperimentAttempt = useCallback(
    (input: PersonalExperimentAttemptInput): StoreWriteResult<PersonalExperimentAttempt> => {
      const timestamp = nowIso();
      const { state: nextState, attempt } = addExperimentAttemptToState(stateRef.current, input, {
        id: createId("experiment_attempt"),
        timestamp,
      });

      if (!attempt) {
        return { ok: true, savedAt: timestamp };
      }

      const result = commitState(nextState);
      return result.ok ? { ...result, value: attempt } : result;
    },
    [commitState],
  );

  const deleteDraft = useCallback(
    (draftId: string): StoreWriteResult => {
      if (!state.drafts.some((draft) => draft.id === draftId)) {
        return { ok: true, savedAt: nowIso() };
      }

      return commitState({
        ...state,
        drafts: state.drafts.filter((draft) => draft.id !== draftId),
      });
    },
    [commitState, state],
  );

  const deleteEpisode = useCallback(
    (input: DeleteEpisodeInput): StoreWriteResult => {
      const { state: nextState, episode } = deleteEpisodeFromState(state, input);

      if (!episode) {
        return { ok: true, savedAt: nowIso() };
      }

      return commitState(nextState);
    },
    [commitState, state],
  );

  const resetLocalData = useCallback((): StoreWriteResult => {
    setStatus("resetting");
    const resetResult = adapterRef.current.reset();

    if (!resetResult.ok) {
      setStatus("reset_error");
      setStorageStatus(resetResult.status);
      setLastError(resetResult.error);
      return { ok: false, status: resetResult.status, error: resetResult.error };
    }

    const savedAt = nowIso();
    const nextState = createInitialState();
    stateRef.current = nextState;
    setState(nextState);
    setStatus("ready");
    setStorageStatus("available");
    setLastError(undefined);
    setLastSavedAt(savedAt);
    return { ok: true, savedAt };
  }, []);

  const replaceLocalData = useCallback(
    (nextState: AppState): StoreWriteResult => commitState(nextState),
    [commitState],
  );

  const acknowledgeStorageWarning = useCallback(() => {
    if (status === "storage_warning") {
      setStatus("ready");
    }
  }, [status]);

  const actions = useMemo<AppActions>(
    () => ({
      completeSetup,
      updateActiveSpace,
      updateDailyMarket,
      saveQuickRecord,
      saveReturnToSelfPractice,
      saveTriggerCompletion(input: TriggerCompletionInput): StoreNoWriteResult {
        return {
          ok: true,
          kind: "no_write",
          reason: input.reason ?? "not_saved",
        };
      },
      saveAnchor,
      saveDiscoveryPoint,
      saveDiscoveryPoints,
      updateDiscoveryPoint,
      updateDiscoveryPointStatus,
      updateDiscoveryPointReviewNote,
      deleteDiscoveryPoint,
      savePersonalExperiment,
      updatePersonalExperiment,
      updatePersonalExperimentStatus,
      savePersonalExperimentDiscoveryPoint,
      savePersonalExperimentAttempt,
      saveDraft,
      deleteDraft,
      deleteEpisode,
      replaceLocalData,
      resetLocalData,
      acknowledgeStorageWarning,
    }),
    [
      acknowledgeStorageWarning,
      completeSetup,
      replaceLocalData,
      resetLocalData,
      saveAnchor,
      saveDraft,
      deleteDraft,
      deleteDiscoveryPoint,
      deleteEpisode,
      saveDiscoveryPoint,
      saveDiscoveryPoints,
      updateDiscoveryPoint,
      saveQuickRecord,
      savePersonalExperiment,
      updatePersonalExperiment,
      updatePersonalExperimentStatus,
      savePersonalExperimentDiscoveryPoint,
      savePersonalExperimentAttempt,
      saveReturnToSelfPractice,
      updateActiveSpace,
      updateDiscoveryPointStatus,
      updateDiscoveryPointReviewNote,
      updateDailyMarket,
    ],
  );

  const store = useMemo<AppStore>(
    () => ({
      state,
      status,
      storageStatus,
      lastError,
      lastSavedAt,
      actions,
    }),
    [actions, lastError, lastSavedAt, state, status, storageStatus],
  );

  return <AppStoreContext.Provider value={store}>{children}</AppStoreContext.Provider>;
}

export function useAppStore(): AppStore {
  const store = useContext(AppStoreContext);

  if (!store) {
    throw new Error("useAppStore must be used inside AppStoreProvider.");
  }

  return store;
}

function loadState(loadResult: LoadResult): AppState {
  return loadResult.ok ? loadResult.state : loadResult.fallbackState;
}
