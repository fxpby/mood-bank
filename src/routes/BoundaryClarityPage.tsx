import { HeartHandshake, NotebookPen, Save, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { ChipGroup, type ChipOption } from "../components/ChipGroup";
import { BranchActivationNudge } from "../components/BranchActivationNudge";
import { CompletionCard } from "../components/CompletionCard";
import { PageHeader } from "../components/PageHeader";
import { StepScreen } from "../components/StepScreen";
import { SupportBoundaryCard } from "../components/SupportBoundaryCard";
import {
  boundaryFormCopy,
  boundaryLimitCopy,
  boundaryMineCopy,
  boundaryNextActionCopy,
  boundaryNotMineCopy,
  boundaryPracticeCopy,
  boundarySignalCopy,
  buildBoundaryClarityDiscoveryPointInput,
  getBoundaryClaritySummary,
  type BoundaryClarityInput,
  type BoundaryForm,
  type BoundaryLimit,
  type BoundaryMine,
  type BoundaryNextAction,
  type BoundaryNotMine,
  type BoundaryPractice,
  type BoundarySignal,
} from "../domain/boundaryClarity";
import { getSupportBoundaryKind } from "../domain/safety";
import { selectActiveSpace } from "../domain/selectors";
import { useAppStore } from "../store/AppStoreContext";
import type { AppRoute } from "../utils/route";

type BoundaryClarityPageProps = {
  navigate: (route: AppRoute) => void;
};

type StepId =
  | "gate"
  | "signal"
  | "responsibility"
  | "limit"
  | "form"
  | "practice"
  | "nextAction"
  | "completion";

const signalOptions: ChipOption<BoundarySignal>[] = [
  { value: "guilt", label: boundarySignalCopy.guilt },
  { value: "resentment", label: boundarySignalCopy.resentment },
  { value: "anger", label: boundarySignalCopy.anger },
  { value: "pressure", label: boundarySignalCopy.pressure },
  { value: "fear_disappoint", label: boundarySignalCopy.fear_disappoint },
  { value: "fear_disappear", label: boundarySignalCopy.fear_disappear },
  { value: "over_explain", label: boundarySignalCopy.over_explain },
  { value: "rescue", label: boundarySignalCopy.rescue },
  { value: "control_result", label: boundarySignalCopy.control_result },
  { value: "hard_no", label: boundarySignalCopy.hard_no },
  { value: "hard_receive_no", label: boundarySignalCopy.hard_receive_no },
  { value: "not_sure", label: boundarySignalCopy.not_sure },
];

const mineOptions: ChipOption<BoundaryMine>[] = [
  { value: "feelings", label: boundaryMineCopy.feelings },
  { value: "expression", label: boundaryMineCopy.expression },
  { value: "choice", label: boundaryMineCopy.choice },
  { value: "repair", label: boundaryMineCopy.repair },
  { value: "time_energy", label: boundaryMineCopy.time_energy },
  { value: "real_limits", label: boundaryMineCopy.real_limits },
];

const notMineOptions: ChipOption<BoundaryNotMine>[] = [
  { value: "others_feelings", label: boundaryNotMineCopy.others_feelings },
  { value: "others_understand_now", label: boundaryNotMineCopy.others_understand_now },
  { value: "others_disappointment", label: boundaryNotMineCopy.others_disappointment },
  { value: "others_choice", label: boundaryNotMineCopy.others_choice },
  { value: "others_reply", label: boundaryNotMineCopy.others_reply },
  { value: "relationship_result", label: boundaryNotMineCopy.relationship_result },
];

const limitOptions: ChipOption<BoundaryLimit>[] = [
  { value: "reply_later", label: boundaryLimitCopy.reply_later },
  { value: "cannot_hold_all", label: boundaryLimitCopy.cannot_hold_all },
  { value: "one_point", label: boundaryLimitCopy.one_point },
  { value: "need_rest", label: boundaryLimitCopy.need_rest },
  { value: "not_this_tone", label: boundaryLimitCopy.not_this_tone },
  { value: "ask_concrete_request", label: boundaryLimitCopy.ask_concrete_request },
  { value: "repair_no_attack", label: boundaryLimitCopy.repair_no_attack },
  { value: "cannot_say_yes", label: boundaryLimitCopy.cannot_say_yes },
  { value: "care_not_take_over", label: boundaryLimitCopy.care_not_take_over },
  { value: "need_time", label: boundaryLimitCopy.need_time },
];

const formOptions: ChipOption<BoundaryForm>[] = [
  { value: "language", label: boundaryFormCopy.language },
  { value: "time", label: boundaryFormCopy.time },
  { value: "attention", label: boundaryFormCopy.attention },
  { value: "emotional_distance", label: boundaryFormCopy.emotional_distance },
  { value: "physical_distance", label: boundaryFormCopy.physical_distance },
  { value: "support", label: boundaryFormCopy.support },
  { value: "owned_consequence", label: boundaryFormCopy.owned_consequence },
  { value: "digital", label: boundaryFormCopy.digital },
];

const practiceOptions: ChipOption<BoundaryPractice>[] = [
  { value: "say_no", label: boundaryPracticeCopy.say_no },
  { value: "delay_yes", label: boundaryPracticeCopy.delay_yes },
  { value: "explain_less", label: boundaryPracticeCopy.explain_less },
  { value: "allow_disappointment", label: boundaryPracticeCopy.allow_disappointment },
  { value: "receive_no", label: boundaryPracticeCopy.receive_no },
  { value: "no_not_disappear", label: boundaryPracticeCopy.no_not_disappear },
  { value: "no_counterattack_please", label: boundaryPracticeCopy.no_counterattack_please },
  { value: "not_sure", label: boundaryPracticeCopy.not_sure },
];

const nextActionOptions: ChipOption<BoundaryNextAction>[] = [
  { value: "save_draft_tomorrow", label: boundaryNextActionCopy.save_draft_tomorrow },
  { value: "no_extra_message", label: boundaryNextActionCopy.no_extra_message },
  { value: "ten_min_no_checking", label: boundaryNextActionCopy.ten_min_no_checking },
  { value: "respond_one_point", label: boundaryNextActionCopy.respond_one_point },
  { value: "pause_conversation", label: boundaryNextActionCopy.pause_conversation },
  { value: "leave_scene", label: boundaryNextActionCopy.leave_scene },
  { value: "ask_trusted_person", label: boundaryNextActionCopy.ask_trusted_person },
  { value: "save_later_topic", label: boundaryNextActionCopy.save_later_topic },
  { value: "draft_check", label: boundaryNextActionCopy.draft_check },
  { value: "return_to_self", label: boundaryNextActionCopy.return_to_self },
  { value: "create_experiment", label: boundaryNextActionCopy.create_experiment },
];

export function BoundaryClarityPage({ navigate }: BoundaryClarityPageProps) {
  const { state, actions, status, lastError } = useAppStore();
  const activeSpace = selectActiveSpace(state);
  const [step, setStep] = useState<StepId>("gate");
  const [signal, setSignal] = useState<BoundarySignal>("guilt");
  const [mine, setMine] = useState<BoundaryMine>("expression");
  const [notMine, setNotMine] = useState<BoundaryNotMine>("others_disappointment");
  const [limit, setLimit] = useState<BoundaryLimit>("care_not_take_over");
  const [limitSentence, setLimitSentence] = useState("");
  const [form, setForm] = useState<BoundaryForm>("time");
  const [practice, setPractice] = useState<BoundaryPractice>("allow_disappointment");
  const [nextAction, setNextAction] = useState<BoundaryNextAction>("no_extra_message");
  const [hasSaved, setHasSaved] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const input = useMemo<BoundaryClarityInput>(
    () => ({
      spaceId: activeSpace?.id ?? "",
      signal,
      mine,
      notMine,
      limit,
      limitSentence,
      form,
      practice,
      nextAction,
    }),
    [activeSpace?.id, form, limit, limitSentence, mine, nextAction, notMine, practice, signal],
  );
  const summary = getBoundaryClaritySummary(input);
  const supportBoundaryKind = getSupportBoundaryKind({
    selected: [signal, form, practice, nextAction],
    supportValues: ["support", "ask_trusted_person"],
    overwhelmValues: ["pressure", "cannot_hold_all", "need_rest", "pause_conversation"],
    physicalSafetyValues: ["physical_distance", "leave_scene"],
  });

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

    const result = actions.saveDiscoveryPoint(buildBoundaryClarityDiscoveryPointInput(input));

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
      <section className="boundary-clarity-page page-stack">
        <PageHeader
          title="边界清晰"
          kicker="先分清我的责任、不是我的责任，以及我能做的一步。"
          onBack={goBack}
        />
        <section className="boundary-clarity-landing panel page-stack">
          <BranchActivationNudge
            onReturnToSelf={() => navigate("/return-to-self")}
            onContinue={() => setStep("signal")}
            continueLabel="继续看边界"
          />
          <Sparkles size={26} strokeWidth={1.8} />
          <div className="section-heading">
            <h2>先把边界和控制分开</h2>
            <p>
              边界是我会怎样照顾自己的限度，不是要求对方必须按我期待回应。
              这里不做法律、安全或危险评估；如果拒绝可能带来现实危险，请优先找真人支持。
            </p>
          </div>
          <div className="boundary-clarity-note">
            <span>校准句</span>
            <p>我可以关心，也可以不越过自己的限度。</p>
          </div>
          <div className="boundary-clarity-actions">
            <button className="button button--primary" type="button" onClick={() => setStep("signal")}>
              轻轻看一下
            </button>
            <button className="button button--secondary" type="button" onClick={() => navigate("/return-to-self")}>
              <HeartHandshake size={16} strokeWidth={1.8} />
              先回到自己
            </button>
            <button className="button button--ghost" type="button" onClick={() => navigate("/home")}>
              先不看这么深
            </button>
          </div>
        </section>
      </section>
    );
  }

  if (step === "signal") {
    return (
      <StepScreen
        eyebrow="1/6 边界信号"
        title="是什么提醒我需要边界？"
        helper="内疚、怨气、愤怒、压力，都可能是在提醒界限。"
        primaryLabel="继续"
        onPrimary={() => setStep("responsibility")}
        onBack={goBack}
      >
        <ChipGroup
          label="此刻更像"
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

  if (step === "responsibility") {
    return (
      <StepScreen
        eyebrow="2/6 责任分开"
        title="什么是我的？什么不是我的？"
        helper="只先各选一个最响的，不需要把整件事分析完。"
        primaryLabel="继续"
        onPrimary={() => setStep("limit")}
        onBack={goBack}
      >
        <div className="boundary-responsibility-grid">
          <ChipGroup
            label="我的部分"
            options={mineOptions}
            value={mine}
            onChange={(value) => {
              setMine(value);
              resetSaveState();
            }}
          />
          <ChipGroup
            label="不是我的部分"
            options={notMineOptions}
            value={notMine}
            onChange={(value) => {
              setNotMine(value);
              resetSaveState();
            }}
          />
        </div>
      </StepScreen>
    );
  }

  if (step === "limit") {
    return (
      <StepScreen
        eyebrow="3/6 真实限度"
        title="我真实能给出的是什么？"
        helper="边界不是冷漠，是把能给和不能给说清楚。"
        primaryLabel="继续"
        onPrimary={() => setStep("form")}
        onBack={goBack}
      >
        <ChipGroup
          label="这次的真实限度 / 请求"
          options={limitOptions}
          value={limit}
          onChange={(value) => {
            setLimit(value);
            resetSaveState();
          }}
        />
        <label className="field">
          <span className="field-label">我的一句真实限度 / 请求，可空着</span>
          <textarea
            className="field-textarea boundary-clarity-textarea"
            value={limitSentence}
            onChange={(event) => {
              setLimitSentence(event.target.value);
              resetSaveState();
            }}
            placeholder="例如：我愿意聊这件事，但今晚我不继续补发解释。"
            rows={4}
          />
        </label>
      </StepScreen>
    );
  }

  if (step === "form") {
    return (
      <StepScreen
        eyebrow="4/6 边界形式"
        title="这更像哪一种边界？"
        helper="后果是我会做什么，不是威胁对方必须怎样。"
        primaryLabel="继续"
        onPrimary={() => setStep("practice")}
        onBack={goBack}
      >
        <ChipGroup
          label="边界形式"
          options={formOptions}
          value={form}
          onChange={(value) => {
            setForm(value);
            resetSaveState();
          }}
        />
      </StepScreen>
    );
  }

  if (step === "practice") {
    return (
      <StepScreen
        eyebrow="5/6 练习方向"
        title="这次更需要练习哪一边？"
        helper="我可以拒绝，也可以继续关心。对方可以拒绝，这不等于我不存在。"
        primaryLabel="继续"
        onPrimary={() => setStep("nextAction")}
        onBack={goBack}
      >
        <ChipGroup
          label="这次练习"
          options={practiceOptions}
          value={practice}
          onChange={(value) => {
            setPractice(value);
            resetSaveState();
          }}
        />
      </StepScreen>
    );
  }

  if (step === "nextAction") {
    return (
      <StepScreen
        eyebrow="6/6 我负责的一步"
        title="我负责的下一步是什么？"
        helper="只选一个自己能执行的小动作，不用解决整段关系。"
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
    <section className="boundary-clarity-page page-stack">
      <CompletionCard
        title="边界先清楚了一点"
        body="这不是为了让对方立刻改变，而是把你能负责和不需要背起的部分分开一点。"
        rows={[
          { label: "边界信号", value: summary.signal },
          { label: "我的部分", value: summary.mine },
          { label: "不是我的部分", value: summary.notMine },
          { label: "真实限度 / 请求", value: summary.limit },
          { label: "我的一句话", value: summary.limitSentence },
          { label: "边界形式", value: summary.form },
          { label: "这次练习", value: summary.practice },
          { label: "我负责的下一步", value: summary.nextAction },
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
        <button className="button button--secondary" type="button" onClick={() => navigate("/draft-check")}>
          <NotebookPen size={16} strokeWidth={1.8} />
          去草稿自检
        </button>
        <button className="button button--secondary" type="button" onClick={() => navigate("/experiments")}>
          创建小练习
        </button>
        <button className="button button--secondary" type="button" onClick={() => navigate("/healthy-love")}>
          学习怎么爱/被爱
        </button>
        <button className="button button--secondary" type="button" onClick={() => navigate("/repair-understanding")}>
          修复/理解一下
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
  if (step === "signal") return "gate";
  if (step === "responsibility") return "signal";
  if (step === "limit") return "responsibility";
  if (step === "form") return "limit";
  if (step === "practice") return "form";
  if (step === "nextAction") return "practice";
  if (step === "completion") return "nextAction";
  return "gate";
}
