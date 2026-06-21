import type { SupportBoundaryKind } from "../domain/safety";

export const supportBoundaryCopy = {
  title: "这可能需要真人支持",
  body:
    "这个小工具不能处理危机、现实危险或让你独自承受不了的内容。请优先联系身边可信任的人、专业支持或当地紧急服务。",
  helper:
    "这里不会判断危险等级，也不会提供法律、安全计划或诊断。你可以先暂停普通反思，把安全和真人支持放在前面。",
  primaryAction: "先回到自己",
  humanSupportAction: "我先去联系真人支持",
  continueAction: "我知道了，继续轻轻看",
};

export const supportBoundaryReasonCopy: Record<SupportBoundaryKind, string> = {
  self_harm: "你提到了可能伤害自己，普通记录工具不适合独自承接这一刻。",
  violence: "这里出现了攻击、暴力或可能伤害他人的线索，需要优先离开升级循环。",
  coercion: "这里可能有胁迫、控制或现实压力，普通关系反思不应替代真人支持。",
  stalking: "这里可能涉及跟踪、监视或被持续侵扰，优先找可信任的人或专业支持。",
  physical_safety: "这里涉及现实身体安全，先不要把它当成普通沟通问题处理。",
  overwhelming: "现在可能已经超过适合继续深挖的负荷，先把支持和低认知动作放前面。",
  dissociative: "如果你感觉麻木、飘走、断片或不像在当下，先暂停分析并找真人支持。",
  human_support: "你已经选到了真人支持，这本身可以是一个负责任的下一步。",
};
