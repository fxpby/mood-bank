import type { DiscoveryPointInput } from "./types";

export type ConnectionContinuityState =
  | "still_there_far"
  | "feels_gone"
  | "urge_confirm"
  | "urge_cut_off"
  | "push_pull"
  | "self_disconnected"
  | "not_sure";

export type ConnectionContinuityAction =
  | "delay_ten"
  | "look_warm_evidence"
  | "facts_not_conclusions"
  | "return_to_self"
  | "save_later_topic"
  | "close";

export type ConnectionContinuityInput = {
  spaceId: string;
  state: ConnectionContinuityState;
  existedEvidence?: string;
  cannotProve?: string;
  action: ConnectionContinuityAction;
};

export const connectionContinuityStateCopy: Record<ConnectionContinuityState, string> = {
  still_there_far: "连接还在，只是现在变远了",
  feels_gone: "我感觉连接已经消失了",
  urge_confirm: "我想马上确认它还在",
  urge_cut_off: "我想切断/装作不在乎",
  push_pull: "我一边想靠近，一边想逃开",
  self_disconnected: "我和自己的身体、需要或现实接不上",
  not_sure: "说不清，只知道连接感很响",
};

export const connectionContinuityActionCopy: Record<ConnectionContinuityAction, string> = {
  delay_ten: "延迟 10 分钟再决定",
  look_warm_evidence: "看一个已存下的温暖证据",
  facts_not_conclusions: "只写事实，不写结论",
  return_to_self: "先回到自己",
  save_later_topic: "把这个点存到稍后",
  close: "到这里就好",
};

export function getConnectionContinuitySummary(input: ConnectionContinuityInput): {
  state: string;
  existedEvidence: string;
  cannotProve: string;
  action: string;
  calibration: string;
} {
  return {
    state: connectionContinuityStateCopy[input.state],
    existedEvidence: input.existedEvidence?.trim() || getDefaultExistedEvidence(input),
    cannotProve: input.cannotProve?.trim() || getDefaultCannotProve(input),
    action: connectionContinuityActionCopy[input.action],
    calibration: getConnectionContinuityCalibration(input),
  };
}

export function buildConnectionContinuityDiscoveryPointInput(
  input: ConnectionContinuityInput,
): DiscoveryPointInput {
  const summary = getConnectionContinuitySummary(input);

  return {
    spaceId: input.spaceId,
    title: "连接感：事实和感觉先分开",
    kind: input.action === "save_later_topic" ? "topic" : "discovery",
    theme: "relationship_learning",
    sourceType: "manual",
    sourceTitle: "连接感轻检查",
    sourceSnippet: summary.cannotProve,
    note: [
      `此刻连接感：${summary.state}`,
      `曾经存在的事实/自我接触：${summary.existedEvidence}`,
      `现在还不能证明：${summary.cannotProve}`,
      `我负责的一步：${summary.action}`,
      `校准：${summary.calibration}`,
    ].join("\n"),
    exploreQuestion: getConnectionContinuityExploreQuestion(input),
  };
}

function getDefaultExistedEvidence(input: ConnectionContinuityInput): string {
  if (input.state === "self_disconnected") {
    return "我仍然能从一个身体感觉、一个事实或一个需要开始接回自己。";
  }

  if (input.state === "still_there_far") {
    return "连接感变远，不等于过去发生过的真实接触被抹掉。";
  }

  return "我可以先记得：曾经有过一句话、一个动作或一个时刻，让我感到连接存在过。";
}

function getDefaultCannotProve(input: ConnectionContinuityInput): string {
  if (input.state === "urge_cut_off") {
    return "想切断不能证明我不在乎，也不能证明关系已经没有意义。";
  }

  if (input.state === "push_pull") {
    return "靠近和逃开同时出现，不能证明我矛盾失败，只说明此刻很激活。";
  }

  if (input.state === "self_disconnected") {
    return "我现在接不上自己，不能证明我没有需要、没有价值或没有选择。";
  }

  return "此刻没有新信号，不能证明连接已经消失、我不重要或未来结束。";
}

function getConnectionContinuityCalibration(input: ConnectionContinuityInput): string {
  if (input.state === "still_there_far") {
    return "连接感可以变远，但事实不需要跟着一起消失。";
  }

  if (input.state === "feels_gone" || input.state === "urge_confirm") {
    return "感觉像消失，不等于事实已经消失。先给自己一点时间，再决定动作。";
  }

  if (input.state === "urge_cut_off") {
    return "切断冲动可能是在保护自己。可以先暂停，而不是用撤回来证明不痛。";
  }

  if (input.state === "push_pull") {
    return "一边靠近一边想逃，是高激活下的拉扯，不是人格或关系判决。";
  }

  if (input.state === "self_disconnected") {
    return "先和自己接上，再判断关系。自我接触也是连接的一部分。";
  }

  return "说不清也可以先慢一点。先把事实和感觉分开放。";
}

function getConnectionContinuityExploreQuestion(input: ConnectionContinuityInput): string {
  if (input.state === "urge_confirm") {
    return "如果我先不确认，接下来 10 分钟可以靠什么维持稳定？";
  }

  if (input.state === "urge_cut_off") {
    return "我想切断时，真正想保护的是什么？";
  }

  if (input.state === "self_disconnected") {
    return "此刻我能从哪个身体感觉、需要或事实重新接回自己？";
  }

  return "此刻消失的是事实，还是我的连接感？";
}
