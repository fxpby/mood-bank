import { HeartHandshake, NotebookPen, Save, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { BranchActivationNudge } from "../components/BranchActivationNudge";
import { ChipGroup, type ChipOption } from "../components/ChipGroup";
import { CompletionCard } from "../components/CompletionCard";
import { PageHeader } from "../components/PageHeader";
import { StepScreen } from "../components/StepScreen";
import {
  buildRepairUnderstandingDiscoveryPointInput,
  getRepairUnderstandingSummary,
  repairMayNotUnderstandCopy,
  repairMyPartCopy,
  repairNextDirectionCopy,
  repairWantUnderstoodCopy,
  type RepairMayNotUnderstand,
  type RepairMyPart,
  type RepairNextDirection,
  type RepairUnderstandingInput,
  type RepairWantUnderstood,
} from "../domain/repairUnderstanding";
import { selectActiveSpace } from "../domain/selectors";
import { useAppStore } from "../store/AppStoreContext";
import type { AppRoute } from "../utils/route";

type RepairUnderstandingPageProps = {
  navigate: (route: AppRoute) => void;
};

type StepId =
  | "gate"
  | "wantUnderstood"
  | "mayNotUnderstand"
  | "myPart"
  | "note"
  | "nextDirection"
  | "completion";

const wantUnderstoodOptions: ChipOption<RepairWantUnderstood>[] = [
  { value: "my_feeling", label: repairWantUnderstoodCopy.my_feeling },
  { value: "my_intent", label: repairWantUnderstoodCopy.my_intent },
  { value: "my_limit", label: repairWantUnderstoodCopy.my_limit },
  { value: "impact_on_me", label: repairWantUnderstoodCopy.impact_on_me },
  { value: "care_under_conflict", label: repairWantUnderstoodCopy.care_under_conflict },
  { value: "need_for_repair", label: repairWantUnderstoodCopy.need_for_repair },
  { value: "not_sure", label: repairWantUnderstoodCopy.not_sure },
];

const mayNotUnderstandOptions: ChipOption<RepairMayNotUnderstand>[] = [
  { value: "their_feeling", label: repairMayNotUnderstandCopy.their_feeling },
  { value: "their_limit", label: repairMayNotUnderstandCopy.their_limit },
  { value: "their_intent", label: repairMayNotUnderstandCopy.their_intent },
  { value: "their_context", label: repairMayNotUnderstandCopy.their_context },
  { value: "my_impact", label: repairMayNotUnderstandCopy.my_impact },
  { value: "timing_capacity", label: repairMayNotUnderstandCopy.timing_capacity },
  { value: "not_sure", label: repairMayNotUnderstandCopy.not_sure },
];

const myPartOptions: ChipOption<RepairMyPart>[] = [
  { value: "name_feeling_cleanly", label: repairMyPartCopy.name_feeling_cleanly },
  { value: "own_my_impact", label: repairMyPartCopy.own_my_impact },
  { value: "apologize_specific", label: repairMyPartCopy.apologize_specific },
  { value: "ask_without_pressing", label: repairMyPartCopy.ask_without_pressing },
  { value: "stop_over_explaining", label: repairMyPartCopy.stop_over_explaining },
  { value: "hold_boundary", label: repairMyPartCopy.hold_boundary },
  { value: "wait_for_capacity", label: repairMyPartCopy.wait_for_capacity },
  { value: "not_sure", label: repairMyPartCopy.not_sure },
];

const nextDirectionOptions: ChipOption<RepairNextDirection>[] = [
  { value: "repair_attempt", label: repairNextDirectionCopy.repair_attempt },
  { value: "ask_to_understand", label: repairNextDirectionCopy.ask_to_understand },
  { value: "name_boundary", label: repairNextDirectionCopy.name_boundary },
  { value: "wait", label: repairNextDirectionCopy.wait },
  { value: "later_topic", label: repairNextDirectionCopy.later_topic },
  { value: "draft_check", label: repairNextDirectionCopy.draft_check },
  { value: "healthy_love", label: repairNextDirectionCopy.healthy_love },
  { value: "return_to_self", label: repairNextDirectionCopy.return_to_self },
  { value: "close", label: repairNextDirectionCopy.close },
];

export function RepairUnderstandingPage({ navigate }: RepairUnderstandingPageProps) {
  const { state, actions, status, lastError } = useAppStore();
  const activeSpace = selectActiveSpace(state);
  const [step, setStep] = useState<StepId>("gate");
  const [wantUnderstood, setWantUnderstood] =
    useState<RepairWantUnderstood>("care_under_conflict");
  const [mayNotUnderstand, setMayNotUnderstand] =
    useState<RepairMayNotUnderstand>("my_impact");
  const [myPart, setMyPart] = useState<RepairMyPart>("own_my_impact");
  const [note, setNote] = useState("");
  const [nextDirection, setNextDirection] =
    useState<RepairNextDirection>("repair_attempt");
  const [hasSaved, setHasSaved] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const input = useMemo<RepairUnderstandingInput>(
    () => ({
      spaceId: activeSpace?.id ?? "",
      wantUnderstood,
      mayNotUnderstand,
      myPart,
      nextDirection,
      note,
    }),
    [activeSpace?.id, mayNotUnderstand, myPart, nextDirection, note, wantUnderstood],
  );
  const summary = getRepairUnderstandingSummary(input);

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

    const result = actions.saveDiscoveryPoint(
      buildRepairUnderstandingDiscoveryPointInput(input),
    );

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
      <section className="repair-understanding-page page-stack">
        <PageHeader
          title="修复/理解轻检查"
          kicker="冲突以后，先把想被理解、还没理解、我能负责的部分分开。"
          onBack={goBack}
        />
        <section className="repair-understanding-landing panel page-stack">
          <BranchActivationNudge
            onReturnToSelf={() => navigate("/return-to-self")}
            onContinue={() => setStep("wantUnderstood")}
            continueLabel="继续看修复"
          />
          <Sparkles size={26} strokeWidth={1.8} />
          <div className="section-heading">
            <h2>修复不是赢，也不是自我消失</h2>
            <p>
              这里不判断谁对谁错，也不猜对方心理。只帮你看见：我想被理解什么、
              我可能还没理解什么，以及我能负责的一小步。
            </p>
          </div>
          <div className="repair-understanding-note">
            <span>校准句</span>
            <p>好的修复需要理解、责任和边界同时在。</p>
          </div>
          <div className="repair-understanding-actions">
            <button
              className="button button--primary"
              type="button"
              onClick={() => setStep("wantUnderstood")}
            >
              轻轻看一下
            </button>
            <button
              className="button button--secondary"
              type="button"
              onClick={() => navigate("/boundary-clarity")}
            >
              先看边界
            </button>
            <button
              className="button button--ghost"
              type="button"
              onClick={() => navigate("/home")}
            >
              先不处理
            </button>
          </div>
        </section>
      </section>
    );
  }

  if (step === "wantUnderstood") {
    return (
      <StepScreen
        eyebrow="1/5 修复/理解"
        title="我最想被理解的是什么？"
        helper="先选最响的一点，不用把整件事讲完整。"
        primaryLabel="继续"
        onPrimary={() => setStep("mayNotUnderstand")}
        onBack={goBack}
      >
        <ChipGroup
          label="我想被理解的是"
          options={wantUnderstoodOptions}
          value={wantUnderstood}
          onChange={(value) => {
            setWantUnderstood(value);
            resetSaveState();
          }}
        />
      </StepScreen>
    );
  }

  if (step === "mayNotUnderstand") {
    return (
      <StepScreen
        eyebrow="2/5 还没理解"
        title="我可能还没理解什么？"
        helper="这不是替对方找理由，只是给未知留一个位置。"
        primaryLabel="继续"
        onPrimary={() => setStep("myPart")}
        onBack={goBack}
      >
        <ChipGroup
          label="我还没完全理解的可能是"
          options={mayNotUnderstandOptions}
          value={mayNotUnderstand}
          onChange={(value) => {
            setMayNotUnderstand(value);
            resetSaveState();
          }}
        />
      </StepScreen>
    );
  }

  if (step === "myPart") {
    return (
      <StepScreen
        eyebrow="3/5 我能负责"
        title="哪一小部分是我可以负责的？"
        helper="负责不是全盘否定自己，只是把能修复的一点拿回来。"
        primaryLabel="继续"
        onPrimary={() => setStep("note")}
        onBack={goBack}
      >
        <ChipGroup
          label="我可以负责的是"
          options={myPartOptions}
          value={myPart}
          onChange={(value) => {
            setMyPart(value);
            resetSaveState();
          }}
        />
      </StepScreen>
    );
  }

  if (step === "note") {
    return (
      <StepScreen
        eyebrow="4/5 补一句"
        title="这一刻还有什么需要被轻轻放下？"
        helper="可以空着。这里不是写给对方看的，也不是道歉模板。"
        primaryLabel="继续"
        onPrimary={() => setStep("nextDirection")}
        onBack={goBack}
      >
        <label className="field">
          <span className="field-label">补充一句，可空着</span>
          <textarea
            className="field-textarea repair-understanding-textarea"
            value={note}
            onChange={(event) => {
              setNote(event.target.value);
              resetSaveState();
            }}
            placeholder="例如：我想靠近一点，但不想用自责或逼迫来修复。"
            rows={4}
          />
        </label>
      </StepScreen>
    );
  }

  if (step === "nextDirection") {
    return (
      <StepScreen
        eyebrow="5/5 下一方向"
        title="这次先往哪里放？"
        helper="只选一个方向，不需要马上解决整段关系。"
        primaryLabel="看总结"
        onPrimary={() => setStep("completion")}
        onBack={goBack}
      >
        <ChipGroup
          label="下一方向"
          options={nextDirectionOptions}
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
    <section className="repair-understanding-page page-stack">
      <CompletionCard
        title="修复/理解先清楚了一点"
        body="不用急着证明谁对谁错。先把想被理解、还没理解、我能负责的一步放清楚。"
        rows={[
          { label: "我想被理解的是", value: summary.wantUnderstood },
          { label: "我可能还没理解的是", value: summary.mayNotUnderstand },
          { label: "我能负责的部分", value: summary.myPart },
          { label: "下一方向", value: summary.nextDirection },
          { label: "补充", value: summary.note },
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
        <button className="button button--secondary" type="button" onClick={() => navigate("/draft-check")}>
          <NotebookPen size={16} strokeWidth={1.8} />
          去草稿自检
        </button>
        <button className="button button--secondary" type="button" onClick={() => navigate("/healthy-love")}>
          学习怎么爱/被爱
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
  if (step === "wantUnderstood") return "gate";
  if (step === "mayNotUnderstand") return "wantUnderstood";
  if (step === "myPart") return "mayNotUnderstand";
  if (step === "note") return "myPart";
  if (step === "nextDirection") return "note";
  if (step === "completion") return "nextDirection";
  return "gate";
}
