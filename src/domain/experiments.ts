import { accountReasonCopy } from "../copy/accounts";
import type {
  AccountImpact,
  AppState,
  DiscoveryPoint,
  DiscoveryPointInput,
  PersonalExperiment,
  PersonalExperimentAttempt,
  PersonalExperimentAttemptInput,
  PersonalExperimentAttemptOutcome,
  PersonalExperimentInput,
  PersonalExperimentStatus,
  PersonalExperimentStatusInput,
  PersonalExperimentUpdateInput,
} from "./types";

export type ExperimentBuildOptions = {
  id: string;
  timestamp: string;
};

export type ExperimentAttemptBuildOptions = {
  id: string;
  timestamp: string;
};

export const experimentOutcomeCopy: Record<PersonalExperimentAttemptOutcome, string> = {
  completed: "完成了",
  partial: "完成一部分",
  noticed: "只是看见了",
  not_suitable: "不适合",
};

export const experimentOutcomeHelper: Record<PersonalExperimentAttemptOutcome, string> = {
  completed: "这次已经足够，不需要加码。",
  partial: "一部分也算练习过，不需要补考。",
  noticed: "看见也是练习的一种，不急着做到。",
  not_suitable: "不适合也有信息，是这次多了解了自己一点。",
};

export const experimentStatusCopy: Record<PersonalExperimentStatus, string> = {
  idea: "先存着",
  active: "正在练",
  paused: "先暂停",
  retired: "已收起",
};

export const experimentStatusHelper: Record<PersonalExperimentStatus, string> = {
  idea: "只是一个之后可以试的小想法，不急着开始。",
  active: "可以记录一次练习，也可以随时停一停。",
  paused: "它正在休息，不代表失败。",
  retired: "已经不需要继续练，但历史还在。",
};

export const experimentStatusOrder: PersonalExperimentStatus[] = [
  "active",
  "idea",
  "paused",
  "retired",
];

export function addExperimentToState(
  state: AppState,
  input: PersonalExperimentInput,
  options: ExperimentBuildOptions,
): { state: AppState; experiment: PersonalExperiment } {
  const experiment = buildPersonalExperiment(input, options);

  return {
    experiment,
    state: {
      ...state,
      experiments: [experiment, ...state.experiments],
    },
  };
}

export function addExperimentAttemptToState(
  state: AppState,
  input: PersonalExperimentAttemptInput,
  options: ExperimentAttemptBuildOptions,
): { state: AppState; experiment?: PersonalExperiment; attempt?: PersonalExperimentAttempt } {
  let updatedExperiment: PersonalExperiment | undefined;
  let createdAttempt: PersonalExperimentAttempt | undefined;
  const experiments = state.experiments.map((experiment) => {
    if (experiment.id !== input.experimentId) {
      return experiment;
    }

    createdAttempt = buildExperimentAttempt(input, options);
    updatedExperiment = {
      ...experiment,
      attempts: [createdAttempt, ...experiment.attempts],
      updatedAt: options.timestamp,
    };
    return updatedExperiment;
  });

  return {
    attempt: createdAttempt,
    experiment: updatedExperiment,
    state: {
      ...state,
      experiments,
    },
  };
}

export function buildPersonalExperiment(
  input: PersonalExperimentInput,
  options: ExperimentBuildOptions,
): PersonalExperiment {
  return {
    id: options.id,
    spaceId: input.spaceId,
    focus: input.focus.trim() || "练习一个小动作",
    tinyAction: input.tinyAction.trim() || "做一个今天能完成的小动作",
    completionMarker: input.completionMarker.trim() || "我试过一次就算",
    status: input.status ?? "active",
    source: input.source ?? "manual",
    sourceActionId: cleanOptional(input.sourceActionId),
    attempts: [],
    createdAt: options.timestamp,
    updatedAt: options.timestamp,
  };
}

export function buildDiscoveryPointExperimentInput(point: DiscoveryPoint): PersonalExperimentInput {
  const title = point.title.trim() || "一个发现点";
  const note = point.note?.trim();
  const exploreQuestion = point.exploreQuestion?.trim();
  const sourceSnippet = point.sourceSnippet?.trim();

  return {
    spaceId: point.spaceId,
    focus: `练习回应：${title}`,
    tinyAction: getDiscoveryPointTinyAction(point, note, exploreQuestion, sourceSnippet),
    completionMarker: "我试过一次，或只是看见自己愿不愿意试，就算练习过。",
    source: "discovery_point",
    sourceActionId: point.id,
  };
}

export function updateExperimentInState(
  state: AppState,
  input: PersonalExperimentUpdateInput,
  timestamp: string,
): { state: AppState; experiment?: PersonalExperiment } {
  let updatedExperiment: PersonalExperiment | undefined;
  const experiments = state.experiments.map((experiment) => {
    if (experiment.id !== input.id) {
      return experiment;
    }

    updatedExperiment = {
      ...experiment,
      focus: input.focus.trim() || experiment.focus,
      tinyAction: input.tinyAction.trim() || experiment.tinyAction,
      completionMarker: input.completionMarker.trim() || experiment.completionMarker,
      updatedAt: timestamp,
    };
    return updatedExperiment;
  });

  return {
    experiment: updatedExperiment,
    state: {
      ...state,
      experiments,
    },
  };
}

export function updateExperimentStatusInState(
  state: AppState,
  input: PersonalExperimentStatusInput,
  timestamp: string,
): { state: AppState; experiment?: PersonalExperiment } {
  let updatedExperiment: PersonalExperiment | undefined;
  const experiments = state.experiments.map((experiment) => {
    if (experiment.id !== input.id) {
      return experiment;
    }

    updatedExperiment = {
      ...experiment,
      status: input.status,
      updatedAt: timestamp,
    };
    return updatedExperiment;
  });

  return {
    experiment: updatedExperiment,
    state: {
      ...state,
      experiments,
    },
  };
}

export function buildExperimentDiscoveryPointInput(
  experiment: PersonalExperiment,
  note: string,
): DiscoveryPointInput {
  const trimmedNote = note.trim();

  return {
    spaceId: experiment.spaceId,
    title: `小练习：${experiment.focus}`,
    kind: trimmedNote ? "discovery" : "action_idea",
    theme: "action_experiment",
    note:
      trimmedNote ||
      `我想稍后再看这个小练习：${experiment.tinyAction}。什么算练习过一次：${experiment.completionMarker}`,
    sourceType: "manual",
    sourceTitle: experiment.focus,
    sourceSnippet: experiment.tinyAction,
  };
}

export function buildExperimentAttempt(
  input: PersonalExperimentAttemptInput,
  options: ExperimentAttemptBuildOptions,
): PersonalExperimentAttempt {
  return {
    id: options.id,
    outcome: input.outcome,
    note: cleanOptional(input.note),
    accountImpacts: buildExperimentAttemptImpacts(input, {
      sourceId: options.id,
      createdAt: options.timestamp,
    }),
    createdAt: options.timestamp,
    updatedAt: options.timestamp,
  };
}

export function buildExperimentAttemptImpacts(
  input: PersonalExperimentAttemptInput,
  options: { sourceId: string; createdAt: string },
): AccountImpact[] {
  if (input.outcome === "not_suitable") {
    return [];
  }

  const reasonCode =
    input.outcome === "completed"
      ? "experiment_completed"
      : input.outcome === "partial"
        ? "experiment_partial"
        : "experiment_noticed";

  const impacts: AccountImpact[] = [
    {
      id: `experiment_attempt_${options.sourceId}_self_${reasonCode}`,
      sourceType: "experiment_attempt",
      sourceId: options.sourceId,
      account: "self",
      value: 1,
      reasonCode,
      reason: accountReasonCopy[reasonCode],
      evidence: input.outcome,
      createdAt: options.createdAt,
    },
  ];

  if (input.outcome === "completed") {
    impacts.push({
      id: `experiment_attempt_${options.sourceId}_energy_energy_restored`,
      sourceType: "experiment_attempt",
      sourceId: options.sourceId,
      account: "energy",
      value: 1,
      reasonCode: "energy_restored",
      reason: accountReasonCopy.energy_restored,
      evidence: "lighter",
      createdAt: options.createdAt,
    });
  }

  return impacts;
}

export function getExperimentsNewestFirst(state: AppState): PersonalExperiment[] {
  return [...state.experiments].sort(sortExperiments);
}

export function getExperimentsByStatus(
  state: AppState,
  status: PersonalExperimentStatus | "all",
): PersonalExperiment[] {
  return getExperimentsNewestFirst(state).filter((experiment) =>
    status === "all" ? true : experiment.status === status,
  );
}

export function getExperimentById(
  state: AppState,
  experimentId: string | null,
): PersonalExperiment | null {
  if (!experimentId) {
    return null;
  }

  return state.experiments.find((experiment) => experiment.id === experimentId) ?? null;
}

function sortExperiments(a: PersonalExperiment, b: PersonalExperiment): number {
  const statusDifference = experimentStatusOrder.indexOf(a.status) - experimentStatusOrder.indexOf(b.status);

  if (statusDifference !== 0) {
    return statusDifference;
  }

  return b.createdAt.localeCompare(a.createdAt);
}

function cleanOptional(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function getDiscoveryPointTinyAction(
  point: DiscoveryPoint,
  note: string | undefined,
  exploreQuestion: string | undefined,
  sourceSnippet: string | undefined,
): string {
  if (point.kind === "question" && exploreQuestion) {
    return `只写一句：${exploreQuestion}`;
  }

  if (point.kind === "action_idea" && note) {
    return firstSentence(note);
  }

  if (note) {
    return `围绕这个点写一句可执行的小动作：${firstSentence(note)}`;
  }

  if (sourceSnippet) {
    return `先重读这一句，再写一个我能做的小动作：${firstSentence(sourceSnippet)}`;
  }

  return "围绕这个发现点，写一个今天能试一次的小动作。";
}

function firstSentence(value: string): string {
  const trimmed = value.trim();
  const [firstLine] = trimmed.split(/\n+/);
  return firstLine?.trim() || trimmed;
}
