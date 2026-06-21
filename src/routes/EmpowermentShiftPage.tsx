import { Compass, HeartHandshake, NotebookPen, Save, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { ChipGroup, type ChipOption } from "../components/ChipGroup";
import { BranchActivationNudge } from "../components/BranchActivationNudge";
import { CompletionCard } from "../components/CompletionCard";
import { PageHeader } from "../components/PageHeader";
import { StepScreen } from "../components/StepScreen";
import {
  buildEmpowermentShiftDiscoveryPointInput,
  empowermentCurrentStanceCopy,
  empowermentNextActionCopy,
  empowermentTargetStanceCopy,
  getEmpowermentPrompt,
  getEmpowermentSummary,
  getRecommendedEmpowermentTarget,
  type EmpowermentCurrentStance,
  type EmpowermentNextAction,
  type EmpowermentShiftInput,
  type EmpowermentTargetStance,
} from "../domain/empowermentShift";
import { selectActiveSpace } from "../domain/selectors";
import { useAppStore } from "../store/AppStoreContext";
import type { AppRoute } from "../utils/route";

type EmpowermentShiftPageProps = {
  navigate: (route: AppRoute) => void;
};

type StepId = "gate" | "stance" | "shift" | "response" | "nextAction" | "completion";

const currentStanceOptions: ChipOption<EmpowermentCurrentStance>[] = [
  { value: "powerless", label: empowermentCurrentStanceCopy.powerless },
  { value: "rescuing", label: empowermentCurrentStanceCopy.rescuing },
  { value: "attacking_control", label: empowermentCurrentStanceCopy.attacking_control },
  { value: "not_sure", label: empowermentCurrentStanceCopy.not_sure },
];

const targetStanceOptions: ChipOption<EmpowermentTargetStance>[] = [
  { value: "creator", label: empowermentTargetStanceCopy.creator },
  { value: "guide", label: empowermentTargetStanceCopy.guide },
  { value: "challenger", label: empowermentTargetStanceCopy.challenger },
];

const nextActionOptions: ChipOption<EmpowermentNextAction>[] = [
  { value: "pause_before_message", label: empowermentNextActionCopy.pause_before_message },
  { value: "one_small_choice", label: empowermentNextActionCopy.one_small_choice },
  { value: "ask_one_question", label: empowermentNextActionCopy.ask_one_question },
  { value: "name_boundary", label: empowermentNextActionCopy.name_boundary },
  {
    value: "offer_support_no_takeover",
    label: empowermentNextActionCopy.offer_support_no_takeover,
  },
  { value: "state_fact_no_attack", label: empowermentNextActionCopy.state_fact_no_attack },
  { value: "return_to_self", label: empowermentNextActionCopy.return_to_self },
  { value: "save_later_topic", label: empowermentNextActionCopy.save_later_topic },
];

export function EmpowermentShiftPage({ navigate }: EmpowermentShiftPageProps) {
  const { state, actions, status, lastError } = useAppStore();
  const activeSpace = selectActiveSpace(state);
  const [step, setStep] = useState<StepId>("gate");
  const [currentStance, setCurrentStance] = useState<EmpowermentCurrentStance>("powerless");
  const [targetStance, setTargetStance] = useState<EmpowermentTargetStance>("creator");
  const [promptResponse, setPromptResponse] = useState("");
  const [nextAction, setNextAction] = useState<EmpowermentNextAction>("one_small_choice");
  const [hasSaved, setHasSaved] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const input = useMemo<EmpowermentShiftInput>(
    () => ({
      spaceId: activeSpace?.id ?? "",
      currentStance,
      targetStance,
      promptResponse,
      nextAction,
    }),
    [activeSpace?.id, currentStance, nextAction, promptResponse, targetStance],
  );
  const summary = getEmpowermentSummary(input);
  const prompt = getEmpowermentPrompt(targetStance);

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

  function updateCurrentStance(value: EmpowermentCurrentStance) {
    setCurrentStance(value);
    setTargetStance(getRecommendedEmpowermentTarget(value));
    resetSaveState();
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

    const result = actions.saveDiscoveryPoint(buildEmpowermentShiftDiscoveryPointInput(input));

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
      <section className="empowerment-shift-page page-stack">
        <PageHeader
          title="赋能三角"
          kicker="只看此刻站位，不给自己或对方贴标签。"
          onBack={goBack}
        />
        <section className="empowerment-shift-landing panel page-stack">
          <BranchActivationNudge
            onReturnToSelf={() => navigate("/return-to-self")}
            onContinue={() => setStep("stance")}
            continueLabel="继续看站位"
          />
          <Compass size={26} strokeWidth={1.8} />
          <div className="section-heading">
            <h2>我想把主动权拿回来一点</h2>
            <p>
              这里不是责备自己，也不是说你不该受伤。只是从等待、拯救或控诉里，
              找回一个属于自己的小动作。
            </p>
          </div>
          <div className="empowerment-shift-note">
            <span>校准句</span>
            <p>痛是真的。主动权不是控制结果，而是找回我能选择的一步。</p>
          </div>
          <div className="empowerment-shift-actions">
            <button className="button button--primary" type="button" onClick={() => setStep("stance")}>
              看看此刻站位
            </button>
            <button className="button button--secondary" type="button" onClick={() => navigate("/return-to-self")}>
              <HeartHandshake size={16} strokeWidth={1.8} />
              先回到自己
            </button>
            <button className="button button--ghost" type="button" onClick={() => navigate("/home")}>
              先不看这个
            </button>
          </div>
        </section>
      </section>
    );
  }

  if (step === "stance") {
    return (
      <StepScreen
        eyebrow="1/4 现在站位"
        title="我现在更像站在哪里？"
        helper="只看互动姿态，不是性格判断，也不是道德评价。"
        primaryLabel="继续"
        onPrimary={() => setStep("shift")}
        onBack={goBack}
      >
        <ChipGroup
          label="此刻更像"
          options={currentStanceOptions}
          value={currentStance}
          onChange={updateCurrentStance}
        />
      </StepScreen>
    );
  }

  if (step === "shift") {
    return (
      <StepScreen
        eyebrow="2/4 换一个站位"
        title="我想往哪个方向挪一点？"
        helper="可以接受推荐，也可以选此刻更贴近你的方向。"
        primaryLabel="继续"
        onPrimary={() => setStep("response")}
        onBack={goBack}
      >
        <div className="empowerment-shift-card">
          <span>推荐</span>
          <p>{empowermentTargetStanceCopy[getRecommendedEmpowermentTarget(currentStance)]}</p>
        </div>
        <ChipGroup
          label="赋能方向"
          options={targetStanceOptions}
          value={targetStance}
          onChange={(value) => {
            setTargetStance(value);
            resetSaveState();
          }}
        />
      </StepScreen>
    );
  }

  if (step === "response") {
    return (
      <StepScreen
        eyebrow="3/4 一个问题"
        title={prompt}
        helper="不用写漂亮。只要有一点点属于自己的下一步。"
        primaryLabel="继续"
        onPrimary={() => setStep("nextAction")}
        onBack={goBack}
      >
        <label className="field">
          <span className="field-label">我的回答，可空着</span>
          <textarea
            className="field-textarea empowerment-shift-textarea"
            value={promptResponse}
            onChange={(event) => {
              setPromptResponse(event.target.value);
              resetSaveState();
            }}
            placeholder="例如：我可以先暂停，不补发；或者只说一个事实。"
            rows={4}
          />
        </label>
      </StepScreen>
    );
  }

  if (step === "nextAction") {
    return (
      <StepScreen
        eyebrow="4/4 我负责的一步"
        title="选一个我能做的小动作"
        helper="不是让关系马上好起来，只是把下一步放回自己手里。"
        primaryLabel="看总结"
        onPrimary={() => setStep("completion")}
        onBack={goBack}
      >
        <ChipGroup
          label="我会做"
          options={nextActionOptions}
          value={nextAction}
          onChange={(value) => {
            setNextAction(value);
            resetSaveState();
          }}
        />
      </StepScreen>
    );
  }

  return (
    <section className="empowerment-shift-page page-stack">
      <CompletionCard
        title="主动权回来了一点"
        body="这不是把痛苦说小，也不是控制结果。只是你已经找到一个属于自己的下一步。"
        rows={[
          { label: "我刚才更像", value: summary.currentStance },
          { label: "我想换到", value: summary.targetStance },
          { label: "引导问题", value: summary.prompt },
          { label: "我的回答", value: summary.promptResponse },
          { label: "我负责的一小步", value: summary.nextAction },
        ]}
      >
        {message ? <p className="helper-text">{message}</p> : null}
        {error ? <p className="form-error">{error}</p> : null}
        {lastError && status === "save_error" ? <p className="form-error">{lastError}</p> : null}
        <button className="button button--secondary" type="button" onClick={saveDiscoveryPoint}>
          <Save size={16} strokeWidth={1.8} />
          {status === "saving" ? "正在存下" : "存为发现点"}
        </button>
        <button className="button button--secondary" type="button" onClick={() => navigate("/draft-check")}>
          <NotebookPen size={16} strokeWidth={1.8} />
          回到草稿自检
        </button>
        <button className="button button--secondary" type="button" onClick={() => navigate("/boundary-clarity")}>
          看看边界
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
  if (step === "stance") return "gate";
  if (step === "shift") return "stance";
  if (step === "response") return "shift";
  if (step === "nextAction") return "response";
  if (step === "completion") return "nextAction";
  return "gate";
}
