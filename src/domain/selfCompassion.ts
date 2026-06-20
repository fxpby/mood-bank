import type { DiscoveryPointInput } from "./types";

export type SelfCompassionPain =
  | "hard"
  | "shame"
  | "self_blame"
  | "too_much"
  | "not_enough"
  | "perfectionism"
  | "noticed_not_done"
  | "not_sure";

export type SelfCompassionReminder =
  | "need_not_bad"
  | "one_miss_not_identity"
  | "shame_not_fact"
  | "many_people_struggle"
  | "responsible_no_attack"
  | "just_read";

export type SelfKindnessAction =
  | "hand_chest"
  | "warm_palm_arm"
  | "self_hug"
  | "soften_jaw_shoulders"
  | "slow_exhale"
  | "drink_water"
  | "non_attack_sentence"
  | "self_appreciation"
  | "return_to_self";

export type SelfCompassionNextAction =
  | "do_not_send"
  | "save_draft"
  | "stabilize_before_repair"
  | "one_small_action"
  | "save_discovery"
  | "boundary_clarity"
  | "return_to_self"
  | "rest_ten_min"
  | "stop_self_attack";

export type SelfCompassionInput = {
  spaceId: string;
  pain: SelfCompassionPain;
  painText?: string;
  reminder: SelfCompassionReminder;
  criticSentence?: string;
  caringRewrite?: string;
  kindnessAction: SelfKindnessAction;
  nextAction: SelfCompassionNextAction;
};

export const selfCompassionPainCopy: Record<SelfCompassionPain, string> = {
  hard: "我现在很难受",
  shame: "我在羞耻",
  self_blame: "我在自责",
  too_much: "我怕自己太多",
  not_enough: "我怕自己不够好",
  perfectionism: "我在完美主义里卡住",
  noticed_not_done: "我没做到，但我看见了",
  not_sure: "我现在说不清",
};

export const selfCompassionReminderCopy: Record<SelfCompassionReminder, string> = {
  need_not_bad: "有需要不代表我很糟。",
  one_miss_not_identity: "没做到一次，不等于我没有在练习。",
  shame_not_fact: "羞耻会让我想躲起来，但它不是事实本身。",
  many_people_struggle: "很多人在关系里都会害怕、笨拙、想证明自己。",
  responsible_no_attack: "我可以负责，但不用攻击自己。",
  just_read: "我只读这一句，也算暂停了一下。",
};

export const selfKindnessActionCopy: Record<SelfKindnessAction, string> = {
  hand_chest: "手放胸口",
  warm_palm_arm: "温热手掌贴手臂",
  self_hug: "轻轻抱住自己",
  soften_jaw_shoulders: "放松下巴/肩膀",
  slow_exhale: "慢慢呼一口气",
  drink_water: "喝一口水",
  non_attack_sentence: "给自己一句不攻击的话",
  self_appreciation: "保存一点自我欣赏",
  return_to_self: "先回到自己",
};

export const selfCompassionNextActionCopy: Record<SelfCompassionNextAction, string> = {
  do_not_send: "先不发送",
  save_draft: "保存草稿",
  stabilize_before_repair: "道歉/修复前先稳定",
  one_small_action: "只做一个小行动",
  save_discovery: "把一个发现点存起来",
  boundary_clarity: "回到边界清晰",
  return_to_self: "回到自己",
  rest_ten_min: "休息 10 分钟",
  stop_self_attack: "什么都不做，先停止攻击自己",
};

export function getSelfCompassionSummary(input: SelfCompassionInput): {
  pain: string;
  painText: string;
  reminder: string;
  criticSentence: string;
  caringRewrite: string;
  kindnessAction: string;
  nextAction: string;
  calibration: string;
} {
  return {
    pain: selfCompassionPainCopy[input.pain],
    painText: input.painText?.trim() || "这很难。",
    reminder: selfCompassionReminderCopy[input.reminder],
    criticSentence: input.criticSentence?.trim() || "没有写下，或暂时说不清。",
    caringRewrite: input.caringRewrite?.trim() || getDefaultRewrite(input),
    kindnessAction: selfKindnessActionCopy[input.kindnessAction],
    nextAction: selfCompassionNextActionCopy[input.nextAction],
    calibration: getSelfCompassionCalibration(input),
  };
}

export function buildSelfCompassionDiscoveryPointInput(
  input: SelfCompassionInput,
): DiscoveryPointInput {
  const summary = getSelfCompassionSummary(input);

  return {
    spaceId: input.spaceId,
    title: "自我关怀：一次不攻击自己的暂停",
    kind: input.nextAction === "save_discovery" ? "discovery" : "action_idea",
    theme: "self_care",
    sourceType: "manual",
    sourceTitle: "自我关怀暂停",
    sourceSnippet: summary.pain,
    note: [
      `我看见的痛苦：${summary.pain}`,
      `此刻具体是：${summary.painText}`,
      `我选择的提醒：${summary.reminder}`,
      `严厉声音：${summary.criticSentence}`,
      `不伤害我的回应：${summary.caringRewrite}`,
      `善待自己的动作：${summary.kindnessAction}`,
      `我负责的一小步：${summary.nextAction}`,
      `校准：${summary.calibration}`,
    ].join("\n"),
    exploreQuestion: getSelfCompassionExploreQuestion(input),
  };
}

function getDefaultRewrite(input: SelfCompassionInput): string {
  if (input.pain === "perfectionism" || input.pain === "noticed_not_done") {
    return "我这次没做到全部，不等于我没有在练习。";
  }

  if (input.pain === "too_much" || input.pain === "not_enough") {
    return "我现在有需要，也可以慢一点行动，不用用攻击自己来证明认真。";
  }

  return "这很难，但我不需要再攻击自己。";
}

function getSelfCompassionCalibration(input: SelfCompassionInput): string {
  if (input.nextAction === "stop_self_attack") {
    return "停止攻击自己不是逃避责任，是先不继续加重这一刻。";
  }

  if (input.nextAction === "stabilize_before_repair") {
    return "自我关怀不是跳过修复，是让修复不从羞耻和慌乱里发出。";
  }

  if (input.kindnessAction === "self_appreciation") {
    return "自我欣赏不是比较，也不是证明我更好，只是看见这一小步。";
  }

  return "自我关怀不是放任自己，而是少一点攻击地行动。";
}

function getSelfCompassionExploreQuestion(input: SelfCompassionInput): string {
  if (input.pain === "self_blame" || input.pain === "shame") {
    return "如果这句话既诚实又不伤害我，可以怎么说？";
  }

  if (input.pain === "perfectionism") {
    return "完美主义想保护我不经历什么？我能不能只做一个够小的动作？";
  }

  if (input.nextAction === "boundary_clarity") {
    return "我能不能负责我的部分，同时不把所有结果背到自己身上？";
  }

  return "此刻我能怎样对自己温柔一点，同时保留一个负责的小动作？";
}
