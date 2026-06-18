import type {
  DiscoveryPointKind,
  DiscoveryPointSourceType,
  DiscoveryPointStatus,
  DiscoveryPointTheme,
} from "../domain/types";

export const discoveryPointKindCopy: Record<DiscoveryPointKind, string> = {
  topic: "话题",
  discovery: "发现点",
  question: "探寻问题",
  action_idea: "行动想法",
};

export const discoveryPointThemeCopy: Record<DiscoveryPointTheme, string> = {
  emotion: "情绪",
  boundary: "边界",
  old_echo: "旧感觉",
  relationship_learning: "关系学习",
  expression: "表达",
  self_care: "自我照顾",
  action_experiment: "行动实验",
};

export const discoveryPointStatusCopy: Record<DiscoveryPointStatus, string> = {
  stored_for_later: "先存着",
  want_to_understand: "想理解",
  want_to_share: "想分享",
  leave_for_now: "先放着",
  reviewed: "看过一次",
  naturally_reached: "自然聊到了",
  no_longer_needed: "不用了",
};

export const discoveryPointSourceCopy: Record<DiscoveryPointSourceType, string> = {
  manual: "手动存入",
  episode: "来自一次记录",
  return_to_self: "来自回到自己",
  trigger: "来自触发",
  draft_check: "来自草稿自检",
  rich_incoming: "来自长消息",
};
