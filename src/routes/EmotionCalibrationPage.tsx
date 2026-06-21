import { CheckCircle2, HeartHandshake, NotebookPen, Save } from "lucide-react";
import { useMemo, useState } from "react";
import { ChipGroup, type ChipOption } from "../components/ChipGroup";
import { CompletionCard } from "../components/CompletionCard";
import { PageHeader } from "../components/PageHeader";
import { StepScreen } from "../components/StepScreen";
import { SupportBoundaryCard } from "../components/SupportBoundaryCard";
import {
  buildEmotionCalibrationDiscoveryPointInput,
  calibrationEmotionCopy,
  emotionImpulseCopy,
  emotionSignalCopy,
  getEmotionCalibrationSummary,
  wiseActionCopy,
  type CalibrationEmotion,
  type EmotionCalibrationInput,
  type EmotionImpulse,
  type EmotionSignal,
  type WiseAction,
} from "../domain/emotionCalibration";
import { getSupportBoundaryKind } from "../domain/safety";
import { selectActiveSpace } from "../domain/selectors";
import { useAppStore } from "../store/AppStoreContext";
import type { AppRoute } from "../utils/route";

type EmotionCalibrationPageProps = {
  navigate: (route: AppRoute) => void;
};

type StepId = "landing" | "emotion" | "signal" | "impulse" | "choice" | "completion";

const emotionOptions: ChipOption<CalibrationEmotion>[] = [
  { value: "fear", label: calibrationEmotionCopy.fear },
  { value: "anxiety", label: calibrationEmotionCopy.anxiety },
  { value: "shame", label: calibrationEmotionCopy.shame },
  { value: "guilt", label: calibrationEmotionCopy.guilt },
  { value: "anger", label: calibrationEmotionCopy.anger },
  { value: "sadness", label: calibrationEmotionCopy.sadness },
  { value: "jealousy_envy", label: calibrationEmotionCopy.jealousy_envy },
  { value: "longing", label: calibrationEmotionCopy.longing },
  { value: "mixed", label: calibrationEmotionCopy.mixed },
  { value: "not_sure", label: calibrationEmotionCopy.not_sure },
];

const signalOptions: ChipOption<EmotionSignal>[] = [
  { value: "care_loss", label: emotionSignalCopy.care_loss },
  { value: "need_safety", label: emotionSignalCopy.need_safety },
  { value: "boundary", label: emotionSignalCopy.boundary },
  { value: "old_echo", label: emotionSignalCopy.old_echo },
  { value: "grief", label: emotionSignalCopy.grief },
  { value: "vulnerability", label: emotionSignalCopy.vulnerability },
  { value: "values", label: emotionSignalCopy.values },
  { value: "need_rest", label: emotionSignalCopy.need_rest },
  { value: "not_sure", label: emotionSignalCopy.not_sure },
];

const impulseOptions: ChipOption<EmotionImpulse>[] = [
  { value: "control", label: emotionImpulseCopy.control },
  { value: "check_repeat", label: emotionImpulseCopy.check_repeat },
  { value: "over_explain", label: emotionImpulseCopy.over_explain },
  { value: "hide", label: emotionImpulseCopy.hide },
  { value: "attack_blame", label: emotionImpulseCopy.attack_blame },
  { value: "rescue", label: emotionImpulseCopy.rescue },
  { value: "withdraw", label: emotionImpulseCopy.withdraw },
  { value: "freeze", label: emotionImpulseCopy.freeze },
  { value: "not_sure", label: emotionImpulseCopy.not_sure },
];

const wiseActionOptions: ChipOption<WiseAction>[] = [
  { value: "name_allow", label: wiseActionCopy.name_allow },
  { value: "body_first", label: wiseActionCopy.body_first },
  { value: "facts_then_choice", label: wiseActionCopy.facts_then_choice },
  { value: "boundary_sentence", label: wiseActionCopy.boundary_sentence },
  { value: "ask_for_time", label: wiseActionCopy.ask_for_time },
  { value: "save_later", label: wiseActionCopy.save_later },
  { value: "return_to_self", label: wiseActionCopy.return_to_self },
  { value: "record", label: wiseActionCopy.record },
];

export function EmotionCalibrationPage({ navigate }: EmotionCalibrationPageProps) {
  const { state, actions, status, lastError } = useAppStore();
  const activeSpace = selectActiveSpace(state);
  const [step, setStep] = useState<StepId>("landing");
  const [emotion, setEmotion] = useState<CalibrationEmotion>("fear");
  const [signal, setSignal] = useState<EmotionSignal>("care_loss");
  const [impulse, setImpulse] = useState<EmotionImpulse>("control");
  const [wiseAction, setWiseAction] = useState<WiseAction>("name_allow");
  const [hasSaved, setHasSaved] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const saveInput = useMemo<EmotionCalibrationInput>(
    () => ({
      spaceId: activeSpace?.id ?? "",
      emotion,
      signal,
      impulse,
      wiseAction,
    }),
    [activeSpace?.id, emotion, impulse, signal, wiseAction],
  );
  const summary = getEmotionCalibrationSummary(saveInput);
  const shouldOfferOldEcho =
    signal === "old_echo" ||
    emotion === "shame" ||
    impulse === "control" ||
    impulse === "check_repeat" ||
    impulse === "over_explain" ||
    impulse === "attack_blame";
  const shouldOfferBoundary =
    signal === "boundary" || emotion === "anger" || wiseAction === "boundary_sentence";
  const shouldOfferHealthyLove =
    signal === "care_loss" ||
    signal === "vulnerability" ||
    signal === "values" ||
    impulse === "control" ||
    impulse === "rescue" ||
    impulse === "over_explain";
  const shouldOfferConnectionContinuity =
    signal === "care_loss" ||
    signal === "need_safety" ||
    signal === "vulnerability" ||
    impulse === "control" ||
    impulse === "check_repeat" ||
    impulse === "over_explain" ||
    impulse === "withdraw" ||
    impulse === "freeze";
  const supportBoundaryKind = getSupportBoundaryKind({
    selected: [emotion, signal, impulse, wiseAction],
    physicalSafetyValues: ["need_safety"],
    violenceValues: ["attack_blame"],
    dissociativeValues: ["freeze"],
    overwhelmValues: ["control", "check_repeat", "over_explain", "withdraw", "return_to_self"],
  });

  function resetSaveState() {
    setHasSaved(false);
    setMessage(null);
    setError(null);
  }

  function goBack() {
    setMessage(null);
    setError(null);

    if (step === "landing") {
      navigate("/home");
      return;
    }

    setStep(getPreviousStep(step));
  }

  function saveDiscoveryPoint() {
    if (hasSaved) {
      setMessage("这个发现点已经存进稍后。");
      setError(null);
      return;
    }

    if (!activeSpace) {
      setError("还没有可以保存的空间。");
      setMessage(null);
      return;
    }

    const result = actions.saveDiscoveryPoint(
      buildEmotionCalibrationDiscoveryPointInput(saveInput),
    );

    if (!result.ok) {
      setError(result.error ?? "这次还没有存下。");
      setMessage(null);
      return;
    }

    setHasSaved(true);
    setError(null);
    setMessage("已存入稍后。储蓄罐没有因为这次保存而变化。");
  }

  if (step === "landing") {
    return (
      <section className="emotion-calibration-page page-stack">
        <PageHeader
          title="校准一个情绪"
          kicker="先把情绪当作信使，而不是敌人。"
          onBack={goBack}
        />
        <section className="emotion-calibration-landing panel page-stack">
          <div className="section-heading">
            <h2>情绪可以先被允许</h2>
            <p>
              这里不会判断情绪来源，也不会替你分析别人。只帮你看见：它可能在提醒什么，
              以及你可以怎样不被它推着走。
            </p>
          </div>
          <div className="emotion-calibration-card">
            <span>校准句</span>
            <p>情绪本身不是问题。需要慢一点的是被情绪驱动的控制、攻击、解释或逃开。</p>
          </div>
          <div className="emotion-calibration-actions">
            <button className="button button--primary" type="button" onClick={() => setStep("emotion")}>
              开始校准
            </button>
            <button className="button button--secondary" type="button" onClick={() => navigate("/return-to-self")}>
              <HeartHandshake size={16} strokeWidth={1.8} />
              先回到自己
            </button>
          </div>
        </section>
      </section>
    );
  }

  if (step === "emotion") {
    return (
      <StepScreen
        eyebrow="1/4 情绪"
        title="现在最需要被看见的是哪个情绪？"
        helper="不用选得完美。只是给这股能量一个名字。"
        primaryLabel="继续"
        onPrimary={() => setStep("signal")}
        onBack={goBack}
      >
        <ChipGroup
          label="选一个"
          options={emotionOptions}
          value={emotion}
          onChange={(value) => {
            setEmotion(value);
            resetSaveState();
          }}
        />
      </StepScreen>
    );
  }

  if (step === "signal") {
    return (
      <StepScreen
        eyebrow="2/4 信号"
        title="它可能在提醒或保护什么？"
        helper="这不是找唯一真相，只是给自己一个更温柔的理解。"
        primaryLabel="继续"
        onPrimary={() => setStep("impulse")}
        onBack={goBack}
      >
        <ChipGroup
          label="可能在提醒"
          options={signalOptions}
          value={signal}
          onChange={(value) => {
            setSignal(value);
            resetSaveState();
          }}
        />
      </StepScreen>
    );
  }

  if (step === "impulse") {
    return (
      <StepScreen
        eyebrow="3/4 冲动"
        title="这个情绪容易推我做什么？"
        helper="看见冲动，不等于要照做。"
        primaryLabel="继续"
        onPrimary={() => setStep("choice")}
        onBack={goBack}
      >
        <ChipGroup
          label="它容易推我"
          options={impulseOptions}
          value={impulse}
          onChange={(value) => {
            setImpulse(value);
            resetSaveState();
          }}
        />
      </StepScreen>
    );
  }

  if (step === "choice") {
    return (
      <StepScreen
        eyebrow="4/4 选择"
        title="我可以怎样带着它，但不让它开车？"
        helper="成熟不是消灭情绪，而是在情绪里仍然有选择。"
        primaryLabel="看总结"
        onPrimary={() => setStep("completion")}
        onBack={goBack}
      >
        <ChipGroup
          label="更稳的一步"
          options={wiseActionOptions}
          value={wiseAction}
          onChange={(value) => {
            setWiseAction(value);
            resetSaveState();
          }}
        />
        {supportBoundaryKind ? (
          <SupportBoundaryCard
            kind={supportBoundaryKind}
            onReturnToSelf={() => navigate("/return-to-self")}
          />
        ) : null}
      </StepScreen>
    );
  }

  return (
    <section className="emotion-calibration-page page-stack">
      <CompletionCard
        title="这个情绪先被看见了"
        body="不用压下它，也不用让它替你决定动作。"
        rows={[
          { label: "情绪", value: summary.emotion },
          { label: "校准", value: summary.calibration },
          { label: "可能在提醒", value: summary.signal },
          { label: "容易推我", value: summary.impulse },
          { label: "更稳的一步", value: summary.choice },
        ]}
      >
        {supportBoundaryKind ? (
          <SupportBoundaryCard
            kind={supportBoundaryKind}
            onReturnToSelf={() => navigate("/return-to-self")}
          />
        ) : null}
        {message ? <p className="helper-text">{message}</p> : null}
        {error ? <p className="form-error">{error}</p> : null}
        {lastError && status === "save_error" ? <p className="form-error">{lastError}</p> : null}
        <button className="button button--secondary" type="button" onClick={saveDiscoveryPoint}>
          <Save size={16} strokeWidth={1.8} />
          {status === "saving" ? "正在存下" : "存为发现点"}
        </button>
        <button className="button button--secondary" type="button" onClick={() => navigate("/return-to-self")}>
          <HeartHandshake size={16} strokeWidth={1.8} />
          回到自己
        </button>
        {shouldOfferOldEcho ? (
          <button className="button button--secondary" type="button" onClick={() => navigate("/old-echo")}>
            看看旧感觉
          </button>
        ) : null}
        {shouldOfferBoundary ? (
          <button className="button button--secondary" type="button" onClick={() => navigate("/boundary-clarity")}>
            看看边界
          </button>
        ) : null}
        {shouldOfferHealthyLove ? (
          <button className="button button--secondary" type="button" onClick={() => navigate("/healthy-love")}>
            学习怎么爱/被爱
          </button>
        ) : null}
        {shouldOfferConnectionContinuity ? (
          <button className="button button--secondary" type="button" onClick={() => navigate("/connection-continuity")}>
            看连接感
          </button>
        ) : null}
        <button className="button button--secondary" type="button" onClick={() => navigate("/record/new")}>
          <NotebookPen size={16} strokeWidth={1.8} />
          记录一下
        </button>
        <button className="button button--primary" type="button" onClick={() => navigate("/home")}>
          <CheckCircle2 size={16} strokeWidth={1.8} />
          完成
        </button>
      </CompletionCard>
    </section>
  );
}

function getPreviousStep(step: StepId): StepId {
  if (step === "emotion") return "landing";
  if (step === "signal") return "emotion";
  if (step === "impulse") return "signal";
  if (step === "choice") return "impulse";
  if (step === "completion") return "choice";
  return "landing";
}
