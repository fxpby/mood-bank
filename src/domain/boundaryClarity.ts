import type { DiscoveryPointInput } from "./types";

export type BoundarySignal =
  | "guilt"
  | "resentment"
  | "anger"
  | "pressure"
  | "fear_disappoint"
  | "fear_disappear"
  | "over_explain"
  | "rescue"
  | "control_result"
  | "hard_no"
  | "hard_receive_no"
  | "not_sure";

export type BoundaryMine =
  | "feelings"
  | "expression"
  | "choice"
  | "repair"
  | "time_energy"
  | "real_limits";

export type BoundaryNotMine =
  | "others_feelings"
  | "others_understand_now"
  | "others_disappointment"
  | "others_choice"
  | "others_reply"
  | "relationship_result";

export type BoundaryLimit =
  | "reply_later"
  | "cannot_hold_all"
  | "one_point"
  | "need_rest"
  | "not_this_tone"
  | "ask_concrete_request"
  | "repair_no_attack"
  | "cannot_say_yes"
  | "care_not_take_over"
  | "need_time";

export type BoundaryForm =
  | "language"
  | "time"
  | "attention"
  | "emotional_distance"
  | "physical_distance"
  | "support"
  | "owned_consequence"
  | "digital";

export type BoundaryPractice =
  | "say_no"
  | "delay_yes"
  | "explain_less"
  | "allow_disappointment"
  | "receive_no"
  | "no_not_disappear"
  | "no_counterattack_please"
  | "not_sure";

export type BoundaryNextAction =
  | "save_draft_tomorrow"
  | "no_extra_message"
  | "ten_min_no_checking"
  | "respond_one_point"
  | "pause_conversation"
  | "leave_scene"
  | "ask_trusted_person"
  | "save_later_topic"
  | "draft_check"
  | "return_to_self"
  | "create_experiment";

export type BoundaryClarityInput = {
  spaceId: string;
  signal: BoundarySignal;
  mine: BoundaryMine;
  notMine: BoundaryNotMine;
  limit: BoundaryLimit;
  limitSentence?: string;
  form: BoundaryForm;
  practice: BoundaryPractice;
  nextAction: BoundaryNextAction;
};

export const boundarySignalCopy: Record<BoundarySignal, string> = {
  guilt: "内疚",
  resentment: "怨气",
  anger: "愤怒",
  pressure: "压力很大",
  fear_disappoint: "害怕对方失望",
  fear_disappear: "害怕连接消失",
  over_explain: "想解释很多",
  rescue: "想拯救/接住对方",
  control_result: "想控制结果",
  hard_no: "不想答应但说不出口",
  hard_receive_no: "对方说了不，我很难承受",
  not_sure: "说不清",
};

export const boundaryMineCopy: Record<BoundaryMine, string> = {
  feelings: "我的感受",
  expression: "我的表达",
  choice: "我的选择",
  repair: "我的道歉/修复",
  time_energy: "我的时间和精力",
  real_limits: "我的真实限度",
};

export const boundaryNotMineCopy: Record<BoundaryNotMine, string> = {
  others_feelings: "对方的感受",
  others_understand_now: "对方是否立刻理解",
  others_disappointment: "对方是否失望",
  others_choice: "对方的选择",
  others_reply: "对方要不要回应",
  relationship_result: "关系结果",
};

export const boundaryLimitCopy: Record<BoundaryLimit, string> = {
  reply_later: "我需要晚点回复",
  cannot_hold_all: "我不能现在接住全部",
  one_point: "我只能回应一个重点",
  need_rest: "我需要先睡觉/休息",
  not_this_tone: "我不想继续这个语气",
  ask_concrete_request: "我需要对方说具体请求",
  repair_no_attack: "我愿意修复，但不接受攻击",
  cannot_say_yes: "我现在不能答应",
  care_not_take_over: "我可以关心，但不接管",
  need_time: "我需要先想清楚",
};

export const boundaryFormCopy: Record<BoundaryForm, string> = {
  language: "语言：说不/提出请求",
  time: "时间：晚点回复/延迟决定",
  attention: "注意力：不反复检查/不重读",
  emotional_distance: "情绪距离：先冷却再决定",
  physical_distance: "身体距离：离开现场/换个空间",
  support: "支持：找真人支持",
  owned_consequence: "后果：我会采取的下一步",
  digital: "数字边界：不补发/不夜间检查",
};

export const boundaryPracticeCopy: Record<BoundaryPractice, string> = {
  say_no: "我需要说不",
  delay_yes: "我需要晚点答应",
  explain_less: "我需要少解释一点",
  allow_disappointment: "我需要允许对方失望",
  receive_no: "我需要接住对方的 no",
  no_not_disappear: "我需要不把 no 当成消失",
  no_counterattack_please: "我需要不反击/不讨好",
  not_sure: "说不清",
};

export const boundaryNextActionCopy: Record<BoundaryNextAction, string> = {
  save_draft_tomorrow: "保存草稿到明天",
  no_extra_message: "今晚不补发",
  ten_min_no_checking: "10 分钟不检查",
  respond_one_point: "只回应一个重点",
  pause_conversation: "暂停对话",
  leave_scene: "离开让我失控的场景",
  ask_trusted_person: "找一个可信任的人聊",
  save_later_topic: "把话题放进稍后",
  draft_check: "进入草稿自检",
  return_to_self: "回到自己",
  create_experiment: "创建小练习",
};

export function getBoundaryClaritySummary(input: BoundaryClarityInput): {
  signal: string;
  mine: string;
  notMine: string;
  limit: string;
  limitSentence: string;
  form: string;
  practice: string;
  nextAction: string;
  calibration: string;
} {
  return {
    signal: boundarySignalCopy[input.signal],
    mine: boundaryMineCopy[input.mine],
    notMine: boundaryNotMineCopy[input.notMine],
    limit: boundaryLimitCopy[input.limit],
    limitSentence: input.limitSentence?.trim() || "先用上面的限度作为临时句子。",
    form: boundaryFormCopy[input.form],
    practice: boundaryPracticeCopy[input.practice],
    nextAction: boundaryNextActionCopy[input.nextAction],
    calibration: getBoundaryCalibration(input),
  };
}

export function buildBoundaryClarityDiscoveryPointInput(
  input: BoundaryClarityInput,
): DiscoveryPointInput {
  const summary = getBoundaryClaritySummary(input);

  return {
    spaceId: input.spaceId,
    title: "边界清晰：一次责任分开",
    kind: input.nextAction === "save_later_topic" ? "topic" : "action_idea",
    theme: "boundary",
    sourceType: "manual",
    sourceTitle: "边界清晰轻检查",
    sourceSnippet: `${summary.mine} / 不是我的：${summary.notMine}`,
    note: [
      `边界信号：${summary.signal}`,
      `我的部分：${summary.mine}`,
      `不是我的部分：${summary.notMine}`,
      `真实限度 / 请求：${summary.limit}`,
      `我的一句话：${summary.limitSentence}`,
      `边界形式：${summary.form}`,
      `这次练习：${summary.practice}`,
      `我负责的下一步：${summary.nextAction}`,
      `校准：${summary.calibration}`,
    ].join("\n"),
    exploreQuestion: getBoundaryExploreQuestion(input),
  };
}

function getBoundaryCalibration(input: BoundaryClarityInput): string {
  if (input.signal === "anger") {
    return "愤怒不一定是坏事。它可能在提醒：有边界、限度或重要需要被碰到。";
  }

  if (input.signal === "guilt") {
    return "内疚可能在提醒有爱，也可能在逼我越过自己的界限。先分清责任。";
  }

  if (input.signal === "fear_disappear" || input.practice === "no_not_disappear") {
    return "害怕连接消失可以被看见，但 no 不等于我不存在。";
  }

  if (input.form === "owned_consequence") {
    return "后果是我会做什么，不是威胁对方必须怎样。";
  }

  return "边界不是冷漠，是把能给和不能给说清楚。";
}

function getBoundaryExploreQuestion(input: BoundaryClarityInput): string {
  if (input.notMine === "others_disappointment") {
    return "如果对方失望，我能不能允许那是对方的感受，而不立刻变成我的责任？";
  }

  if (input.signal === "rescue" || input.signal === "control_result") {
    return "我正在想接管什么？有没有一个关心但不接管的动作？";
  }

  if (input.form === "digital") {
    return "我可以怎样把手机边界变成一个只属于我的小动作？";
  }

  return "这件事里，什么是我的责任，什么不是我的责任？";
}
