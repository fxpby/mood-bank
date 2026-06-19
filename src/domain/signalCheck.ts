import type { DiscoveryPointInput, DiscoveryPointTheme } from "./types";

export type SignalCheckTarget =
  | "care"
  | "cold_connection"
  | "ignored"
  | "my_fault"
  | "new_action"
  | "send_again"
  | "relationship_future"
  | "ease_anxiety"
  | "not_sure";

export type GoodSignalReaction =
  | "relieved"
  | "want_more"
  | "move_closer"
  | "fantasize_future"
  | "fear_losing"
  | "still_unsure"
  | "can_stop"
  | "not_sure";

export type AbsentSignalReaction =
  | "keep_refreshing"
  | "over_explain"
  | "question_them"
  | "connection_gone"
  | "self_blame"
  | "cut_off"
  | "ruminate_sleep"
  | "can_pause"
  | "not_sure";

export type SignalCheckAction =
  | "five_senses"
  | "drink_water_wash_hands"
  | "walk_one_minute"
  | "phone_down_10"
  | "draft_tomorrow"
  | "facts_not_conclusions"
  | "warm_evidence"
  | "return_to_self"
  | "still_check";

export type SignalCheckResult = "lighter" | "want_more" | "more_anxious" | "same" | "skip";

export type SignalCheckSaveInput = {
  spaceId: string;
  target: SignalCheckTarget;
  goodReaction: GoodSignalReaction;
  absentReaction: AbsentSignalReaction;
  action: SignalCheckAction;
  result?: SignalCheckResult;
};

export const signalCheckTargetCopy: Record<SignalCheckTarget, string> = {
  care: "对方还在不在乎",
  cold_connection: "连接有没有变冷",
  ignored: "我有没有被忽略",
  my_fault: "我是不是做错了",
  new_action: "对方有没有新动作",
  send_again: "我是不是需要再发一句",
  relationship_future: "这段关系有没有希望",
  ease_anxiety: "我只是想缓解不安",
  not_sure: "说不清",
};

export const goodSignalReactionCopy: Record<GoodSignalReaction, string> = {
  relieved: "松一口气",
  want_more: "想继续看更多",
  move_closer: "想马上回应/靠近",
  fantasize_future: "开始幻想未来",
  fear_losing: "担心好信号会消失",
  still_unsure: "还是不够确定",
  can_stop: "可以停下",
  not_sure: "说不清",
};

export const absentSignalReactionCopy: Record<AbsentSignalReaction, string> = {
  keep_refreshing: "继续刷新",
  over_explain: "想补发解释",
  question_them: "想质问",
  connection_gone: "觉得连接消失",
  self_blame: "开始自责",
  cut_off: "想切断",
  ruminate_sleep: "睡不着复盘",
  can_pause: "可以先停一下",
  not_sure: "说不清",
};

export const signalCheckActionCopy: Record<SignalCheckAction, string> = {
  five_senses: "五感落地",
  drink_water_wash_hands: "喝水/洗手",
  walk_one_minute: "走动 1 分钟",
  phone_down_10: "把手机扣下 10 分钟",
  draft_tomorrow: "保存草稿到明天",
  facts_not_conclusions: "写下事实，不写结论",
  warm_evidence: "看一个已存下的温暖证据",
  return_to_self: "回到自己",
  still_check: "我还是想检查",
};

export const signalCheckResultCopy: Record<SignalCheckResult, string> = {
  lighter: "检查后轻了一点",
  want_more: "检查后更想继续看",
  more_anxious: "检查后更不安",
  same: "没有变化",
  skip: "我不想记录",
};

export function buildSignalCheckDiscoveryPointInput(
  input: SignalCheckSaveInput,
): DiscoveryPointInput {
  const targetLabel = signalCheckTargetCopy[input.target];
  const actionLabel = signalCheckActionCopy[input.action];
  const resultLabel = input.result ? signalCheckResultCopy[input.result] : undefined;
  const isCheckingPath = input.action === "still_check";

  return {
    spaceId: input.spaceId,
    title: isCheckingPath ? `想检查信号：${targetLabel}` : `10 分钟缓冲：${actionLabel}`,
    kind: isCheckingPath ? "discovery" : "action_idea",
    theme: getTheme(input),
    sourceType: "manual",
    note: [
      `想确认：${targetLabel}`,
      `如果是好信号：${goodSignalReactionCopy[input.goodReaction]}`,
      `如果没有信号：${absentSignalReactionCopy[input.absentReaction]}`,
      `这次选择：${actionLabel}`,
      resultLabel ? `检查后：${resultLabel}` : undefined,
    ]
      .filter(Boolean)
      .join("\n"),
    exploreQuestion: isCheckingPath
      ? "我想通过检查把什么交给外面的信号来决定？"
      : "这 10 分钟里，什么动作最能把主动权带回来一点？",
  };
}

function getTheme(input: SignalCheckSaveInput): DiscoveryPointTheme {
  if (input.action !== "still_check") {
    return "action_experiment";
  }

  if (
    input.target === "my_fault" ||
    input.absentReaction === "self_blame" ||
    input.absentReaction === "ruminate_sleep"
  ) {
    return "old_echo";
  }

  return "emotion";
}
