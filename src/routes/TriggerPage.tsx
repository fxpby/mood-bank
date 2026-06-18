import { useState } from "react";
import { CompletionCard } from "../components/CompletionCard";
import { ChipGroup, type ChipOption } from "../components/ChipGroup";
import { StepScreen } from "../components/StepScreen";
import type { ActivationLevel, QuickRecordPrefill } from "../domain/types";
import type { AppRoute, RouteState } from "../utils/route";

type TriggerPageProps = {
  navigate: (route: AppRoute, state?: RouteState) => void;
};

type StepId = "fact" | "bodyEmotion" | "urge" | "nextAction" | "completion";
type FactChip =
  | "no_reply"
  | "long_message"
  | "signal"
  | "want_explain"
  | "conflict"
  | "want_confirm"
  | "not_sure";
type BodyChip =
  | "chest_tight"
  | "stomach_tight"
  | "hot"
  | "want_to_cry"
  | "head_full"
  | "numb"
  | "not_sure";
type EmotionChip =
  | "anxious_afraid"
  | "hurt_sad"
  | "shame_guilt"
  | "anger_resentment"
  | "longing"
  | "mixed"
  | "not_sure";
type UrgeChip =
  | "reply_now"
  | "check_signal"
  | "reread"
  | "over_explain"
  | "ask_reassurance"
  | "delete_withdraw"
  | "cut_off"
  | "attack"
  | "rescue"
  | "sleep_ruminate"
  | "not_sure";
type OwnedAction =
  | "delay_10_min"
  | "save_draft_do_not_send"
  | "record_facts"
  | "save_later_topic"
  | "five_senses"
  | "drink_water_wash_hands"
  | "reply_one_point"
  | "no_extra_message"
  | "return_to_self"
  | "save_quick_record"
  | "not_now"
  | "not_sure";

const factOptions: ChipOption<FactChip>[] = [
  { value: "no_reply", label: "没有回复" },
  { value: "long_message", label: "收到一段长消息" },
  { value: "signal", label: "看到一个动态/信号" },
  { value: "want_explain", label: "我想补发解释" },
  { value: "conflict", label: "发生了争执" },
  { value: "want_confirm", label: "我突然很想确认" },
  { value: "not_sure", label: "说不清" },
];

const bodyOptions: ChipOption<BodyChip>[] = [
  { value: "chest_tight", label: "胸口紧" },
  { value: "stomach_tight", label: "胃缩住" },
  { value: "hot", label: "发热" },
  { value: "want_to_cry", label: "想哭" },
  { value: "head_full", label: "头很满" },
  { value: "numb", label: "身体麻" },
  { value: "not_sure", label: "说不清" },
];

const emotionOptions: ChipOption<EmotionChip>[] = [
  { value: "anxious_afraid", label: "焦虑/害怕" },
  { value: "hurt_sad", label: "委屈/难过" },
  { value: "shame_guilt", label: "羞耻/内疚" },
  { value: "anger_resentment", label: "生气/怨" },
  { value: "longing", label: "想念" },
  { value: "mixed", label: "混合" },
  { value: "not_sure", label: "说不清" },
];

const urgeOptions: ChipOption<UrgeChip>[] = [
  { value: "reply_now", label: "马上回复" },
  { value: "check_signal", label: "检查信号" },
  { value: "reread", label: "反复重读" },
  { value: "over_explain", label: "补发解释" },
  { value: "ask_reassurance", label: "问清楚/要确认" },
  { value: "delete_withdraw", label: "撤回/删除" },
  { value: "cut_off", label: "消失/切断" },
  { value: "attack", label: "指责/攻击" },
  { value: "rescue", label: "安抚或拯救对方" },
  { value: "sleep_ruminate", label: "睡不着一直想" },
  { value: "not_sure", label: "说不清" },
];

const actionOptions: ChipOption<OwnedAction>[] = [
  { value: "delay_10_min", label: "延迟 10 分钟" },
  { value: "save_draft_do_not_send", label: "保存草稿不发" },
  { value: "record_facts", label: "记录事实" },
  { value: "save_later_topic", label: "把话题放进稍后" },
  { value: "five_senses", label: "做五感落地" },
  { value: "drink_water_wash_hands", label: "喝水/洗手" },
  { value: "reply_one_point", label: "只回应一个点" },
  { value: "no_extra_message", label: "不再补发" },
  { value: "return_to_self", label: "回到自己" },
  { value: "save_quick_record", label: "保存为快速记录" },
  { value: "not_now", label: "暂时没有" },
  { value: "not_sure", label: "说不清" },
];

const stepOrder: StepId[] = ["fact", "bodyEmotion", "urge", "nextAction", "completion"];

export function TriggerPage({ navigate }: TriggerPageProps) {
  const [step, setStep] = useState<StepId>("fact");
  const [factChip, setFactChip] = useState<FactChip>("not_sure");
  const [factText, setFactText] = useState("");
  const [body, setBody] = useState<BodyChip>("not_sure");
  const [emotion, setEmotion] = useState<EmotionChip>("not_sure");
  const [intensity, setIntensity] = useState<"low" | "medium" | "high">("medium");
  const [urge, setUrge] = useState<UrgeChip>("not_sure");
  const [nextAction, setNextAction] = useState<OwnedAction>("delay_10_min");

  function goNext() {
    const currentIndex = stepOrder.indexOf(step);
    setStep(stepOrder[Math.min(currentIndex + 1, stepOrder.length - 1)]);
  }

  function goBack() {
    const currentIndex = stepOrder.indexOf(step);
    if (currentIndex <= 0) {
      navigate("/home");
      return;
    }

    setStep(stepOrder[currentIndex - 1]);
  }

  function openQuickRecord() {
    navigate("/record/new", { quickRecordPrefill: buildPrefill() });
  }

  if (step === "fact") {
    return (
      <StepScreen
        eyebrow="1/4 先抓住事实"
        title="发生了什么可确认的事？"
        helper="只写摄像头能拍到的部分，不读心。"
        primaryLabel="下一步"
        onPrimary={goNext}
        tertiaryLabel="回到首页"
        onTertiary={() => navigate("/home")}
      >
        <ChipGroup label="事实类型" options={factOptions} value={factChip} onChange={setFactChip} />
        <label className="field">
          <span className="field-label">补一句事实，可空着</span>
          <textarea
            className="field-textarea"
            placeholder="例如：我看到消息还没回。"
            value={factText}
            onChange={(event) => setFactText(event.target.value)}
            rows={3}
          />
        </label>
      </StepScreen>
    );
  }

  if (step === "bodyEmotion") {
    return (
      <StepScreen
        eyebrow="2/4 看见身体和情绪"
        title="现在身体和情绪是什么？"
        helper="粗略命名就够了，也可以说不清。"
        primaryLabel="看见冲动"
        onPrimary={goNext}
        onBack={goBack}
      >
        <ChipGroup label="身体" options={bodyOptions} value={body} onChange={setBody} />
        <ChipGroup label="情绪" options={emotionOptions} value={emotion} onChange={setEmotion} />
        <ChipGroup
          label="强度"
          options={[
            { value: "low", label: "低" },
            { value: "medium", label: "中" },
            { value: "high", label: "高" },
          ]}
          value={intensity}
          onChange={setIntensity}
        />
      </StepScreen>
    );
  }

  if (step === "urge") {
    return (
      <StepScreen
        eyebrow="3/4 看见冲动"
        title="我现在最想做什么？"
        helper="冲动不是命令，只是线索。"
        primaryLabel="选择下一步"
        onPrimary={goNext}
        onBack={goBack}
      >
        <ChipGroup label="冲动" options={urgeOptions} value={urge} onChange={setUrge} />
        {intensity === "high" ? (
          <button
            className="button button--secondary"
            type="button"
            onClick={() => navigate("/return-to-self")}
          >
            直接回到自己
          </button>
        ) : null}
      </StepScreen>
    );
  }

  if (step === "nextAction") {
    return (
      <StepScreen
        eyebrow="4/4 选一个下一步"
        title="我选择一个能由我完成的下一步"
        helper="这一步不需要解决关系，只需要减少失控。"
        primaryLabel="就这个"
        onPrimary={goNext}
        secondaryLabel="稍后"
        onSecondary={() => setStep("completion")}
        onBack={goBack}
      >
        <section className="recommend-card">
          <span>建议先选轻动作</span>
          <strong>{getActionLabel(recommendAction(urge))}</strong>
          <p>先让冲动慢一点，再决定要不要表达。</p>
          <button
            className="button button--secondary"
            type="button"
            onClick={() => setNextAction(recommendAction(urge))}
          >
            选这个
          </button>
        </section>
        <ChipGroup
          label="下一步"
          options={actionOptions}
          value={nextAction}
          onChange={setNextAction}
        />
      </StepScreen>
    );
  }

  return (
    <section className="trigger-page page-stack">
      <CompletionCard
        title="这一步先够了"
        body="你没有让冲动直接开车。还没变轻也没关系，先别继续加重它。"
        rows={[
          { label: "事实", value: buildFactText(factChip, factText) },
          { label: "冲动", value: getUrgeLabel(urge) },
          { label: "下一步", value: getActionLabel(nextAction) },
        ]}
      >
        <button
          className="button button--primary"
          type="button"
          onClick={() => navigate(intensity === "high" ? "/return-to-self" : "/home")}
        >
          {intensity === "high" ? "进入回到自己" : "完成"}
        </button>
        <button className="button button--secondary" type="button" onClick={openQuickRecord}>
          保存为快速记录
        </button>
        <button className="button button--ghost" type="button" onClick={() => navigate("/home")}>
          回到首页
        </button>
      </CompletionCard>
    </section>
  );

  function buildPrefill(): QuickRecordPrefill {
    return {
      source: "trigger_support",
      title: "一次触发",
      facts: buildFactText(factChip, factText),
      emotions: [getEmotionLabel(emotion)],
      bodySensations: [getBodyLabel(body)],
      activationLevel: mapIntensity(intensity),
      nextAction,
    };
  }
}

function buildFactText(factChip: FactChip, factText: string): string {
  const chipLabel = getFactLabel(factChip);
  const detail = factText.trim();
  if (detail && factChip !== "not_sure") {
    return `${chipLabel}。${detail}`;
  }

  return detail || chipLabel;
}

function mapIntensity(value: "low" | "medium" | "high"): ActivationLevel {
  if (value === "low") return 1;
  if (value === "high") return 3;
  return 2;
}

function recommendAction(urge: UrgeChip): OwnedAction {
  if (urge === "over_explain") return "save_draft_do_not_send";
  if (urge === "reread") return "record_facts";
  if (urge === "attack" || urge === "cut_off") return "return_to_self";
  if (urge === "sleep_ruminate") return "drink_water_wash_hands";
  return "delay_10_min";
}

function getFactLabel(value: FactChip): string {
  return factOptions.find((option) => option.value === value)?.label ?? "说不清";
}

function getBodyLabel(value: BodyChip): string {
  return bodyOptions.find((option) => option.value === value)?.label ?? "说不清";
}

function getEmotionLabel(value: EmotionChip): string {
  return emotionOptions.find((option) => option.value === value)?.label ?? "说不清";
}

function getUrgeLabel(value: UrgeChip): string {
  return urgeOptions.find((option) => option.value === value)?.label ?? "说不清";
}

function getActionLabel(value: OwnedAction): string {
  return actionOptions.find((option) => option.value === value)?.label ?? "说不清";
}
