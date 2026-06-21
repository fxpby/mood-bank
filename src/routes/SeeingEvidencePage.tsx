import { Eye, HeartHandshake, NotebookPen, Save, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { ChipGroup, type ChipOption } from "../components/ChipGroup";
import { BranchActivationNudge } from "../components/BranchActivationNudge";
import { CompletionCard } from "../components/CompletionCard";
import { PageHeader } from "../components/PageHeader";
import { StepScreen } from "../components/StepScreen";
import {
  buildSeeingEvidenceDiscoveryPointInput,
  getSeeingEvidenceSummary,
  seeingCapacityCopy,
  seeingEvidenceCalibrationCopy,
  seeingEvidenceFocusCopy,
  seeingEvidenceSignalCopy,
  seeingNextDirectionCopy,
  type SeeingCapacity,
  type SeeingEvidenceCalibration,
  type SeeingEvidenceFocus,
  type SeeingEvidenceInput,
  type SeeingEvidenceSignal,
  type SeeingNextDirection,
} from "../domain/seeingEvidence";
import { selectActiveSpace } from "../domain/selectors";
import { useAppStore } from "../store/AppStoreContext";
import type { AppRoute } from "../utils/route";

type SeeingEvidencePageProps = {
  navigate: (route: AppRoute) => void;
};

type StepId = "gate" | "focus" | "evidence" | "calibration" | "capacity" | "next" | "completion";

const focusOptions: ChipOption<SeeingEvidenceFocus>[] = [
  { value: "received", label: seeingEvidenceFocusCopy.received },
  { value: "understood", label: seeingEvidenceFocusCopy.understood },
  { value: "respected", label: seeingEvidenceFocusCopy.respected },
  { value: "witnessed", label: seeingEvidenceFocusCopy.witnessed },
  { value: "mutual_listening", label: seeingEvidenceFocusCopy.mutual_listening },
  { value: "not_sure", label: seeingEvidenceFocusCopy.not_sure },
];

const signalOptions: ChipOption<SeeingEvidenceSignal>[] = [
  { value: "specific_words", label: seeingEvidenceSignalCopy.specific_words },
  { value: "accurate_reflection", label: seeingEvidenceSignalCopy.accurate_reflection },
  { value: "remembered_context", label: seeingEvidenceSignalCopy.remembered_context },
  { value: "respectful_tone", label: seeingEvidenceSignalCopy.respectful_tone },
  { value: "asked_question", label: seeingEvidenceSignalCopy.asked_question },
  { value: "made_room", label: seeingEvidenceSignalCopy.made_room },
  { value: "repair_attempt", label: seeingEvidenceSignalCopy.repair_attempt },
  { value: "ordinary_care", label: seeingEvidenceSignalCopy.ordinary_care },
  { value: "not_sure", label: seeingEvidenceSignalCopy.not_sure },
];

const calibrationOptions: ChipOption<SeeingEvidenceCalibration>[] = [
  { value: "moment_evidence", label: seeingEvidenceCalibrationCopy.moment_evidence },
  { value: "not_future_proof", label: seeingEvidenceCalibrationCopy.not_future_proof },
  { value: "warm_and_limited", label: seeingEvidenceCalibrationCopy.warm_and_limited },
  { value: "mutuality_not_performance", label: seeingEvidenceCalibrationCopy.mutuality_not_performance },
  { value: "can_receive_without_owing", label: seeingEvidenceCalibrationCopy.can_receive_without_owing },
];

const capacityOptions: ChipOption<SeeingCapacity>[] = [
  { value: "can_continue", label: seeingCapacityCopy.can_continue },
  { value: "limited", label: seeingCapacityCopy.limited },
  { value: "not_now", label: seeingCapacityCopy.not_now },
];

const nextOptions: ChipOption<SeeingNextDirection>[] = [
  { value: "receive_it", label: seeingNextDirectionCopy.receive_it },
  { value: "thank_lightly", label: seeingNextDirectionCopy.thank_lightly },
  { value: "reflect_back", label: seeingNextDirectionCopy.reflect_back },
  { value: "ask_one_question", label: seeingNextDirectionCopy.ask_one_question },
  { value: "save_draft", label: seeingNextDirectionCopy.save_draft },
  { value: "later_topic", label: seeingNextDirectionCopy.later_topic },
  { value: "boundary", label: seeingNextDirectionCopy.boundary },
  { value: "return_to_self", label: seeingNextDirectionCopy.return_to_self },
  { value: "close", label: seeingNextDirectionCopy.close },
];

export function SeeingEvidencePage({ navigate }: SeeingEvidencePageProps) {
  const { state, actions, status, lastError } = useAppStore();
  const activeSpace = selectActiveSpace(state);
  const [step, setStep] = useState<StepId>("gate");
  const [focus, setFocus] = useState<SeeingEvidenceFocus>("witnessed");
  const [signal, setSignal] = useState<SeeingEvidenceSignal>("specific_words");
  const [evidenceText, setEvidenceText] = useState("");
  const [calibration, setCalibration] = useState<SeeingEvidenceCalibration>("moment_evidence");
  const [capacity, setCapacity] = useState<SeeingCapacity>("limited");
  const [nextDirection, setNextDirection] = useState<SeeingNextDirection>("receive_it");
  const [hasSaved, setHasSaved] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const input = useMemo<SeeingEvidenceInput>(
    () => ({
      spaceId: activeSpace?.id ?? "",
      focus,
      signal,
      evidenceText,
      calibration,
      capacity,
      nextDirection,
    }),
    [activeSpace?.id, calibration, capacity, evidenceText, focus, nextDirection, signal],
  );
  const summary = getSeeingEvidenceSummary(input);

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

    const result = actions.saveDiscoveryPoint(buildSeeingEvidenceDiscoveryPointInput(input));

    if (!result.ok) {
      setError(result.error ?? "这次还没有存下。");
      setMessage(null);
      return;
    }

    setHasSaved(true);
    setError(null);
    setMessage("已存为发现点。储蓄罐没有因为这次保存而变化。");
  }

  if (step === "gate") {
    return (
      <section className="seeing-evidence-page page-stack">
        <PageHeader
          title="被看见证据"
          kicker="只看这一刻的真实接触，不把它变成未来证明。"
          onBack={goBack}
        />
        <section className="seeing-evidence-landing panel page-stack">
          <BranchActivationNudge
            onReturnToSelf={() => navigate("/return-to-self")}
            onContinue={() => setStep("focus")}
            continueLabel="继续看证据"
          />
          <Eye size={26} strokeWidth={1.8} />
          <div className="section-heading">
            <h2>这份被看见，具体落在哪里？</h2>
            <p>
              看见不是看穿，也不是必须马上回很多。先把这一刻的证据存清楚，
              不急着推导关系结论。
            </p>
          </div>
          <div className="seeing-evidence-note">
            <span>校准句</span>
            <p>它可以很珍贵，但只是这一刻的证据，不是未来的全部证明。</p>
          </div>
          <div className="seeing-evidence-actions">
            <button className="button button--primary" type="button" onClick={() => setStep("focus")}>
              看看证据
            </button>
            <button className="button button--secondary" type="button" onClick={() => navigate("/rich-incoming")}>
              回到长消息整理
            </button>
            <button className="button button--ghost" type="button" onClick={() => navigate("/home")}>
              先不看这个
            </button>
          </div>
        </section>
      </section>
    );
  }

  if (step === "focus") {
    return (
      <StepScreen
        eyebrow="1/5 被看见什么"
        title="这次更像哪一种被看见？"
        helper="只选这一刻最明显的一点。"
        primaryLabel="继续"
        onPrimary={() => setStep("evidence")}
        onBack={goBack}
      >
        <ChipGroup
          label="这次像是"
          options={focusOptions}
          value={focus}
          onChange={(value) => {
            setFocus(value);
            resetSaveState();
          }}
        />
      </StepScreen>
    );
  }

  if (step === "evidence") {
    return (
      <StepScreen
        eyebrow="2/5 可观察证据"
        title="它具体落在哪一句、哪个动作？"
        helper="不是分析对方心理，只写你能观察到的证据。"
        primaryLabel="继续"
        onPrimary={() => setStep("calibration")}
        onBack={goBack}
      >
        <ChipGroup
          label="证据更像"
          options={signalOptions}
          value={signal}
          onChange={(value) => {
            setSignal(value);
            resetSaveState();
          }}
        />
        <label className="field">
          <span className="field-label">具体落点，可空着</span>
          <textarea
            className="field-textarea seeing-evidence-textarea"
            value={evidenceText}
            onChange={(event) => {
              setEvidenceText(event.target.value);
              resetSaveState();
            }}
            placeholder="例如：对方具体回应了我说出的勇气。"
            rows={4}
          />
        </label>
      </StepScreen>
    );
  }

  if (step === "calibration") {
    return (
      <StepScreen
        eyebrow="3/5 校准"
        title="这份证据可以意味着什么，也不能证明什么？"
        helper="温暖可以被收下，但不用变成未来合同。"
        primaryLabel="继续"
        onPrimary={() => setStep("capacity")}
        onBack={goBack}
      >
        <ChipGroup
          label="我想这样校准"
          options={calibrationOptions}
          value={calibration}
          onChange={(value) => {
            setCalibration(value);
            resetSaveState();
          }}
        />
      </StepScreen>
    );
  }

  if (step === "capacity") {
    return (
      <StepScreen
        eyebrow="4/5 容量"
        title="我现在还有容量继续听/回应吗？"
        helper="没有容量也是有效答案。被看见不等于必须马上接住更多。"
        primaryLabel="继续"
        onPrimary={() => setStep("next")}
        onBack={goBack}
      >
        <ChipGroup
          label="此刻容量"
          options={capacityOptions}
          value={capacity}
          onChange={(value) => {
            setCapacity(value);
            resetSaveState();
          }}
        />
      </StepScreen>
    );
  }

  if (step === "next") {
    return (
      <StepScreen
        eyebrow="5/5 下一方向"
        title="这份被看见之后，我要怎样放它？"
        helper="可以只是收下，不需要马上回很多。"
        primaryLabel="看总结"
        onPrimary={() => setStep("completion")}
        onBack={goBack}
      >
        <ChipGroup
          label="下一步"
          options={nextOptions}
          value={nextDirection}
          onChange={(value) => {
            setNextDirection(value);
            resetSaveState();
          }}
        />
      </StepScreen>
    );
  }

  return (
    <section className="seeing-evidence-page page-stack">
      <CompletionCard
        title="这一刻被看见了"
        body="先把真实接触存清楚。它珍贵，但不用马上变成证明或压力。"
        rows={[
          { label: "这次被看见的是", value: summary.focus },
          { label: "可观察证据", value: summary.signal },
          { label: "具体落点", value: summary.evidenceText },
          { label: "校准", value: summary.calibration },
          { label: "我的容量", value: summary.capacity },
          { label: "下一方向", value: summary.nextDirection },
        ]}
      >
        {message ? <p className="helper-text">{message}</p> : null}
        {error ? <p className="form-error">{error}</p> : null}
        {lastError && status === "save_error" ? <p className="form-error">{lastError}</p> : null}
        <button className="button button--secondary" type="button" onClick={saveDiscoveryPoint}>
          <Save size={16} strokeWidth={1.8} />
          {status === "saving" ? "正在存下" : "存为发现点"}
        </button>
        <button className="button button--secondary" type="button" onClick={() => navigate("/rich-incoming")}>
          回到长消息整理
        </button>
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
  if (step === "focus") return "gate";
  if (step === "evidence") return "focus";
  if (step === "calibration") return "evidence";
  if (step === "capacity") return "calibration";
  if (step === "next") return "capacity";
  if (step === "completion") return "next";
  return "gate";
}
