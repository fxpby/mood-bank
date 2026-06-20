import type { DiscoveryPointInput } from "./types";

export type SeeingEvidenceFocus =
  | "received"
  | "understood"
  | "respected"
  | "witnessed"
  | "mutual_listening"
  | "not_sure";

export type SeeingEvidenceSignal =
  | "specific_words"
  | "accurate_reflection"
  | "remembered_context"
  | "respectful_tone"
  | "asked_question"
  | "made_room"
  | "repair_attempt"
  | "ordinary_care"
  | "not_sure";

export type SeeingEvidenceCalibration =
  | "moment_evidence"
  | "not_future_proof"
  | "warm_and_limited"
  | "mutuality_not_performance"
  | "can_receive_without_owing";

export type SeeingCapacity = "can_continue" | "limited" | "not_now";

export type SeeingNextDirection =
  | "receive_it"
  | "thank_lightly"
  | "reflect_back"
  | "ask_one_question"
  | "save_draft"
  | "later_topic"
  | "boundary"
  | "return_to_self"
  | "close";

export type SeeingEvidenceInput = {
  spaceId: string;
  focus: SeeingEvidenceFocus;
  signal: SeeingEvidenceSignal;
  evidenceText?: string;
  calibration: SeeingEvidenceCalibration;
  capacity: SeeingCapacity;
  nextDirection: SeeingNextDirection;
};

export const seeingEvidenceFocusCopy: Record<SeeingEvidenceFocus, string> = {
  received: "我表达的某部分被接住了",
  understood: "我感觉被理解了",
  respected: "我的边界/节奏被尊重了",
  witnessed: "我的勇气或真实被看见了",
  mutual_listening: "我们有一点互相听见",
  not_sure: "说不清，但这里有一点暖",
};

export const seeingEvidenceSignalCopy: Record<SeeingEvidenceSignal, string> = {
  specific_words: "对方回应了具体内容",
  accurate_reflection: "对方准确复述/理解了重点",
  remembered_context: "对方记得背景或细节",
  respectful_tone: "语气里有尊重",
  asked_question: "对方问了开放问题",
  made_room: "对方给我的感受留了空间",
  repair_attempt: "对方有修复或靠近的动作",
  ordinary_care: "有一件普通但真实的照顾",
  not_sure: "说不清，只知道不是空的",
};

export const seeingEvidenceCalibrationCopy: Record<SeeingEvidenceCalibration, string> = {
  moment_evidence: "这是这一刻的证据，先不用变成未来结论。",
  not_future_proof: "它可以很珍贵，但不能证明以后一定会怎样。",
  warm_and_limited: "温暖是真的，局限也可以同时存在。",
  mutuality_not_performance: "互相听见不是表现完美，而是有一点真实接触。",
  can_receive_without_owing: "我可以收下被看见，不必马上用过度回应来偿还。",
};

export const seeingCapacityCopy: Record<SeeingCapacity, string> = {
  can_continue: "我还有容量继续听/回应",
  limited: "容量有限，只能轻轻回应一点",
  not_now: "现在没有容量，先不继续",
};

export const seeingNextDirectionCopy: Record<SeeingNextDirection, string> = {
  receive_it: "先收下这份被看见",
  thank_lightly: "轻轻表达感谢",
  reflect_back: "反映我听到的重点",
  ask_one_question: "问一个开放问题",
  save_draft: "先存草稿",
  later_topic: "放进稍后话题",
  boundary: "先看边界",
  return_to_self: "回到自己",
  close: "到这里就好",
};

export function getSeeingEvidenceSummary(input: SeeingEvidenceInput): {
  focus: string;
  signal: string;
  evidenceText: string;
  calibration: string;
  capacity: string;
  nextDirection: string;
  reminder: string;
} {
  return {
    focus: seeingEvidenceFocusCopy[input.focus],
    signal: seeingEvidenceSignalCopy[input.signal],
    evidenceText: input.evidenceText?.trim() || getDefaultEvidenceText(input),
    calibration: seeingEvidenceCalibrationCopy[input.calibration],
    capacity: seeingCapacityCopy[input.capacity],
    nextDirection: seeingNextDirectionCopy[input.nextDirection],
    reminder: getSeeingEvidenceReminder(input),
  };
}

export function buildSeeingEvidenceDiscoveryPointInput(
  input: SeeingEvidenceInput,
): DiscoveryPointInput {
  const summary = getSeeingEvidenceSummary(input);

  return {
    spaceId: input.spaceId,
    title: "被看见证据：这一刻有真实接触",
    kind: input.nextDirection === "later_topic" ? "topic" : "discovery",
    theme: "relationship_learning",
    sourceType: "manual",
    sourceTitle: "被看见证据轻检查",
    sourceSnippet: summary.evidenceText,
    note: [
      `这次被看见的是：${summary.focus}`,
      `可观察证据：${summary.signal}`,
      `具体落点：${summary.evidenceText}`,
      `校准：${summary.calibration}`,
      `我的容量：${summary.capacity}`,
      `下一方向：${summary.nextDirection}`,
      `提醒：${summary.reminder}`,
    ].join("\n"),
    exploreQuestion: getSeeingEvidenceExploreQuestion(input),
  };
}

function getDefaultEvidenceText(input: SeeingEvidenceInput): string {
  if (input.signal === "specific_words" || input.signal === "accurate_reflection") {
    return "有一句或一个重点被具体回应了。";
  }

  if (input.signal === "repair_attempt") {
    return "这里有一个靠近、解释、道歉或修复的动作。";
  }

  if (input.focus === "mutual_listening") {
    return "我们不是只在各说各话，有一点互相听见。";
  }

  return "这一刻有一点真实接触，但我还不需要把它解释完。";
}

function getSeeingEvidenceReminder(input: SeeingEvidenceInput): string {
  if (input.capacity === "not_now") {
    return "没有容量继续回应时，也可以先把证据收下，不强迫自己接住更多。";
  }

  if (input.calibration === "can_receive_without_owing") {
    return "被看见不是债务，不需要用过度回应来还。";
  }

  if (input.nextDirection === "boundary") {
    return "看见温暖和保留边界可以同时存在。";
  }

  return "把这一刻存下就够了，它珍贵，但不是未来的全部证明。";
}

function getSeeingEvidenceExploreQuestion(input: SeeingEvidenceInput): string {
  if (input.focus === "respected") {
    return "这次被尊重的边界或节奏具体是什么？";
  }

  if (input.focus === "mutual_listening") {
    return "我们各自听见了对方哪一点？";
  }

  if (input.capacity === "limited" || input.capacity === "not_now") {
    return "我能怎样收下这份被看见，同时不逼自己继续回应？";
  }

  return "这份被看见具体落在哪一句、哪个动作或哪个时刻？";
}
