import type { DiscoveryPointInput } from "./types";

export type RichIncomingShape =
  | "warm"
  | "many_threads"
  | "vulnerable"
  | "long_explanation"
  | "want_careful_reply"
  | "pressure"
  | "seen"
  | "fear_missing"
  | "not_sure";

export type RichIncomingThread =
  | "being_seen"
  | "clarification"
  | "vulnerability"
  | "language_buffer"
  | "rumination_sleep"
  | "perfectionism_delay"
  | "values_meaning"
  | "mutual_care"
  | "later_topic"
  | "other";

export type RichIncomingEmotion =
  | "warm"
  | "seen"
  | "moved"
  | "grateful"
  | "settled"
  | "excited"
  | "fear_reply_badly"
  | "pressure"
  | "overloaded"
  | "want_reply_now"
  | "want_escape"
  | "ruminate_sleep"
  | "mixed"
  | "not_sure";

export type RichIncomingHandling =
  | "received"
  | "needs_response"
  | "save_later"
  | "no_response_needed";

export type RichIncomingDirection =
  | "acknowledge_received"
  | "respond_one_thread"
  | "express_gratitude"
  | "ask_open_question"
  | "reflect_key_point"
  | "save_without_reply"
  | "draft_check"
  | "return_to_self";

export type RichIncomingInput = {
  spaceId: string;
  messageNote: string;
  shapes: RichIncomingShape[];
  selectedThreads: RichIncomingThread[];
  emotions: RichIncomingEmotion[];
  handlingByThread: Partial<Record<RichIncomingThread, RichIncomingHandling>>;
  direction: RichIncomingDirection;
};

export const richIncomingShapeCopy: Record<RichIncomingShape, string> = {
  warm: "很暖",
  many_threads: "信息很多",
  vulnerable: "很脆弱",
  long_explanation: "对方解释了很多",
  want_careful_reply: "让我想认真回应",
  pressure: "让我有压力",
  seen: "我被看见了",
  fear_missing: "我怕漏掉什么",
  not_sure: "说不清",
};

export const richIncomingThreadCopy: Record<RichIncomingThread, string> = {
  being_seen: "被看见/被理解",
  clarification: "澄清/解释",
  vulnerability: "脆弱/自我暴露",
  language_buffer: "表达困难/语言缓冲",
  rumination_sleep: "失眠/反复复盘",
  perfectionism_delay: "完美主义/拖延",
  values_meaning: "价值观/意义",
  mutual_care: "自我照顾/互相照顾",
  later_topic: "需要稍后再聊的话题",
  other: "其他",
};

export const richIncomingEmotionCopy: Record<RichIncomingEmotion, string> = {
  warm: "温暖",
  seen: "被看见",
  moved: "感动",
  grateful: "感激",
  settled: "安心",
  excited: "兴奋",
  fear_reply_badly: "怕回应不好",
  pressure: "有压力",
  overloaded: "信息过载",
  want_reply_now: "想马上认真回",
  want_escape: "想逃开",
  ruminate_sleep: "有点失眠/复盘",
  mixed: "混合",
  not_sure: "说不清",
};

export const richIncomingHandlingCopy: Record<RichIncomingHandling, string> = {
  received: "我先收到了",
  needs_response: "这条需要回应",
  save_later: "放进稍后",
  no_response_needed: "不需要回应",
};

export const richIncomingDirectionCopy: Record<RichIncomingDirection, string> = {
  acknowledge_received: "只确认我收到了",
  respond_one_thread: "先回应最重要的一条",
  express_gratitude: "先表达感谢/被触动",
  ask_open_question: "问一个开放问题",
  reflect_key_point: "反映我听到的重点",
  save_without_reply: "先不回复，存下",
  draft_check: "去草稿自检",
  return_to_self: "先回到自己",
};

const DEFAULT_THREADS: RichIncomingThread[] = ["being_seen", "later_topic", "mutual_care"];

export function getActiveRichIncomingThreads(
  selectedThreads: RichIncomingThread[],
  limit = 3,
): RichIncomingThread[] {
  const uniqueThreads = selectedThreads.filter(
    (thread, index) => selectedThreads.indexOf(thread) === index,
  );
  const source = uniqueThreads.length ? uniqueThreads : DEFAULT_THREADS;
  return source.slice(0, limit);
}

export function getOverflowRichIncomingThreads(
  selectedThreads: RichIncomingThread[],
  limit = 3,
): RichIncomingThread[] {
  const uniqueThreads = selectedThreads.filter(
    (thread, index) => selectedThreads.indexOf(thread) === index,
  );
  return uniqueThreads.slice(limit);
}

export function getRichIncomingSummary(input: RichIncomingInput): {
  warmth: string;
  response: string;
  later: string;
  state: string;
  next: string;
} {
  const activeThreads = getActiveRichIncomingThreads(input.selectedThreads);
  const laterThreads = getThreadsForLater(input);
  const responseThread = activeThreads.find(
    (thread) => input.handlingByThread[thread] === "needs_response",
  );
  const warmthThread = activeThreads.find(
    (thread) => thread === "being_seen" || thread === "mutual_care",
  );

  return {
    warmth: warmthThread ? richIncomingThreadCopy[warmthThread] : "这次先允许自己收下一点。",
    response: responseThread ? richIncomingThreadCopy[responseThread] : "不需要一次回应所有线索。",
    later: laterThreads.length
      ? laterThreads.map((thread) => richIncomingThreadCopy[thread]).join("、")
      : "这次没有额外放进稍后的线索。",
    state: input.emotions.length
      ? input.emotions.map((emotion) => richIncomingEmotionCopy[emotion]).join("、")
      : richIncomingEmotionCopy.not_sure,
    next: richIncomingDirectionCopy[input.direction],
  };
}

export function buildRichIncomingDiscoveryPointInputs(
  input: RichIncomingInput,
): DiscoveryPointInput[] {
  return getThreadsForLater(input).map((thread) => ({
    spaceId: input.spaceId,
    title: `长消息线索：${richIncomingThreadCopy[thread]}`,
    kind: thread === "later_topic" ? "topic" : "discovery",
    theme: getThemeForThread(thread),
    sourceType: "rich_incoming",
    sourceTitle: "收到很多内容",
    sourceSnippet: cleanSnippet(input.messageNote),
    note: buildThreadNote(input, thread),
    exploreQuestion: getExploreQuestion(thread),
  }));
}

export function getRichIncomingAnchorSuggestion(input: RichIncomingInput): string {
  const activeThreads = getActiveRichIncomingThreads(input.selectedThreads);
  const hasWarmth =
    input.shapes.includes("warm") ||
    input.shapes.includes("seen") ||
    activeThreads.includes("being_seen") ||
    activeThreads.includes("mutual_care") ||
    input.emotions.includes("warm") ||
    input.emotions.includes("seen") ||
    input.emotions.includes("moved") ||
    input.emotions.includes("grateful") ||
    input.emotions.includes("settled");
  const hasReplyPressure =
    input.shapes.includes("fear_missing") ||
    input.shapes.includes("want_careful_reply") ||
    input.emotions.includes("fear_reply_badly") ||
    input.emotions.includes("pressure") ||
    input.emotions.includes("overloaded");

  if (input.direction === "return_to_self" || input.emotions.includes("want_escape")) {
    return "我可以先回到自己，再决定要不要回应。";
  }

  if (activeThreads.includes("rumination_sleep")) {
    return "这段内容可以明天再看，今晚先让身体停下来。";
  }

  if (activeThreads.includes("perfectionism_delay")) {
    return "回应不需要完美，够真诚的一小步就可以。";
  }

  if (input.direction === "save_without_reply") {
    return "我可以先收下这段内容，不急着立刻回应。";
  }

  if (hasWarmth) {
    return "我可以先收下被看见的部分，不急着一次回应全部。";
  }

  if (hasReplyPressure) {
    return "我可以认真，也可以只先回应最重要的一点。";
  }

  return "我可以先收下这一刻，再慢慢选择下一步。";
}

function getThreadsForLater(input: RichIncomingInput): RichIncomingThread[] {
  const activeThreads = getActiveRichIncomingThreads(input.selectedThreads);
  const overflowThreads = getOverflowRichIncomingThreads(input.selectedThreads);
  const activeLaterThreads = activeThreads.filter(
    (thread) => input.handlingByThread[thread] === "save_later",
  );
  return [...activeLaterThreads, ...overflowThreads].filter(
    (thread, index, threads) => threads.indexOf(thread) === index,
  );
}

function getThemeForThread(thread: RichIncomingThread): DiscoveryPointInput["theme"] {
  if (thread === "language_buffer" || thread === "clarification") return "expression";
  if (thread === "rumination_sleep" || thread === "perfectionism_delay") return "old_echo";
  if (thread === "mutual_care") return "self_care";
  if (thread === "values_meaning") return "relationship_learning";
  return "emotion";
}

function buildThreadNote(input: RichIncomingInput, thread: RichIncomingThread): string {
  const summary = getRichIncomingSummary(input);
  return [
    `线索：${richIncomingThreadCopy[thread]}`,
    `当前状态：${summary.state}`,
    `这次方向：${summary.next}`,
    input.messageNote.trim() ? `原始备注：${input.messageNote.trim()}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function getExploreQuestion(thread: RichIncomingThread): string {
  if (thread === "being_seen") return "这份被看见具体落在哪一句或哪一刻？";
  if (thread === "vulnerability") return "我可以先确认收到了，而不是马上给建议吗？";
  if (thread === "perfectionism_delay") return "这次我想回应得完美，是在保护什么？";
  if (thread === "later_topic") return "这条如果稍后再聊，真正重要的是什么？";
  return "这条线索对我为什么重要？";
}

function cleanSnippet(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.length > 120 ? `${trimmed.slice(0, 120)}...` : trimmed;
}
