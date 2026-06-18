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
  AppState,
  DailyMarketInput,
  Draft,
  DraftInput,
  Episode,
  QuickRecordInput,
  ReturnToSelfInput,
  ReturnToSelfPractice,
  SetupInput,
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
  updateDailyMarket(input: DailyMarketInput): StoreWriteResult;
  saveQuickRecord(input: QuickRecordInput): StoreWriteResult<Episode>;
  saveReturnToSelfPractice(input: ReturnToSelfInput): StoreWriteResult<ReturnToSelfPractice>;
  saveTriggerCompletion(input: TriggerCompletionInput): StoreWriteResult | StoreNoWriteResult;
  saveDraft(input: DraftInput): StoreWriteResult<Draft>;
  deleteDraft(draftId: string): StoreWriteResult;
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
    setState(createInitialState());
    setStatus("ready");
    setStorageStatus("available");
    setLastError(undefined);
    setLastSavedAt(savedAt);
    return { ok: true, savedAt };
  }, []);

  const acknowledgeStorageWarning = useCallback(() => {
    if (status === "storage_warning") {
      setStatus("ready");
    }
  }, [status]);

  const actions = useMemo<AppActions>(
    () => ({
      completeSetup,
      updateDailyMarket,
      saveQuickRecord: unimplementedWrite,
      saveReturnToSelfPractice: unimplementedWrite,
      saveTriggerCompletion(input: TriggerCompletionInput): StoreNoWriteResult {
        return {
          ok: true,
          kind: "no_write",
          reason: input.reason ?? "not_saved",
        };
      },
      saveDraft: unimplementedWrite,
      deleteDraft: unimplementedWrite,
      resetLocalData,
      acknowledgeStorageWarning,
    }),
    [acknowledgeStorageWarning, completeSetup, resetLocalData, updateDailyMarket],
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

function unimplementedWrite(): StoreWriteResult<never> {
  return {
    ok: false,
    status: "unavailable",
    error: "This route is not implemented yet.",
  };
}
