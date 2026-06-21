import { HeartHandshake, NotebookPen, Save, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { ChipGroup, type ChipOption } from "../components/ChipGroup";
import { BranchActivationNudge } from "../components/BranchActivationNudge";
import { CompletionCard } from "../components/CompletionCard";
import { PageHeader } from "../components/PageHeader";
import { StepScreen } from "../components/StepScreen";
import {
  buildHealthyLoveDiscoveryPointInput,
  getHealthyLoveSummary,
  healthyLoveActionCopy,
  healthyLoveLeaningCopy,
  healthyLovePhaseCopy,
  type HealthyLoveAction,
  type HealthyLoveInput,
  type HealthyLoveLeaning,
  type HealthyLovePhase,
} from "../domain/healthyLove";
import { selectActiveSpace } from "../domain/selectors";
import { useAppStore } from "../store/AppStoreContext";
import type { AppRoute } from "../utils/route";

type HealthyLovePageProps = {
  navigate: (route: AppRoute) => void;
};

type StepId = "gate" | "phase" | "leaning" | "note" | "action" | "completion";

const phaseOptions: ChipOption<HealthyLovePhase>[] = [
  { value: "attraction_resonance", label: healthyLovePhaseCopy.attraction_resonance },
  { value: "disillusionment_difference", label: healthyLovePhaseCopy.disillusionment_difference },
  { value: "self_reflection", label: healthyLovePhaseCopy.self_reflection },
  { value: "repair_negotiation", label: healthyLovePhaseCopy.repair_negotiation },
  { value: "integration_insight", label: healthyLovePhaseCopy.integration_insight },
  { value: "ordinary_care", label: healthyLovePhaseCopy.ordinary_care },
  { value: "not_sure", label: healthyLovePhaseCopy.not_sure },
];

const leaningOptions: ChipOption<HealthyLoveLeaning>[] = [
  { value: "care_concern", label: healthyLoveLeaningCopy.care_concern },
  { value: "attachment_alarm", label: healthyLoveLeaningCopy.attachment_alarm },
  { value: "control_outcome", label: healthyLoveLeaningCopy.control_outcome },
  { value: "novelty_chasing", label: healthyLoveLeaningCopy.novelty_chasing },
  { value: "repair_willingness", label: healthyLoveLeaningCopy.repair_willingness },
  { value: "boundary_need", label: healthyLoveLeaningCopy.boundary_need },
  { value: "ordinary_care", label: healthyLoveLeaningCopy.ordinary_care },
  { value: "not_sure", label: healthyLoveLeaningCopy.not_sure },
];

const actionOptions: ChipOption<HealthyLoveAction>[] = [
  { value: "pause_before_message", label: healthyLoveActionCopy.pause_before_message },
  { value: "ask_honest_question", label: healthyLoveActionCopy.ask_honest_question },
  { value: "name_boundary", label: healthyLoveActionCopy.name_boundary },
  { value: "receive_warmth", label: healthyLoveActionCopy.receive_warmth },
  { value: "let_topic_wait", label: healthyLoveActionCopy.let_topic_wait },
  { value: "repair_my_part", label: healthyLoveActionCopy.repair_my_part },
  { value: "self_care_while_caring", label: healthyLoveActionCopy.self_care_while_caring },
  { value: "save_later_topic", label: healthyLoveActionCopy.save_later_topic },
];

export function HealthyLovePage({ navigate }: HealthyLovePageProps) {
  const { state, actions, status, lastError } = useAppStore();
  const activeSpace = selectActiveSpace(state);
  const [step, setStep] = useState<StepId>("gate");
  const [phase, setPhase] = useState<HealthyLovePhase>("self_reflection");
  const [leaning, setLeaning] = useState<HealthyLoveLeaning>("attachment_alarm");
  const [momentNote, setMomentNote] = useState("");
  const [action, setAction] = useState<HealthyLoveAction>("pause_before_message");
  const [hasSaved, setHasSaved] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const input = useMemo<HealthyLoveInput>(
    () => ({
      spaceId: activeSpace?.id ?? "",
      phase,
      leaning,
      momentNote,
      action,
    }),
    [activeSpace?.id, action, leaning, momentNote, phase],
  );
  const summary = getHealthyLoveSummary(input);
  const shouldOfferConnectionContinuity =
    leaning === "attachment_alarm" ||
    leaning === "control_outcome" ||
    action === "pause_before_message" ||
    action === "let_topic_wait";

  function resetSaveState() {
    setHasSaved(false);
    setMessage(null);
    setError(null);
  }

  function goBack() {
    setMessage(null);
    setError(null);

    if (step === "gate") {
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

    const result = actions.saveDiscoveryPoint(buildHealthyLoveDiscoveryPointInput(input));

    if (!result.ok) {
      setError(result.error ?? "这次还没有存下。");
      setMessage(null);
      return;
    }

    setHasSaved(true);
    setError(null);
    setMessage("已存为关系学习发现点。储蓄罐没有因为这次保存而变化。");
  }

  if (step === "gate") {
    return (
      <section className="healthy-love-page page-stack">
        <PageHeader
          title="学习怎么爱/被爱"
          kicker="只看这一刻，不给整段关系下判决。"
          onBack={goBack}
        />
        <section className="healthy-love-landing panel page-stack">
          <BranchActivationNudge
            onReturnToSelf={() => navigate("/return-to-self")}
            onContinue={() => setStep("phase")}
            continueLabel="继续看这一刻"
          />
          <Sparkles size={26} strokeWidth={1.8} />
          <div className="section-heading">
            <h2>这可能是学习怎么爱/被爱的一刻</h2>
            <p>
              爱、依恋、控制、新鲜感、修复和边界有时会混在一起。这里先看这一刻，
              选一个能保留双方自由的小动作。
            </p>
          </div>
          <div className="healthy-love-note">
            <span>校准句</span>
            <p>健康的爱不是消灭害怕，而是在害怕里仍然能做出清楚、温和、有边界的选择。</p>
          </div>
          <div className="healthy-love-actions">
            <button className="button button--primary" type="button" onClick={() => setStep("phase")}>
              看这一刻
            </button>
            <button className="button button--secondary" type="button" onClick={() => navigate("/emotion-calibration")}>
              先校准情绪
            </button>
            <button className="button button--ghost" type="button" onClick={() => navigate("/home")}>
              先不看这个
            </button>
          </div>
        </section>
      </section>
    );
  }

  if (step === "phase") {
    return (
      <StepScreen
        eyebrow="1/4 这一刻"
        title="这更像关系里的哪一段经验？"
        helper="不是给关系定阶段，只是给此刻一个临时标签。"
        primaryLabel="继续"
        onPrimary={() => setStep("leaning")}
        onBack={goBack}
      >
        <ChipGroup
          label="这一刻更像"
          options={phaseOptions}
          value={phase}
          onChange={(value) => {
            setPhase(value);
            resetSaveState();
          }}
        />
      </StepScreen>
    );
  }

  if (step === "leaning") {
    return (
      <StepScreen
        eyebrow="2/4 动机"
        title="我现在更像被什么推着走？"
        helper="动机可以混合。先选最响的一种，不用把自己判定成某类人。"
        primaryLabel="继续"
        onPrimary={() => setStep("note")}
        onBack={goBack}
      >
        <ChipGroup
          label="此刻更像"
          options={leaningOptions}
          value={leaning}
          onChange={(value) => {
            setLeaning(value);
            resetSaveState();
          }}
        />
      </StepScreen>
    );
  }

  if (step === "note") {
    return (
      <StepScreen
        eyebrow="3/4 一句话"
        title="这一刻我真正想要/害怕/练习的是什么？"
        helper="可以空着。这里不是写给对方看的，只是让自己更清楚一点。"
        primaryLabel="继续"
        onPrimary={() => setStep("action")}
        onBack={goBack}
      >
        <label className="field">
          <span className="field-label">一句话，可空着</span>
          <textarea
            className="field-textarea healthy-love-textarea"
            value={momentNote}
            onChange={(event) => {
              setMomentNote(event.target.value);
              resetSaveState();
            }}
            placeholder="例如：我想靠近，但不想用追问来换确定感。"
            rows={4}
          />
        </label>
      </StepScreen>
    );
  }

  if (step === "action") {
    return (
      <StepScreen
        eyebrow="4/4 保留自由"
        title="下一步怎样更像爱，而不是控制或自我丢失？"
        helper="只选一个小动作。它不需要修好整段关系。"
        primaryLabel="看总结"
        onPrimary={() => setStep("completion")}
        onBack={goBack}
      >
        <ChipGroup
          label="我会做"
          options={actionOptions}
          value={action}
          onChange={(value) => {
            setAction(value);
            resetSaveState();
          }}
        />
      </StepScreen>
    );
  }

  return (
    <section className="healthy-love-page page-stack">
      <CompletionCard
        title="这一刻的关系学习先清楚了一点"
        body="不用判断整段关系，也不用证明谁对谁错。先存下这个更自由、更清楚的选择。"
        rows={[
          { label: "这一刻阶段", value: summary.phase },
          { label: "此刻更像", value: summary.leaning },
          { label: "真正想要/害怕/练习的是", value: summary.momentNote },
          { label: "保留自由的一步", value: summary.action },
          { label: "校准", value: summary.calibration },
        ]}
      >
        {message ? <p className="helper-text">{message}</p> : null}
        {error ? <p className="form-error">{error}</p> : null}
        {lastError && status === "save_error" ? <p className="form-error">{lastError}</p> : null}
        <button className="button button--secondary" type="button" onClick={saveDiscoveryPoint}>
          <Save size={16} strokeWidth={1.8} />
          {status === "saving" ? "正在存下" : "存为发现点"}
        </button>
        <button className="button button--secondary" type="button" onClick={() => navigate("/boundary-clarity")}>
          看看边界
        </button>
        {shouldOfferConnectionContinuity ? (
          <button className="button button--secondary" type="button" onClick={() => navigate("/connection-continuity")}>
            看连接感
          </button>
        ) : null}
        <button className="button button--secondary" type="button" onClick={() => navigate("/draft-check")}>
          <NotebookPen size={16} strokeWidth={1.8} />
          去草稿自检
        </button>
        <button className="button button--secondary" type="button" onClick={() => navigate("/return-to-self")}>
          <HeartHandshake size={16} strokeWidth={1.8} />
          回到自己
        </button>
        <button className="button button--primary" type="button" onClick={() => navigate("/home")}>
          完成
        </button>
      </CompletionCard>
    </section>
  );
}

function getPreviousStep(step: StepId): StepId {
  if (step === "phase") return "gate";
  if (step === "leaning") return "phase";
  if (step === "note") return "leaning";
  if (step === "action") return "note";
  if (step === "completion") return "action";
  return "gate";
}
