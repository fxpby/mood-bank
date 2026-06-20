import type { DiscoveryPointInput } from "./types";

export type EmpowermentCurrentStance =
  | "powerless"
  | "rescuing"
  | "attacking_control"
  | "not_sure";

export type EmpowermentTargetStance = "creator" | "guide" | "challenger";

export type EmpowermentNextAction =
  | "pause_before_message"
  | "one_small_choice"
  | "ask_one_question"
  | "name_boundary"
  | "offer_support_no_takeover"
  | "state_fact_no_attack"
  | "return_to_self"
  | "save_later_topic";

export type EmpowermentShiftInput = {
  spaceId: string;
  currentStance: EmpowermentCurrentStance;
  targetStance: EmpowermentTargetStance;
  promptResponse?: string;
  nextAction: EmpowermentNextAction;
};

export const empowermentCurrentStanceCopy: Record<EmpowermentCurrentStance, string> = {
  powerless: "受害者姿态：等对方决定我的状态",
  rescuing: "拯救者姿态：想替对方负责太多",
  attacking_control: "迫害者姿态：想用控诉或控制止痛",
  not_sure: "说不清，只知道我想拿回一点主动权",
};

export const empowermentTargetStanceCopy: Record<EmpowermentTargetStance, string> = {
  creator: "创造者：我看见自己仍然有选择",
  guide: "引导者：我支持，但不接管",
  challenger: "挑战者：我清楚表达事实或限度",
};

export const empowermentNextActionCopy: Record<EmpowermentNextAction, string> = {
  pause_before_message: "先暂停，不让这一刻替我发出消息",
  one_small_choice: "只选一个我能做的小动作",
  ask_one_question: "只问一个开放问题",
  name_boundary: "说清一个事实或边界",
  offer_support_no_takeover: "表达关心，但不接管",
  state_fact_no_attack: "只说事实，不攻击",
  return_to_self: "先回到自己",
  save_later_topic: "把这个发现点存到稍后",
};

export function getRecommendedEmpowermentTarget(
  stance: EmpowermentCurrentStance,
): EmpowermentTargetStance {
  if (stance === "rescuing") return "guide";
  if (stance === "attacking_control") return "challenger";
  return "creator";
}

export function getEmpowermentPrompt(targetStance: EmpowermentTargetStance): string {
  if (targetStance === "guide") {
    return "我能提供什么问题、边界或支持，而不接管？";
  }

  if (targetStance === "challenger") {
    return "我能清楚说出的事实或限度是什么，而不攻击？";
  }

  return "我仍然能选择的一件小事是什么？";
}

export function getEmpowermentSummary(input: EmpowermentShiftInput): {
  currentStance: string;
  targetStance: string;
  prompt: string;
  promptResponse: string;
  nextAction: string;
  calibration: string;
} {
  return {
    currentStance: empowermentCurrentStanceCopy[input.currentStance],
    targetStance: empowermentTargetStanceCopy[input.targetStance],
    prompt: getEmpowermentPrompt(input.targetStance),
    promptResponse: input.promptResponse?.trim() || getDefaultPromptResponse(input),
    nextAction: empowermentNextActionCopy[input.nextAction],
    calibration: getEmpowermentCalibration(input),
  };
}

export function buildEmpowermentShiftDiscoveryPointInput(
  input: EmpowermentShiftInput,
): DiscoveryPointInput {
  const summary = getEmpowermentSummary(input);

  return {
    spaceId: input.spaceId,
    title: "赋能三角：拿回一点主动权",
    kind: input.nextAction === "save_later_topic" ? "topic" : "action_idea",
    theme: "action_experiment",
    sourceType: "manual",
    sourceTitle: "赋能三角切换",
    sourceSnippet: `${summary.currentStance} -> ${summary.targetStance}`,
    note: [
      `我刚才更像：${summary.currentStance}`,
      `我想换到：${summary.targetStance}`,
      `引导问题：${summary.prompt}`,
      `我的回答：${summary.promptResponse}`,
      `我负责的一小步：${summary.nextAction}`,
      `校准：${summary.calibration}`,
    ].join("\n"),
    exploreQuestion: getEmpowermentExploreQuestion(input),
  };
}

function getDefaultPromptResponse(input: EmpowermentShiftInput): string {
  if (input.targetStance === "guide") {
    return "我可以表达关心或提出一个问题，但不替对方承担对方的部分。";
  }

  if (input.targetStance === "challenger") {
    return "我可以清楚说出事实或限度，不用攻击来证明我受伤。";
  }

  if (input.currentStance === "powerless") {
    return "我可以先做一件能把自己带回来的小事。";
  }

  return "我可以先选一个属于自己的下一步。";
}

function getEmpowermentCalibration(input: EmpowermentShiftInput): string {
  if (input.currentStance === "powerless") {
    return "从受害者姿态转向创造者，不是否认受伤，而是在受伤里找回一个选择。";
  }

  if (input.currentStance === "rescuing") {
    return "从拯救者姿态转向引导者，不是变冷漠，而是关心但不接管。";
  }

  if (input.currentStance === "attacking_control") {
    return "从迫害者姿态转向挑战者，不是压下愤怒，而是不让攻击替我表达边界。";
  }

  return "说不清也可以先暂停。赋能不是立刻变强，是把下一步放回自己手里。";
}

function getEmpowermentExploreQuestion(input: EmpowermentShiftInput): string {
  if (input.targetStance === "guide") {
    return "我能怎样支持或提问，同时把对方的责任留给对方？";
  }

  if (input.targetStance === "challenger") {
    return "如果我只说事实和限度，不攻击也不自证，会怎么说？";
  }

  if (input.nextAction === "return_to_self") {
    return "我需要先回到自己，再决定下一步是什么吗？";
  }

  return "此刻我能选择的一件小事是什么？";
}
