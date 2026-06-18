import { accountCopy, accountReasonCopy } from "../copy/accounts";
import type {
  AccountId,
  AccountImpact,
  AccountImpactReasonCode,
  AppState,
  EnergyEffect,
  QuickRecordInput,
  ReturnToSelfCompletion,
  ReturnToSelfInput,
  TriggerCompletionInput,
} from "./types";

export type AccountSummary = {
  account: AccountId;
  label: string;
  stateLabel: string;
  reason: string;
  value: number;
  latestImpact?: AccountImpact;
};

export type BuildImpactOptions = {
  sourceId: string;
  createdAt: string;
};

const USER_OWNED_NEXT_ACTIONS = new Set([
  "delay_10_min",
  "save_draft_do_not_send",
  "record_facts",
  "save_later_topic",
  "five_senses",
  "drink_water_wash_hands",
  "reply_one_point",
  "no_extra_message",
  "return_to_self",
  "save_quick_record",
]);

const TRIGGER_NO_WRITE_REASONS = new Set<NonNullable<TriggerCompletionInput["reason"]>>([
  "closed",
  "placeholder",
  "not_saved",
  "skipped",
]);

export function collectAccountImpacts(state: AppState): AccountImpact[] {
  return [
    ...state.episodes.flatMap((episode) => episode.accountImpacts),
    ...state.returnToSelfPractices.flatMap((practice) => practice.accountImpacts),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function deriveAccountSummary(account: AccountId, impacts: AccountImpact[]): AccountSummary {
  const accountImpacts = impacts.filter((impact) => impact.account === account);
  const value = accountImpacts.reduce((sum, impact) => sum + impact.value, 0);
  const latestImpact = accountImpacts[0];
  const copy = accountCopy[account];

  return {
    account,
    label: copy.label,
    value,
    stateLabel: value > 0 ? copy.positive : copy.empty,
    reason: latestImpact?.reason ?? copy.reminder,
    latestImpact,
  };
}

export function deriveAllAccountSummaries(state: AppState): AccountSummary[] {
  const impacts = collectAccountImpacts(state);

  return (["connection", "self", "energy"] as AccountId[]).map((account) =>
    deriveAccountSummary(account, impacts),
  );
}

export function buildQuickRecordImpacts(
  input: QuickRecordInput,
  options: BuildImpactOptions,
): AccountImpact[] {
  const impacts: AccountImpact[] = [];
  const facts = input.facts.trim();
  const interpretation = input.interpretation?.trim() ?? "";
  const connectionEvidence = input.connectionEvidence?.trim() ?? "";
  const selfContactEvidence = input.selfContactEvidence?.trim() ?? "";

  if (input.spaceType === "self" && selfContactEvidence) {
    impacts.push(
      createImpact({
        sourceType: "episode",
        sourceId: options.sourceId,
        account: "connection",
        value: 1,
        reasonCode: "self_contact_evidence",
        evidence: selfContactEvidence,
        createdAt: options.createdAt,
      }),
    );
  } else if (input.spaceType === "interpersonal" && connectionEvidence) {
    impacts.push(
      createImpact({
        sourceType: "episode",
        sourceId: options.sourceId,
        account: "connection",
        value: 1,
        reasonCode: "observable_connection_evidence",
        evidence: connectionEvidence,
        createdAt: options.createdAt,
      }),
    );
  }

  if (isOwnedNextAction(input.nextAction)) {
    impacts.push(
      createImpact({
        sourceType: "episode",
        sourceId: options.sourceId,
        account: "self",
        value: 1,
        reasonCode: "owned_next_action",
        evidence: input.nextAction,
        createdAt: options.createdAt,
      }),
    );
  } else if (facts && (interpretation || input.interpretationSkipped)) {
    impacts.push(
      createImpact({
        sourceType: "episode",
        sourceId: options.sourceId,
        account: "self",
        value: 1,
        reasonCode: "fact_interpretation_split",
        evidence: interpretation || "暂时不解释",
        createdAt: options.createdAt,
      }),
    );
  }

  const energyImpact = buildEnergyImpact("episode", options.sourceId, input.energyEffect, options.createdAt);
  if (energyImpact) {
    impacts.push(energyImpact);
  }

  return dedupeAccountImpacts(impacts);
}

export function buildTriggerCompletionImpacts(
  input: TriggerCompletionInput,
  options: BuildImpactOptions,
): AccountImpact[] {
  if (
    (input.reason && TRIGGER_NO_WRITE_REASONS.has(input.reason)) ||
    !input.completed ||
    input.savedAsQuickRecord ||
    !isOwnedNextAction(input.nextAction)
  ) {
    return [];
  }

  return [
    createImpact({
      sourceType: "trigger_completion",
      sourceId: options.sourceId,
      account: "self",
      value: 1,
      reasonCode: "trigger_owned_action",
      evidence: input.nextAction,
      createdAt: options.createdAt,
    }),
  ];
}

export function buildReturnToSelfImpacts(
  input: ReturnToSelfInput,
  options: BuildImpactOptions,
): AccountImpact[] {
  if (input.completion === "closed_early") {
    return [];
  }

  const impacts: AccountImpact[] = [];
  const selfReason = getReturnToSelfReason(input.completion);

  if (selfReason) {
    impacts.push(
      createImpact({
        sourceType: "return_to_self",
        sourceId: options.sourceId,
        account: "self",
        value: 1,
        reasonCode: selfReason,
        evidence: getReturnToSelfEvidence(input.completion),
        createdAt: options.createdAt,
      }),
    );
  }

  const energyImpact = buildEnergyImpact(
    "return_to_self",
    options.sourceId,
    input.energyEffect,
    options.createdAt,
  );
  if (energyImpact) {
    impacts.push(energyImpact);
  }

  return dedupeAccountImpacts(impacts);
}

export function isOwnedNextAction(action: string | undefined): boolean {
  return Boolean(action && USER_OWNED_NEXT_ACTIONS.has(action));
}

function getReturnToSelfReason(
  completion: ReturnToSelfCompletion,
): AccountImpactReasonCode | null {
  if (completion === "full") {
    return "return_to_self_completed";
  }

  if (completion === "noticed_need" || completion === "body_only") {
    return "return_to_self_partial_pause";
  }

  return null;
}

function getReturnToSelfEvidence(completion: ReturnToSelfCompletion): string {
  if (completion === "full") {
    return "full";
  }

  return completion === "body_only" ? "body_only" : "noticed_need";
}

function buildEnergyImpact(
  sourceType: AccountImpact["sourceType"],
  sourceId: string,
  energyEffect: EnergyEffect | undefined,
  createdAt: string,
): AccountImpact | null {
  if (energyEffect === "lighter") {
    return createImpact({
      sourceType,
      sourceId,
      account: "energy",
      value: 1,
      reasonCode: "energy_restored",
      evidence: energyEffect,
      createdAt,
    });
  }

  if (energyEffect === "more_tired") {
    return createImpact({
      sourceType,
      sourceId,
      account: "energy",
      value: -1,
      reasonCode: "energy_depleted",
      evidence: energyEffect,
      createdAt,
    });
  }

  return null;
}

function createImpact(input: Omit<AccountImpact, "id" | "reason">): AccountImpact {
  return {
    ...input,
    id: `${input.sourceType}_${input.sourceId}_${input.account}_${input.reasonCode}`,
    reason: accountReasonCopy[input.reasonCode],
  };
}

function dedupeAccountImpacts(impacts: AccountImpact[]): AccountImpact[] {
  const seenAccounts = new Set<AccountId>();
  const result: AccountImpact[] = [];

  for (const impact of impacts) {
    if (seenAccounts.has(impact.account)) {
      continue;
    }

    seenAccounts.add(impact.account);
    result.push(impact);
  }

  return result;
}
