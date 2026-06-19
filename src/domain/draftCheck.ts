import type {
  DiscoveryPointInput,
  DiscoveryPointTheme,
  DraftInput,
  QuickRecordInput,
  SpaceType,
} from "./types";

export type DraftCheckState =
  | "present"
  | "connection_alarm"
  | "old_echo"
  | "inner_judge"
  | "boundary_pressure"
  | "body_overload"
  | "not_sure";

export type DraftCheckMotivation =
  | "express_feeling"
  | "repair_apologize"
  | "make_request"
  | "name_boundary"
  | "stay_present"
  | "hope_response"
  | "prove_self"
  | "rescue_other"
  | "ease_anxiety"
  | "show_wrong";

export type DraftNoResponseTolerance =
  | "return_to_life"
  | "hard_but_wait"
  | "check_repeatedly"
  | "send_more"
  | "ruminate_sleep"
  | "collapse"
  | "not_sure";

export type DraftContentRisk =
  | "too_private"
  | "analyze_other"
  | "must_reply"
  | "over_explain"
  | "too_many_topics"
  | "unclear_boundary"
  | "attack_blame"
  | "low_risk"
  | "not_sure";

export type DraftStance =
  | "creator"
  | "coach"
  | "challenger"
  | "victim"
  | "rescuer"
  | "persecutor"
  | "not_sure";

export type DraftAfterSend =
  | "return_to_life"
  | "watch_reply"
  | "regret_withdraw"
  | "send_more"
  | "ruminate_sleep"
  | "clearer"
  | "more_boundary"
  | "not_sure";

export type DraftCheckRecommendation =
  | "ready_enough"
  | "lighten_it"
  | "save_as_draft"
  | "private_record_first"
  | "boundary_expression"
  | "return_to_self_first";

export type DraftCheckInput = {
  draftText: string;
  state: DraftCheckState;
  motivation: DraftCheckMotivation;
  noResponseTolerance: DraftNoResponseTolerance;
  contentRisk: DraftContentRisk;
  stance: DraftStance;
  afterSend: DraftAfterSend;
};

export type DraftCheckSaveInput = DraftCheckInput & {
  spaceId: string;
  spaceType: SpaceType;
};

export const draftCheckStateCopy: Record<DraftCheckState, string> = {
  present: "基本在当下",
  connection_alarm: "连接警报很响",
  old_echo: "旧感觉被碰到",
  inner_judge: "内部审判者很响",
  boundary_pressure: "边界/责任压力",
  body_overload: "身体过载",
  not_sure: "说不清",
};

export const draftCheckMotivationCopy: Record<DraftCheckMotivation, string> = {
  express_feeling: "表达真实感受",
  repair_apologize: "修复/道歉",
  make_request: "提出一个请求",
  name_boundary: "说明边界",
  stay_present: "维持在场",
  hope_response: "希望得到回应",
  prove_self: "解释/证明自己",
  rescue_other: "安抚或拯救对方",
  ease_anxiety: "降低自己的不安",
  show_wrong: "让对方知道 TA 错了",
};

export const draftNoResponseToleranceCopy: Record<DraftNoResponseTolerance, string> = {
  return_to_life: "可以回到生活",
  hard_but_wait: "会有点难，但能等",
  check_repeatedly: "会反复检查",
  send_more: "会想补发",
  ruminate_sleep: "会睡不着/复盘",
  collapse: "会很崩",
  not_sure: "说不清",
};

export const draftContentRiskCopy: Record<DraftContentRisk, string> = {
  too_private: "暴露太多隐私",
  analyze_other: "分析对方心理",
  must_reply: "暗含必须回应",
  over_explain: "过度解释/自证",
  too_many_topics: "把很多话题塞在一起",
  unclear_boundary: "边界不清",
  attack_blame: "攻击/讽刺/控诉",
  low_risk: "没有明显风险",
  not_sure: "说不清",
};

export const draftStanceCopy: Record<DraftStance, string> = {
  creator: "创造者：我表达我能选择的部分",
  coach: "引导者：我支持，但不接管",
  challenger: "挑战者：我清楚表达事实/边界",
  victim: "受害者：等对方决定我的状态",
  rescuer: "拯救者：想修好/接住/负责太多",
  persecutor: "迫害者：想让对方知道 TA 错了",
  not_sure: "看不出来",
};

export const draftAfterSendCopy: Record<DraftAfterSend, string> = {
  return_to_life: "能回到生活",
  watch_reply: "会一直看回复",
  regret_withdraw: "会后悔/想撤回",
  send_more: "会想再补一段",
  ruminate_sleep: "会失眠/复盘",
  clearer: "会更清楚",
  more_boundary: "会更有边界",
  not_sure: "说不清",
};

export const draftRecommendationCopy: Record<
  DraftCheckRecommendation,
  { title: string; copy: string }
> = {
  ready_enough: {
    title: "可以发：足够真实，也足够低压",
    copy: "这不是保证对方会怎样，只是说明你发送后比较不容易把自己交出去。",
  },
  lighten_it: {
    title: "减轻一点：表达有价值，但压力偏高",
    copy: "先把压力从草稿里拿掉一点，只保留最必要的方向。",
  },
  save_as_draft: {
    title: "先存草稿：现在回应期待太高",
    copy: "存下不是压抑，是不让这一刻替你决定。",
  },
  private_record_first: {
    title: "先私下记录：这段可能更像写给自己看的",
    copy: "有些话先给自己看见，之后再决定要不要给对方看见。",
  },
  boundary_expression: {
    title: "改成边界表达：核心是需要或限度",
    copy: "先看清自己的限度和请求，再决定要不要发出去。",
  },
  return_to_self_first: {
    title: "先回到自己：现在不适合做发送决定",
    copy: "不是不能发，是先不要让高浪替你发。",
  },
};

export function getDraftCheckRecommendation(
  input: DraftCheckInput,
): { recommendation: DraftCheckRecommendation; reason: string } {
  if (input.state === "body_overload" || input.noResponseTolerance === "collapse") {
    return {
      recommendation: "return_to_self_first",
      reason: "身体或情绪负荷太高，先不要让这一刻替你做发送决定。",
    };
  }

  if (
    input.state === "old_echo" ||
    input.state === "inner_judge" ||
    input.motivation === "prove_self"
  ) {
    return {
      recommendation: "private_record_first",
      reason: "这段更像在证明自己或回应旧感觉，先私下看见会更稳。",
    };
  }

  if (
    input.motivation === "name_boundary" ||
    input.state === "boundary_pressure" ||
    input.contentRisk === "unclear_boundary"
  ) {
    return {
      recommendation: "boundary_expression",
      reason: "核心像是需要或限度，先把边界表达放清楚。",
    };
  }

  if (
    input.state === "connection_alarm" ||
    input.motivation === "hope_response" ||
    input.motivation === "ease_anxiety" ||
    input.noResponseTolerance === "check_repeatedly" ||
    input.noResponseTolerance === "send_more" ||
    input.noResponseTolerance === "ruminate_sleep" ||
    input.afterSend === "watch_reply" ||
    input.afterSend === "send_more" ||
    input.afterSend === "ruminate_sleep"
  ) {
    return {
      recommendation: "save_as_draft",
      reason: "回应期待或检查冲动偏高，先存下比立刻发送更能保留主动权。",
    };
  }

  if (
    input.contentRisk !== "low_risk" ||
    input.motivation === "rescue_other" ||
    input.motivation === "show_wrong" ||
    input.stance === "rescuer" ||
    input.stance === "persecutor" ||
    input.stance === "victim" ||
    input.afterSend === "regret_withdraw"
  ) {
    return {
      recommendation: "lighten_it",
      reason: "内容有价值，但压力、话题量或姿态风险偏高，先减轻一点。",
    };
  }

  return {
    recommendation: "ready_enough",
    reason: "你基本在当下，动机清楚，也比较能承受暂时没有回应。",
  };
}

export function buildDraftCheckDiscoveryPointInput(
  input: DraftCheckSaveInput,
  recommendation: DraftCheckRecommendation,
): DiscoveryPointInput {
  const copy = draftRecommendationCopy[recommendation];

  return {
    spaceId: input.spaceId,
    title: `草稿自检：${copy.title}`,
    kind: recommendation === "lighten_it" || recommendation === "boundary_expression" ? "action_idea" : "discovery",
    theme: getRecommendationTheme(recommendation),
    sourceType: "draft_check",
    sourceTitle: "草稿自检",
    sourceSnippet: cleanSnippet(input.draftText),
    note: buildDraftCheckNote(input, recommendation),
    exploreQuestion:
      recommendation === "ready_enough"
        ? "发送后，我怎样不马上把状态交给回应？"
        : "这段草稿真正想保护或表达的是什么？",
  };
}

export function buildDraftCheckDraftInput(input: DraftCheckSaveInput): DraftInput {
  return {
    spaceId: input.spaceId,
    kind: "quick_record",
    data: {
      title: "草稿自检保存的草稿",
      facts: input.draftText.trim() || "这次还没有写草稿，只保存了自检状态。",
      nextAction: "save_draft_do_not_send",
    },
  };
}

export function buildDraftCheckPrivateRecordInput(input: DraftCheckSaveInput): QuickRecordInput {
  return {
    spaceId: input.spaceId,
    spaceType: input.spaceType,
    source: "quick_record",
    title: "草稿自检后的私下记录",
    facts: input.draftText.trim() || "我想先把这段话私下记录，而不是马上发送。",
    emotions: ["not_sure"],
    bodySensations: ["not_sure"],
    connectionLevel: "not_sure",
    activationLevel: "not_sure",
    nextAction: "not_now",
  };
}

function buildDraftCheckNote(input: DraftCheckSaveInput, recommendation: DraftCheckRecommendation): string {
  return [
    `建议：${draftRecommendationCopy[recommendation].title}`,
    `当前状态：${draftCheckStateCopy[input.state]}`,
    `主要动机：${draftCheckMotivationCopy[input.motivation]}`,
    `无回应承受度：${draftNoResponseToleranceCopy[input.noResponseTolerance]}`,
    `内容风险：${draftContentRiskCopy[input.contentRisk]}`,
    `姿态：${draftStanceCopy[input.stance]}`,
    `发送后预演：${draftAfterSendCopy[input.afterSend]}`,
  ].join("\n");
}

function getRecommendationTheme(recommendation: DraftCheckRecommendation): DiscoveryPointTheme {
  if (recommendation === "boundary_expression") return "boundary";
  if (recommendation === "lighten_it") return "expression";
  if (recommendation === "private_record_first" || recommendation === "return_to_self_first") return "self_care";
  return "action_experiment";
}

function cleanSnippet(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.length > 120 ? `${trimmed.slice(0, 120)}...` : trimmed;
}
