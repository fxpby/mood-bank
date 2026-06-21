import type { DiscoveryPointInput } from "./types";

export type RepairWantUnderstood =
  | "my_feeling"
  | "my_intent"
  | "my_limit"
  | "impact_on_me"
  | "care_under_conflict"
  | "need_for_repair"
  | "not_sure";

export type RepairMayNotUnderstand =
  | "their_feeling"
  | "their_limit"
  | "their_intent"
  | "their_context"
  | "my_impact"
  | "timing_capacity"
  | "not_sure";

export type RepairMyPart =
  | "name_feeling_cleanly"
  | "own_my_impact"
  | "apologize_specific"
  | "ask_without_pressing"
  | "stop_over_explaining"
  | "hold_boundary"
  | "wait_for_capacity"
  | "not_sure";

export type RepairNextDirection =
  | "repair_attempt"
  | "ask_to_understand"
  | "name_boundary"
  | "wait"
  | "later_topic"
  | "draft_check"
  | "healthy_love"
  | "return_to_self"
  | "close";

export type RepairUnderstandingInput = {
  spaceId: string;
  wantUnderstood: RepairWantUnderstood;
  mayNotUnderstand: RepairMayNotUnderstand;
  myPart: RepairMyPart;
  nextDirection: RepairNextDirection;
  note?: string;
};

export const repairWantUnderstoodCopy: Record<RepairWantUnderstood, string> = {
  my_feeling: "我的感受不是小题大做",
  my_intent: "我的本意不是攻击/控制",
  my_limit: "我有一个真实限度",
  impact_on_me: "这件事对我的影响",
  care_under_conflict: "我还在乎，但我也受伤/紧张",
  need_for_repair: "我需要一点修复，而不是假装没事",
  not_sure: "说不清，只知道我想被理解一点",
};

export const repairMayNotUnderstandCopy: Record<RepairMayNotUnderstand, string> = {
  their_feeling: "对方当时的感受",
  their_limit: "对方的限度或容量",
  their_intent: "对方的本意可能不等于我的感受",
  their_context: "对方当时的背景/处境",
  my_impact: "我的表达可能给对方造成的影响",
  timing_capacity: "这是不是一个适合修复的时间点",
  not_sure: "说不清，先承认我还没理解全部",
};

export const repairMyPartCopy: Record<RepairMyPart, string> = {
  name_feeling_cleanly: "把感受说清楚，不扩大成指控",
  own_my_impact: "承认我造成的影响",
  apologize_specific: "为具体部分道歉",
  ask_without_pressing: "提出一个问题，但不逼对方立刻回答",
  stop_over_explaining: "停止过度解释/补发",
  hold_boundary: "说清边界，不用撤回关心",
  wait_for_capacity: "等双方更有容量再谈",
  not_sure: "先不急着定责，只保留一点好奇",
};

export const repairNextDirectionCopy: Record<RepairNextDirection, string> = {
  repair_attempt: "做一次很小的修复尝试",
  ask_to_understand: "问一个为了理解的问题",
  name_boundary: "先说清一个边界",
  wait: "先等一等，不马上推进",
  later_topic: "放进稍后话题",
  draft_check: "先去草稿自检",
  healthy_love: "学习怎么爱/被爱",
  return_to_self: "先回到自己",
  close: "到这里就好",
};

export function getRepairUnderstandingSummary(input: RepairUnderstandingInput): {
  wantUnderstood: string;
  mayNotUnderstand: string;
  myPart: string;
  nextDirection: string;
  note: string;
  calibration: string;
} {
  return {
    wantUnderstood: repairWantUnderstoodCopy[input.wantUnderstood],
    mayNotUnderstand: repairMayNotUnderstandCopy[input.mayNotUnderstand],
    myPart: repairMyPartCopy[input.myPart],
    nextDirection: repairNextDirectionCopy[input.nextDirection],
    note: input.note?.trim() || getDefaultRepairNote(input),
    calibration: getRepairCalibration(input),
  };
}

export function buildRepairUnderstandingDiscoveryPointInput(
  input: RepairUnderstandingInput,
): DiscoveryPointInput {
  const summary = getRepairUnderstandingSummary(input);

  return {
    spaceId: input.spaceId,
    title: "修复/理解：一次冲突后的看见",
    kind: input.nextDirection === "later_topic" ? "topic" : "discovery",
    theme: "relationship_learning",
    sourceType: "manual",
    sourceTitle: "修复/理解轻检查",
    sourceSnippet: summary.note,
    note: [
      `我想被理解的是：${summary.wantUnderstood}`,
      `我可能还没理解的是：${summary.mayNotUnderstand}`,
      `我能负责的部分：${summary.myPart}`,
      `下一方向：${summary.nextDirection}`,
      `补充：${summary.note}`,
      `校准：${summary.calibration}`,
    ].join("\n"),
    exploreQuestion: getRepairExploreQuestion(input),
  };
}

function getDefaultRepairNote(input: RepairUnderstandingInput): string {
  if (input.myPart === "own_my_impact" || input.myPart === "apologize_specific") {
    return "我可以为具体影响负责，但不需要把整件事都背到自己身上。";
  }

  if (input.nextDirection === "wait" || input.myPart === "wait_for_capacity") {
    return "等待不等于冷漠，也可能是在保护修复的质量。";
  }

  if (input.mayNotUnderstand === "their_intent") {
    return "我的受伤是真的，但对方的本意还需要被慢慢确认，而不是被我直接判定。";
  }

  if (input.wantUnderstood === "care_under_conflict") {
    return "冲突里仍然有在乎，只是此刻需要更清楚的表达和边界。";
  }

  return "修复可以从理解一点点开始，不需要一次解决整段关系。";
}

function getRepairCalibration(input: RepairUnderstandingInput): string {
  if (input.nextDirection === "name_boundary" || input.myPart === "hold_boundary") {
    return "修复不是自我消失。边界清楚时，理解才不靠委屈维持。";
  }

  if (input.myPart === "apologize_specific" || input.myPart === "own_my_impact") {
    return "负责是为具体影响负责，不是把所有痛苦都归咎于自己。";
  }

  if (input.nextDirection === "return_to_self") {
    return "现在容量不够时，先回到自己也是修复的一部分。";
  }

  if (input.mayNotUnderstand === "timing_capacity") {
    return "好的修复也需要时间点和容量，不是越快越真诚。";
  }

  return "修复不是赢，也不是忍；它需要理解、责任和边界同时在。";
}

function getRepairExploreQuestion(input: RepairUnderstandingInput): string {
  if (input.myPart === "apologize_specific" || input.myPart === "own_my_impact") {
    return "我能为哪一个具体影响负责，而不是把自己整个否定掉？";
  }

  if (input.nextDirection === "name_boundary") {
    return "如果继续修复，我需要先说清哪一个真实限度？";
  }

  if (input.mayNotUnderstand === "my_impact") {
    return "我的表达可能让对方接收到什么，我可以怎样确认而不是猜测？";
  }

  return "如果目标是理解而不是赢，我现在能做的一小步是什么？";
}
