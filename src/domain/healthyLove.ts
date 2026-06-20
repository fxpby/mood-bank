import type { DiscoveryPointInput } from "./types";

export type HealthyLovePhase =
  | "attraction_resonance"
  | "disillusionment_difference"
  | "self_reflection"
  | "repair_negotiation"
  | "integration_insight"
  | "ordinary_care"
  | "not_sure";

export type HealthyLoveLeaning =
  | "care_concern"
  | "attachment_alarm"
  | "control_outcome"
  | "novelty_chasing"
  | "repair_willingness"
  | "boundary_need"
  | "ordinary_care"
  | "not_sure";

export type HealthyLoveAction =
  | "pause_before_message"
  | "ask_honest_question"
  | "name_boundary"
  | "receive_warmth"
  | "let_topic_wait"
  | "repair_my_part"
  | "self_care_while_caring"
  | "save_later_topic";

export type HealthyLoveInput = {
  spaceId: string;
  phase: HealthyLovePhase;
  leaning: HealthyLoveLeaning;
  momentNote?: string;
  action: HealthyLoveAction;
};

export const healthyLovePhaseCopy: Record<HealthyLovePhase, string> = {
  attraction_resonance: "吸引/共鸣：这里有被吸引或被点亮",
  disillusionment_difference: "幻灭/差异被看见：理想和现实开始有缝隙",
  self_reflection: "自省：我开始看见自己的模式",
  repair_negotiation: "修复/磨合：我们可能需要理解和协商",
  integration_insight: "启示/整合：我对爱或被爱有了新理解",
  ordinary_care: "普通照顾：平常、稳定、具体的关心",
  not_sure: "说不清：这一刻还不需要定义阶段",
};

export const healthyLoveLeaningCopy: Record<HealthyLoveLeaning, string> = {
  care_concern: "照顾/关心：我真正在乎 TA 或这段连接",
  attachment_alarm: "依恋警报：我想抓紧一点来换确定感",
  control_outcome: "想控制结果：我希望对方按我的方式回应",
  novelty_chasing: "追新鲜感：我可能把高张力当作爱",
  repair_willingness: "真实修复：我愿意理解、负责和靠近一点",
  boundary_need: "边界需要：我想继续关心，但不能失去自己",
  ordinary_care: "普通维护：不是高潮，但有稳定照顾",
  not_sure: "说不清：先承认混合，不急着定性",
};

export const healthyLoveActionCopy: Record<HealthyLoveAction, string> = {
  pause_before_message: "先暂停，不补发下一条",
  ask_honest_question: "问一个诚实但不施压的问题",
  name_boundary: "说清一个边界或请求",
  receive_warmth: "收下温暖，不立刻升级或索取证明",
  let_topic_wait: "让这个话题等一等",
  repair_my_part: "只修复我能负责的部分",
  self_care_while_caring: "仍然在乎，同时做一个照顾自己的动作",
  save_later_topic: "把这个点存到稍后",
};

export function getHealthyLoveSummary(input: HealthyLoveInput): {
  phase: string;
  leaning: string;
  momentNote: string;
  action: string;
  calibration: string;
} {
  return {
    phase: healthyLovePhaseCopy[input.phase],
    leaning: healthyLoveLeaningCopy[input.leaning],
    momentNote: input.momentNote?.trim() || getDefaultMomentNote(input),
    action: healthyLoveActionCopy[input.action],
    calibration: getHealthyLoveCalibration(input),
  };
}

export function buildHealthyLoveDiscoveryPointInput(
  input: HealthyLoveInput,
): DiscoveryPointInput {
  const summary = getHealthyLoveSummary(input);

  return {
    spaceId: input.spaceId,
    title: "关系学习：这一刻练习爱与被爱",
    kind: input.action === "save_later_topic" ? "topic" : "discovery",
    theme: "relationship_learning",
    sourceType: "manual",
    sourceTitle: "爱与被爱轻校准",
    sourceSnippet: summary.momentNote,
    note: [
      `这一刻阶段：${summary.phase}`,
      `此刻更像：${summary.leaning}`,
      `我真正想要/害怕/练习的是：${summary.momentNote}`,
      `保留自由的一步：${summary.action}`,
      `校准：${summary.calibration}`,
    ].join("\n"),
    exploreQuestion: getHealthyLoveExploreQuestion(input),
  };
}

function getDefaultMomentNote(input: HealthyLoveInput): string {
  if (input.leaning === "attachment_alarm") {
    return "我可能想要更多确定感，也可以先不把不安交给对方解决。";
  }

  if (input.leaning === "control_outcome") {
    return "我在害怕失去或失控，但控制不一定能保护这段连接。";
  }

  if (input.leaning === "novelty_chasing") {
    return "我可以先分辨：我是想要真实连接，还是想追回高张力。";
  }

  if (input.phase === "ordinary_care" || input.leaning === "ordinary_care") {
    return "普通照顾也值得被看见，不一定要很戏剧化才算亲密。";
  }

  if (input.leaning === "boundary_need") {
    return "我可以继续关心，但不需要用自我牺牲维持关系。";
  }

  return "这一刻我先学习看见爱、害怕、边界和修复之间的差别。";
}

function getHealthyLoveCalibration(input: HealthyLoveInput): string {
  if (input.leaning === "care_concern") {
    return "关心可以表达成清楚、温和、可拒绝的动作。";
  }

  if (input.leaning === "attachment_alarm") {
    return "依恋警报不是错，但不需要用抓紧、追问或自证来换确定感。";
  }

  if (input.leaning === "control_outcome") {
    return "想控制常常是在保护害怕。先保护自己，不把对方变成任务。";
  }

  if (input.leaning === "novelty_chasing") {
    return "新鲜感会波动，平静和普通照顾也可能是亲密的一部分。";
  }

  if (input.leaning === "repair_willingness") {
    return "修复不是赢，也不是自我消失；它需要理解、责任和边界同时在。";
  }

  if (input.leaning === "boundary_need") {
    return "边界不是撤回爱，是让爱不靠自我牺牲维持。";
  }

  if (input.leaning === "ordinary_care") {
    return "普通维护不是降级，它也可以是稳定连接的证据。";
  }

  return "说不清也可以先慢一点。健康的爱会保留双方的自由和尊严。";
}

function getHealthyLoveExploreQuestion(input: HealthyLoveInput): string {
  if (input.leaning === "attachment_alarm") {
    return "我想要的确定感，能不能先用不控制对方的方式照顾一点？";
  }

  if (input.leaning === "control_outcome") {
    return "如果我不控制结果，我仍然能负责的一步是什么？";
  }

  if (input.leaning === "repair_willingness") {
    return "如果目标是理解而不是赢，我能为自己的哪一部分负责？";
  }

  if (input.leaning === "boundary_need") {
    return "我能怎样继续关心，同时说清一个真实限度？";
  }

  return "这一刻是在增加自由和理解，还是增加控制和压力？";
}
