import { ArrowLeft, CheckCircle2, FileSearch, HeartHandshake, Save } from "lucide-react";
import { useState } from "react";
import { ChipGroup, type ChipOption } from "../components/ChipGroup";
import { PageHeader } from "../components/PageHeader";
import { StepProgress } from "../components/StepProgress";
import {
  absentSignalReactionCopy,
  buildSignalCheckDiscoveryPointInput,
  goodSignalReactionCopy,
  signalCheckActionCopy,
  signalCheckResultCopy,
  signalCheckTargetCopy,
  type AbsentSignalReaction,
  type GoodSignalReaction,
  type SignalCheckAction,
  type SignalCheckResult,
  type SignalCheckTarget,
} from "../domain/signalCheck";
import { selectActiveSpace } from "../domain/selectors";
import { useAppStore } from "../store/AppStoreContext";
import { buildHighActivationBranchState, type AppRoute, type RouteState } from "../utils/route";

type SignalCheckPageProps = {
  navigate: (route: AppRoute, state?: RouteState) => void;
};

type StepId = "landing" | "target" | "good" | "absent" | "action" | "completion";

const targetOptions: ChipOption<SignalCheckTarget>[] = [
  { value: "care", label: signalCheckTargetCopy.care },
  { value: "cold_connection", label: signalCheckTargetCopy.cold_connection },
  { value: "ignored", label: signalCheckTargetCopy.ignored },
  { value: "my_fault", label: signalCheckTargetCopy.my_fault },
  { value: "new_action", label: signalCheckTargetCopy.new_action },
  { value: "send_again", label: signalCheckTargetCopy.send_again },
  { value: "relationship_future", label: signalCheckTargetCopy.relationship_future },
  { value: "ease_anxiety", label: signalCheckTargetCopy.ease_anxiety },
  { value: "not_sure", label: signalCheckTargetCopy.not_sure },
];

const goodOptions: ChipOption<GoodSignalReaction>[] = [
  { value: "relieved", label: goodSignalReactionCopy.relieved },
  { value: "want_more", label: goodSignalReactionCopy.want_more },
  { value: "move_closer", label: goodSignalReactionCopy.move_closer },
  { value: "fantasize_future", label: goodSignalReactionCopy.fantasize_future },
  { value: "fear_losing", label: goodSignalReactionCopy.fear_losing },
  { value: "still_unsure", label: goodSignalReactionCopy.still_unsure },
  { value: "can_stop", label: goodSignalReactionCopy.can_stop },
  { value: "not_sure", label: goodSignalReactionCopy.not_sure },
];

const absentOptions: ChipOption<AbsentSignalReaction>[] = [
  { value: "keep_refreshing", label: absentSignalReactionCopy.keep_refreshing },
  { value: "over_explain", label: absentSignalReactionCopy.over_explain },
  { value: "question_them", label: absentSignalReactionCopy.question_them },
  { value: "connection_gone", label: absentSignalReactionCopy.connection_gone },
  { value: "self_blame", label: absentSignalReactionCopy.self_blame },
  { value: "cut_off", label: absentSignalReactionCopy.cut_off },
  { value: "ruminate_sleep", label: absentSignalReactionCopy.ruminate_sleep },
  { value: "can_pause", label: absentSignalReactionCopy.can_pause },
  { value: "not_sure", label: absentSignalReactionCopy.not_sure },
];

const actionOptions: ChipOption<SignalCheckAction>[] = [
  { value: "five_senses", label: signalCheckActionCopy.five_senses },
  { value: "drink_water_wash_hands", label: signalCheckActionCopy.drink_water_wash_hands },
  { value: "walk_one_minute", label: signalCheckActionCopy.walk_one_minute },
  { value: "phone_down_10", label: signalCheckActionCopy.phone_down_10 },
  { value: "draft_tomorrow", label: signalCheckActionCopy.draft_tomorrow },
  { value: "facts_not_conclusions", label: signalCheckActionCopy.facts_not_conclusions },
  { value: "warm_evidence", label: signalCheckActionCopy.warm_evidence },
  { value: "return_to_self", label: signalCheckActionCopy.return_to_self },
  { value: "still_check", label: signalCheckActionCopy.still_check },
];

const resultOptions: ChipOption<SignalCheckResult>[] = [
  { value: "lighter", label: signalCheckResultCopy.lighter },
  { value: "want_more", label: signalCheckResultCopy.want_more },
  { value: "more_anxious", label: signalCheckResultCopy.more_anxious },
  { value: "same", label: signalCheckResultCopy.same },
  { value: "skip", label: signalCheckResultCopy.skip },
];

export function SignalCheckPage({ navigate }: SignalCheckPageProps) {
  const { state, actions, status, lastError } = useAppStore();
  const activeSpace = selectActiveSpace(state);
  const [step, setStep] = useState<StepId>("landing");
  const [target, setTarget] = useState<SignalCheckTarget>("ease_anxiety");
  const [goodReaction, setGoodReaction] = useState<GoodSignalReaction>("relieved");
  const [absentReaction, setAbsentReaction] = useState<AbsentSignalReaction>("keep_refreshing");
  const [action, setAction] = useState<SignalCheckAction>("phone_down_10");
  const [result, setResult] = useState<SignalCheckResult>("skip");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSaved, setHasSaved] = useState(false);
  const isCheckingPath = action === "still_check";
  const isHighActivationSignalCheck =
    isCheckingPath ||
    absentReaction === "keep_refreshing" ||
    absentReaction === "connection_gone" ||
    absentReaction === "cut_off" ||
    absentReaction === "ruminate_sleep" ||
    result === "more_anxious" ||
    result === "want_more";
  const branchRouteState = isHighActivationSignalCheck
    ? buildHighActivationBranchState("signal_check")
    : undefined;
  const shouldOfferConnectionContinuity =
    target === "cold_connection" ||
    target === "ignored" ||
    target === "send_again" ||
    target === "relationship_future" ||
    target === "ease_anxiety" ||
    absentReaction === "connection_gone" ||
    absentReaction === "cut_off" ||
    absentReaction === "keep_refreshing" ||
    absentReaction === "over_explain";

  function goBack() {
    setMessage(null);
    setError(null);
    if (step === "landing") {
      navigate("/home");
      return;
    }
    setStep(getPreviousStep(step));
  }

  function savePattern() {
    if (hasSaved) {
      setMessage("已经存到稍后再看。");
      setError(null);
      return;
    }

    if (!activeSpace) {
      setError("还没有可以保存的空间。");
      setMessage(null);
      return;
    }

    if (isCheckingPath && result === "skip") {
      setMessage("这次没有保存结果。先看见这个模式已经够了。");
      setError(null);
      return;
    }

    const saveResult = actions.saveDiscoveryPoint(
      buildSignalCheckDiscoveryPointInput({
        spaceId: activeSpace.id,
        target,
        goodReaction,
        absentReaction,
        action,
        result: isCheckingPath ? result : undefined,
      }),
    );

    if (!saveResult.ok) {
      setError(saveResult.error ?? "这次还没有存下。");
      setMessage(null);
      return;
    }

    setError(null);
    setHasSaved(true);
    setMessage("已存到稍后再看。储蓄罐没有因为这次保存而变化。");
  }

  function updateTarget(value: SignalCheckTarget) {
    setTarget(value);
    setHasSaved(false);
  }

  function updateGoodReaction(value: GoodSignalReaction) {
    setGoodReaction(value);
    setHasSaved(false);
  }

  function updateAbsentReaction(value: AbsentSignalReaction) {
    setAbsentReaction(value);
    setHasSaved(false);
  }

  function updateAction(value: SignalCheckAction) {
    setAction(value);
    setHasSaved(false);
  }

  function updateResult(value: SignalCheckResult) {
    setResult(value);
    setHasSaved(false);
  }

  return (
    <section className="signal-check-page page-stack">
      <PageHeader
        title="想检查信号"
        kicker="你可以检查，也可以先给自己 10 分钟。这里不评判，只帮你看清楚。"
        onBack={goBack}
      />

      {step === "landing" ? (
        <section className="signal-check-landing panel">
          <FileSearch size={26} strokeWidth={1.8} />
          <div className="section-heading">
            <h2>先看见这个想确认的冲动</h2>
            <p>不需要马上证明什么。先让期待、害怕和下一步分开一点。</p>
          </div>
          <div className="signal-check-actions">
            <button className="button button--primary" type="button" onClick={() => setStep("target")}>
              开始缓冲
            </button>
            <button className="button button--secondary" type="button" onClick={() => navigate("/return-to-self")}>
              <HeartHandshake size={16} strokeWidth={1.8} />
              直接回到自己
            </button>
          </div>
        </section>
      ) : null}

      {step === "target" ? (
        <SignalStep
          progress="1/4 想确认什么"
          title="我想通过检查确认什么？"
          helper="不是问你该不该检查，只是先看见期待。"
          actions={
            <>
              <button className="button button--primary" type="button" onClick={() => setStep("good")}>
                预演结果
              </button>
              <button className="button button--ghost" type="button" onClick={goBack}>
                <ArrowLeft size={16} strokeWidth={1.8} />
                返回
              </button>
            </>
          }
        >
          <ChipGroup label="想确认的事" options={targetOptions} value={target} onChange={updateTarget} />
        </SignalStep>
      ) : null}

      {step === "good" ? (
        <SignalStep
          progress="2/4 如果是好信号"
          title="如果看到好信号，我接下来可能会怎样？"
          helper="好信号也可能让人继续加码。"
          actions={
            <>
              <button className="button button--primary" type="button" onClick={() => setStep("absent")}>
                再看另一种结果
              </button>
              <button className="button button--ghost" type="button" onClick={goBack}>
                <ArrowLeft size={16} strokeWidth={1.8} />
                返回
              </button>
            </>
          }
        >
          <ChipGroup label="可能的反应" options={goodOptions} value={goodReaction} onChange={updateGoodReaction} />
          <CalibrationCard>
            好信号可以说明此刻有一点连接，或我暂时松了一口气；它不能保证未来，也不需要马上换成更多确认。
          </CalibrationCard>
        </SignalStep>
      ) : null}

      {step === "absent" ? (
        <SignalStep
          progress="3/4 如果没有信号"
          title="如果没有看到想要的信号，我可能会怎样？"
          helper="先保护自己，不让一个信号决定全部。"
          actions={
            <>
              <button className="button button--primary" type="button" onClick={() => setStep("action")}>
                选择 10 分钟
              </button>
              <button className="button button--ghost" type="button" onClick={goBack}>
                <ArrowLeft size={16} strokeWidth={1.8} />
                返回
              </button>
            </>
          }
        >
          <ChipGroup
            label="可能的反应"
            options={absentOptions}
            value={absentReaction}
            onChange={updateAbsentReaction}
          />
          <CalibrationCard>
            没有信号也不能证明我不重要、连接消失、我做错了，或未来已经结束。它更可能说明：我现在很不安。
          </CalibrationCard>
        </SignalStep>
      ) : null}

      {step === "action" ? (
        <SignalStep
          progress="4/4 给自己 10 分钟"
          title="先给自己 10 分钟，不把决定交给信号"
          helper="10 分钟后你仍然可以决定。"
          actions={
            <>
              <button className="button button--primary" type="button" onClick={() => setStep("completion")}>
                {isCheckingPath ? "继续检查并记录" : "就这个，10 分钟"}
              </button>
              <button className="button button--ghost" type="button" onClick={() => updateAction("five_senses")}>
                换一个
              </button>
            </>
          }
        >
          <div className="signal-check-recommend">
            <span>推荐先试</span>
            <strong>{getRecommendedAction(absentReaction)}</strong>
            <p>只需要 10 分钟，不用把今天全部想明白。</p>
          </div>
          <ChipGroup label="这 10 分钟先做什么" options={actionOptions} value={action} onChange={updateAction} />
        </SignalStep>
      ) : null}

      {step === "completion" ? (
        <section className="completion-card">
          <span className="completion-card__icon">
            <CheckCircle2 size={24} strokeWidth={1.8} />
          </span>
          <div className="completion-card__copy">
            <h2>{isCheckingPath ? "也可以。我们把模式看见" : "你把主动权拿回来了一点"}</h2>
            <p>
              {isCheckingPath
                ? "检查也可以被看见。重要的是知道：我在期待什么，检查后发生了什么。"
                : "10 分钟不是放弃关系，是不让不安直接开车。"}
            </p>
          </div>
          <dl className="completion-card__rows">
            <div>
              <dt>想确认</dt>
              <dd>{signalCheckTargetCopy[target]}</dd>
            </div>
            <div>
              <dt>这次选择</dt>
              <dd>{signalCheckActionCopy[action]}</dd>
            </div>
          </dl>
          {isCheckingPath ? (
            <ChipGroup label="检查后发生了什么" options={resultOptions} value={result} onChange={updateResult} />
          ) : null}
          {message ? <p className="helper-text">{message}</p> : null}
          {error ? <p className="form-error">{error}</p> : null}
          {lastError && status === "save_error" ? <p className="form-error">{lastError}</p> : null}
          <div className="completion-card__actions">
            <button className="button button--primary" type="button" onClick={() => navigate("/return-to-self")}>
              <HeartHandshake size={16} strokeWidth={1.8} />
              开始回到自己
            </button>
            <button className="button button--secondary" type="button" onClick={savePattern}>
              <Save size={16} strokeWidth={1.8} />
              {isCheckingPath ? "保存结果" : "保存这个模式"}
            </button>
            {shouldOfferConnectionContinuity ? (
              <button
                className="button button--secondary"
                type="button"
                onClick={() => navigate("/connection-continuity", branchRouteState)}
              >
                看连接感
              </button>
            ) : null}
            <button className="button button--ghost" type="button" onClick={() => navigate("/home")}>
              完成
            </button>
          </div>
        </section>
      ) : null}
    </section>
  );
}

function SignalStep({
  progress,
  title,
  helper,
  children,
  actions,
}: {
  progress: string;
  title: string;
  helper: string;
  children: React.ReactNode;
  actions: React.ReactNode;
}) {
  return (
    <section className="step-screen">
      <div className="step-screen__header">
        <StepProgress value={progress} />
        <h1>{title}</h1>
        <p>{helper}</p>
      </div>
      <div className="step-screen__body">{children}</div>
      <div className="step-screen__actions">{actions}</div>
    </section>
  );
}

function CalibrationCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="signal-calibration-card">
      <span>校准一下</span>
      <p>{children}</p>
    </div>
  );
}

function getPreviousStep(step: StepId): StepId {
  if (step === "target") return "landing";
  if (step === "good") return "target";
  if (step === "absent") return "good";
  if (step === "action") return "absent";
  if (step === "completion") return "action";
  return "landing";
}

function getRecommendedAction(absentReaction: AbsentSignalReaction): string {
  if (absentReaction === "ruminate_sleep") return signalCheckActionCopy.phone_down_10;
  if (absentReaction === "self_blame") return "先写一句不攻击自己的话";
  if (absentReaction === "over_explain") return signalCheckActionCopy.draft_tomorrow;
  if (absentReaction === "connection_gone") return signalCheckActionCopy.warm_evidence;
  return signalCheckActionCopy.five_senses;
}
