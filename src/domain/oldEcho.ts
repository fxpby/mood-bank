import type { DiscoveryPointInput } from "./types";

export type OldEchoNeed =
  | "seen"
  | "chosen"
  | "safety"
  | "respect"
  | "not_abandoned"
  | "not_shamed"
  | "authentic"
  | "not_sure";

export type OldEchoProtection =
  | "check"
  | "prove"
  | "attack"
  | "withdraw"
  | "please"
  | "control"
  | "numb"
  | "rescue"
  | "perfect"
  | "not_sure";

export type OldEchoResponse =
  | "name_present"
  | "return_to_self"
  | "record_facts"
  | "save_later"
  | "boundary_sentence"
  | "support_person"
  | "not_sure";

export type OldEchoInput = {
  spaceId: string;
  presentFact: string;
  need: OldEchoNeed;
  protection: OldEchoProtection;
  innerCritic?: string;
  response: OldEchoResponse;
};

export const oldEchoNeedCopy: Record<OldEchoNeed, string> = {
  seen: "被看见",
  chosen: "被选择",
  safety: "安全",
  respect: "尊重",
  not_abandoned: "不被丢下",
  not_shamed: "不被羞辱",
  authentic: "能做自己",
  not_sure: "说不清",
};

export const oldEchoProtectionCopy: Record<OldEchoProtection, string> = {
  check: "检查",
  prove: "证明",
  attack: "攻击",
  withdraw: "撤退",
  please: "讨好",
  control: "控制",
  numb: "麻木",
  rescue: "拯救",
  perfect: "完美主义",
  not_sure: "说不清",
};

export const oldEchoResponseCopy: Record<OldEchoResponse, string> = {
  name_present: "对自己说：这是旧感觉被碰到，不等于今天又发生了",
  return_to_self: "先回到自己",
  record_facts: "只记录今天可确认的事实",
  save_later: "把这个点存到稍后",
  boundary_sentence: "写一句边界或请求",
  support_person: "找一个真人支持",
  not_sure: "现在先不决定",
};

export function getOldEchoSummary(input: OldEchoInput): {
  presentFact: string;
  need: string;
  protection: string;
  innerCritic: string;
  response: string;
  calibration: string;
} {
  return {
    presentFact: input.presentFact.trim() || "今天有一个很小的触发点。",
    need: oldEchoNeedCopy[input.need],
    protection: oldEchoProtectionCopy[input.protection],
    innerCritic: input.innerCritic?.trim() || "没有写下，或暂时说不清。",
    response: oldEchoResponseCopy[input.response],
    calibration: "这可能是旧感觉被碰到，不等于我已经知道创伤来源，也不等于今天的事实已经被证明。",
  };
}

export function buildOldEchoDiscoveryPointInput(input: OldEchoInput): DiscoveryPointInput {
  const summary = getOldEchoSummary(input);

  return {
    spaceId: input.spaceId,
    title: "旧感觉 / 内部审判者：一次看见",
    kind: input.response === "boundary_sentence" ? "action_idea" : "discovery",
    theme: "old_echo",
    sourceType: "manual",
    sourceTitle: "旧感觉 / 内部审判者轻检查",
    sourceSnippet: summary.presentFact,
    note: [
      `今天的蚊子：${summary.presentFact}`,
      `可能被碰到的需要：${summary.need}`,
      `旧保护程序想让我：${summary.protection}`,
      `内部审判者：${summary.innerCritic}`,
      `当下的我选择：${summary.response}`,
      `校准：${summary.calibration}`,
    ].join("\n"),
    exploreQuestion: getOldEchoExploreQuestion(input),
  };
}

function getOldEchoExploreQuestion(input: OldEchoInput): string {
  if (input.need === "not_abandoned") {
    return "这一下像不像害怕被丢下？今天有什么事实，旧感觉又在补什么故事？";
  }

  if (input.protection === "perfect") {
    return "完美主义这次想保护我不经历什么？我能不能只做一个够小的动作？";
  }

  if (input.protection === "control" || input.protection === "check") {
    return "我想靠控制或检查保护什么？有没有一个不控制也能照顾自己的动作？";
  }

  return "今天的事实和旧感觉分别是什么？";
}
