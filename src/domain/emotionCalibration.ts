import type { DiscoveryPointInput, DiscoveryPointTheme } from "./types";

export type CalibrationEmotion =
  | "fear"
  | "anxiety"
  | "shame"
  | "guilt"
  | "anger"
  | "sadness"
  | "jealousy_envy"
  | "longing"
  | "mixed"
  | "not_sure";

export type EmotionSignal =
  | "care_loss"
  | "need_safety"
  | "boundary"
  | "old_echo"
  | "grief"
  | "vulnerability"
  | "values"
  | "need_rest"
  | "not_sure";

export type EmotionImpulse =
  | "control"
  | "check_repeat"
  | "over_explain"
  | "hide"
  | "attack_blame"
  | "rescue"
  | "withdraw"
  | "freeze"
  | "not_sure";

export type WiseAction =
  | "name_allow"
  | "body_first"
  | "facts_then_choice"
  | "boundary_sentence"
  | "ask_for_time"
  | "save_later"
  | "return_to_self"
  | "record";

export type EmotionCalibrationInput = {
  spaceId: string;
  emotion: CalibrationEmotion;
  signal: EmotionSignal;
  impulse: EmotionImpulse;
  wiseAction: WiseAction;
};

export const calibrationEmotionCopy: Record<CalibrationEmotion, string> = {
  fear: "恐惧/害怕",
  anxiety: "焦虑/不安",
  shame: "羞耻",
  guilt: "内疚",
  anger: "愤怒",
  sadness: "悲伤",
  jealousy_envy: "嫉妒/羡慕",
  longing: "想念",
  mixed: "混合",
  not_sure: "说不清",
};

export const emotionSignalCopy: Record<EmotionSignal, string> = {
  care_loss: "我很在乎，也害怕失去",
  need_safety: "我需要一点安全感",
  boundary: "有个边界或限度被碰到",
  old_echo: "熟悉的旧感觉被碰到",
  grief: "我正在为某些失落难过",
  vulnerability: "这里有脆弱，需要温柔一点",
  values: "它碰到了我珍惜的价值",
  need_rest: "我需要休息，不适合继续加码",
  not_sure: "现在还说不清",
};

export const emotionImpulseCopy: Record<EmotionImpulse, string> = {
  control: "想控制对方或结果",
  check_repeat: "想反复检查",
  over_explain: "想解释到对方懂为止",
  hide: "想躲起来",
  attack_blame: "想攻击/指责",
  rescue: "想立刻拯救或安抚",
  withdraw: "想切断/退出",
  freeze: "卡住不动",
  not_sure: "说不清",
};

export const wiseActionCopy: Record<WiseAction, string> = {
  name_allow: "先说：我现在有这个情绪",
  body_first: "先做一个身体落地动作",
  facts_then_choice: "先写事实，再决定动作",
  boundary_sentence: "只写一句边界或请求",
  ask_for_time: "给自己一点时间再回应",
  save_later: "把这个点存进稍后",
  return_to_self: "先回到自己",
  record: "记录一下再决定",
};

export function getEmotionCalibrationSummary(input: EmotionCalibrationInput): {
  emotion: string;
  calibration: string;
  signal: string;
  impulse: string;
  choice: string;
} {
  return {
    emotion: calibrationEmotionCopy[input.emotion],
    calibration: getCalibrationLine(input.emotion, input.signal),
    signal: emotionSignalCopy[input.signal],
    impulse: emotionImpulseCopy[input.impulse],
    choice: wiseActionCopy[input.wiseAction],
  };
}

export function buildEmotionCalibrationDiscoveryPointInput(
  input: EmotionCalibrationInput,
): DiscoveryPointInput {
  const summary = getEmotionCalibrationSummary(input);

  return {
    spaceId: input.spaceId,
    title: `情绪校准：${summary.emotion}`,
    kind: input.wiseAction === "save_later" ? "topic" : "discovery",
    theme: getThemeForSignal(input.signal),
    sourceType: "manual",
    note: [
      `情绪：${summary.emotion}`,
      `校准：${summary.calibration}`,
      `可能在提醒：${summary.signal}`,
      `它容易推我：${summary.impulse}`,
      `更稳的选择：${summary.choice}`,
    ].join("\n"),
    exploreQuestion: getExploreQuestion(input),
  };
}

function getCalibrationLine(emotion: CalibrationEmotion, signal: EmotionSignal): string {
  if (emotion === "fear") {
    return "恐惧不是敌人。它可能在提醒：我很在乎，也需要更稳地保护自己。";
  }

  if (emotion === "anger" || signal === "boundary") {
    return "愤怒不一定是坏事。它可能在提醒：有边界、限度或重要需要被碰到。";
  }

  if (emotion === "shame" || emotion === "guilt") {
    return "羞耻和内疚很重，但它们不是事实本身。先看见，再决定要不要修正。";
  }

  if (signal === "old_echo") {
    return "这可能有旧感觉的影子。先不急着找源头，只看见它在此刻被碰到。";
  }

  return "这个情绪可以先被允许。需要约束的是被它推着走的动作。";
}

function getThemeForSignal(signal: EmotionSignal): DiscoveryPointTheme {
  if (signal === "boundary") return "boundary";
  if (signal === "old_echo") return "old_echo";
  if (signal === "need_rest" || signal === "need_safety" || signal === "vulnerability") {
    return "self_care";
  }
  if (signal === "values") return "relationship_learning";
  return "emotion";
}

function getExploreQuestion(input: EmotionCalibrationInput): string {
  if (input.emotion === "fear") {
    return "这份恐惧在提醒我：我珍惜什么，又可以怎样不靠控制来保护自己？";
  }

  if (input.signal === "boundary") {
    return "这个情绪可能在保护哪条边界或哪个限度？";
  }

  if (input.signal === "old_echo") {
    return "这个旧感觉此刻想保护我不要再次经历什么？";
  }

  return "这个情绪想让我看见什么需要？";
}
