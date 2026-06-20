export const SCHEMA_VERSION = 1;

export type AccountId = "connection" | "self" | "energy";

export type DailyMarket =
  | "observe"
  | "sensitive"
  | "triggered"
  | "sleep_deprived"
  | "low_energy"
  | "steady";

export type SpaceType = "interpersonal" | "self";

export type StorageStatus =
  | "available"
  | "unavailable"
  | "corrupted"
  | "unsupported_version";

export type EpisodeSource =
  | "quick_record"
  | "trigger_support"
  | "return_to_self_linked";

export type AccountImpactSourceType =
  | "episode"
  | "return_to_self"
  | "trigger_completion"
  | "experiment_attempt";

export type AccountImpactReasonCode =
  | "observable_connection_evidence"
  | "self_contact_evidence"
  | "fact_interpretation_split"
  | "owned_next_action"
  | "trigger_owned_action"
  | "return_to_self_completed"
  | "return_to_self_partial_pause"
  | "energy_depleted"
  | "energy_restored"
  | "energy_neutral"
  | "no_connection_evidence"
  | "experiment_completed"
  | "experiment_partial"
  | "experiment_noticed";

export type ConnectionLevel = 0 | 1 | 2 | 3 | 4 | "not_sure";
export type ActivationLevel = 0 | 1 | 2 | 3 | 4 | "not_sure";

export type ReturnToSelfCompletion =
  | "full"
  | "body_only"
  | "noticed_need"
  | "closed_early";

export type EnergyEffect = "lighter" | "same" | "more_tired" | "not_sure";

export type DiscoveryPointKind = "topic" | "discovery" | "question" | "action_idea";

export type DiscoveryPointTheme =
  | "emotion"
  | "boundary"
  | "old_echo"
  | "relationship_learning"
  | "expression"
  | "self_care"
  | "action_experiment";

export type DiscoveryPointStatus =
  | "stored_for_later"
  | "want_to_understand"
  | "want_to_share"
  | "leave_for_now"
  | "reviewed"
  | "naturally_reached"
  | "no_longer_needed";

export type DiscoveryPointSourceType =
  | "manual"
  | "episode"
  | "return_to_self"
  | "trigger"
  | "draft_check"
  | "rich_incoming";

export type EmotionalSpace = {
  id: string;
  displayName: string;
  description: string;
  type: SpaceType;
  defaultRecordingDepth: "quick" | "full";
  createdAt: string;
  updatedAt: string;
};

export type DailyMarketState = {
  id: string;
  date: string;
  market: DailyMarket;
  createdAt: string;
  updatedAt: string;
};

export type AccountImpact = {
  id: string;
  sourceType: AccountImpactSourceType;
  sourceId: string;
  account: AccountId;
  value: -1 | 0 | 1;
  reasonCode: AccountImpactReasonCode;
  reason: string;
  evidence?: string;
  createdAt: string;
};

export type Episode = {
  id: string;
  spaceId: string;
  source: EpisodeSource;
  title: string;
  facts: string;
  interpretation: string;
  emotions: string[];
  bodySensations: string[];
  connectionLevel: ConnectionLevel;
  activationLevel: ActivationLevel;
  nextAction: string;
  accountImpacts: AccountImpact[];
  anchor?: string;
  tags?: string[];
  returnToSelfPracticeId?: string;
  draftId?: string;
  createdAt: string;
  updatedAt: string;
};

export type ReturnToSelfPractice = {
  id: string;
  spaceId: string;
  source: "return_to_self";
  completion: ReturnToSelfCompletion;
  accountImpacts: AccountImpact[];
  bodyAction?: string;
  anchor?: string;
  anchorSaved?: boolean;
  returnToLifeAction?: string;
  energyEffect?: EnergyEffect;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type Anchor = {
  id: string;
  spaceId: string;
  text: string;
  sourceType?: "episode" | "return_to_self";
  sourceId?: string;
  createdAt: string;
  updatedAt: string;
};

export type Draft = {
  id: string;
  spaceId: string;
  kind: "quick_record";
  data: QuickRecordDraftData;
  createdAt: string;
  updatedAt: string;
};

export type AppSettings = {
  hasCompletedSetup: boolean;
  hasAcknowledgedLocalOnly: boolean;
};

export type ReservedItem = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type PersonalExperimentSource = "manual" | "personal_action";

export type PersonalExperimentAttemptOutcome =
  | "completed"
  | "partial"
  | "noticed"
  | "not_suitable";

export type PersonalExperimentAttempt = {
  id: string;
  outcome: PersonalExperimentAttemptOutcome;
  note?: string;
  accountImpacts: AccountImpact[];
  createdAt: string;
  updatedAt: string;
};

export type PersonalExperiment = {
  id: string;
  spaceId: string;
  focus: string;
  tinyAction: string;
  completionMarker: string;
  source: PersonalExperimentSource;
  sourceActionId?: string;
  attempts: PersonalExperimentAttempt[];
  createdAt: string;
  updatedAt: string;
};

export type DiscoveryPoint = {
  id: string;
  spaceId: string;
  title: string;
  kind: DiscoveryPointKind;
  status: DiscoveryPointStatus;
  sourceType: DiscoveryPointSourceType;
  sourceId?: string;
  sourceTitle?: string;
  sourceSnippet?: string;
  theme?: DiscoveryPointTheme;
  note?: string;
  exploreQuestion?: string;
  createdAt: string;
  updatedAt: string;
};

export type AppState = {
  schemaVersion: typeof SCHEMA_VERSION;
  spaces: EmotionalSpace[];
  activeSpaceId: string | null;
  dailyMarkets: Record<string, DailyMarketState>;
  episodes: Episode[];
  returnToSelfPractices: ReturnToSelfPractice[];
  anchors: Anchor[];
  drafts: Draft[];
  topics: DiscoveryPoint[];
  experiments: PersonalExperiment[];
  personalActions: ReservedItem[];
  settings: AppSettings;
};

export type SetupInput = {
  displayName: string;
  description: string;
  type: SpaceType;
  dailyMarket: DailyMarket;
};

export type DailyMarketInput = {
  market: DailyMarket;
};

export type QuickRecordInput = {
  spaceId: string;
  spaceType: SpaceType;
  draftId?: string;
  source?: EpisodeSource;
  title?: string;
  facts: string;
  interpretation?: string;
  interpretationSkipped?: boolean;
  emotions?: string[];
  bodySensations?: string[];
  connectionLevel?: ConnectionLevel;
  activationLevel?: ActivationLevel;
  nextAction?: string;
  connectionEvidence?: string;
  selfContactEvidence?: string;
  energyEffect?: EnergyEffect;
  laterTopic?: {
    title?: string;
    note?: string;
  };
};

export type QuickRecordDraftData = {
  source?: EpisodeSource;
  title?: string;
  facts?: string;
  interpretation?: string;
  interpretationSkipped?: boolean;
  emotions?: string[];
  bodySensations?: string[];
  connectionLevel?: ConnectionLevel;
  activationLevel?: ActivationLevel;
  nextAction?: string;
  connectionEvidence?: string;
  selfContactEvidence?: string;
  energyEffect?: EnergyEffect;
};

export type QuickRecordPrefill = {
  source: EpisodeSource;
  title?: string;
  facts?: string;
  emotions?: string[];
  bodySensations?: string[];
  activationLevel?: ActivationLevel;
  nextAction?: string;
};

export type ReturnToSelfInput = {
  spaceId: string;
  completion: ReturnToSelfCompletion;
  bodyAction?: string;
  anchor?: string;
  anchorSaved?: boolean;
  returnToLifeAction?: string;
  energyEffect?: EnergyEffect;
};

export type TriggerCompletionInput = {
  reason?: "closed" | "placeholder" | "not_saved" | "skipped";
  completed?: boolean;
  nextAction?: string;
  savedAsQuickRecord?: boolean;
};

export type DiscoveryPointInput = {
  spaceId: string;
  title: string;
  kind: DiscoveryPointKind;
  theme?: DiscoveryPointTheme;
  note?: string;
  exploreQuestion?: string;
  sourceType?: DiscoveryPointSourceType;
  sourceId?: string;
  sourceTitle?: string;
  sourceSnippet?: string;
};

export type DiscoveryPointStatusInput = {
  id: string;
  status: DiscoveryPointStatus;
};

export type DiscoveryPointReviewNoteInput = {
  id: string;
  note: string;
};

export type AnchorInput = {
  spaceId: string;
  text: string;
  sourceType?: Anchor["sourceType"];
  sourceId?: string;
};

export type PersonalExperimentInput = {
  spaceId: string;
  focus: string;
  tinyAction: string;
  completionMarker: string;
  source?: PersonalExperimentSource;
  sourceActionId?: string;
};

export type PersonalExperimentAttemptInput = {
  experimentId: string;
  outcome: PersonalExperimentAttemptOutcome;
  note?: string;
};

export type DraftInput = {
  draftId?: string;
  spaceId: string;
  kind: "quick_record";
  data: QuickRecordDraftData;
};

export type StoreWriteResult<T = void> =
  | { ok: true; value?: T; savedAt: string }
  | { ok: false; status: StorageStatus; error?: string; inMemoryOnly?: boolean };

export type StoreNoWriteResult = {
  ok: true;
  kind: "no_write";
  reason: "closed" | "placeholder" | "not_saved" | "skipped";
};
