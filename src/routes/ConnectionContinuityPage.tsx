import { HeartHandshake, Link2, Save } from "lucide-react";
import { useMemo, useState } from "react";
import { ChipGroup, type ChipOption } from "../components/ChipGroup";
import { BranchActivationNudge } from "../components/BranchActivationNudge";
import { CompletionCard } from "../components/CompletionCard";
import { PageHeader } from "../components/PageHeader";
import { StepScreen } from "../components/StepScreen";
import {
  buildConnectionContinuityDiscoveryPointInput,
  connectionContinuityActionCopy,
  connectionContinuityStateCopy,
  getConnectionContinuitySummary,
  type ConnectionContinuityAction,
  type ConnectionContinuityInput,
  type ConnectionContinuityState,
} from "../domain/connectionContinuity";
import { selectActiveSpace } from "../domain/selectors";
import { useAppStore } from "../store/AppStoreContext";
import type { AppRoute } from "../utils/route";

type ConnectionContinuityPageProps = {
  navigate: (route: AppRoute) => void;
};

type StepId = "gate" | "state" | "evidence" | "action" | "completion";

const stateOptions: ChipOption<ConnectionContinuityState>[] = [
  { value: "still_there_far", label: connectionContinuityStateCopy.still_there_far },
  { value: "feels_gone", label: connectionContinuityStateCopy.feels_gone },
  { value: "urge_confirm", label: connectionContinuityStateCopy.urge_confirm },
  { value: "urge_cut_off", label: connectionContinuityStateCopy.urge_cut_off },
  { value: "push_pull", label: connectionContinuityStateCopy.push_pull },
  { value: "self_disconnected", label: connectionContinuityStateCopy.self_disconnected },
  { value: "not_sure", label: connectionContinuityStateCopy.not_sure },
];

const actionOptions: ChipOption<ConnectionContinuityAction>[] = [
  { value: "delay_ten", label: connectionContinuityActionCopy.delay_ten },
  { value: "look_warm_evidence", label: connectionContinuityActionCopy.look_warm_evidence },
  { value: "facts_not_conclusions", label: connectionContinuityActionCopy.facts_not_conclusions },
  { value: "return_to_self", label: connectionContinuityActionCopy.return_to_self },
  { value: "save_later_topic", label: connectionContinuityActionCopy.save_later_topic },
  { value: "close", label: connectionContinuityActionCopy.close },
];

export function ConnectionContinuityPage({ navigate }: ConnectionContinuityPageProps) {
  const { state: appState, actions, status, lastError } = useAppStore();
  const activeSpace = selectActiveSpace(appState);
  const [step, setStep] = useState<StepId>("gate");
  const [state, setState] = useState<ConnectionContinuityState>("urge_confirm");
  const [existedEvidence, setExistedEvidence] = useState("");
  const [cannotProve, setCannotProve] = useState("");
  const [action, setAction] = useState<ConnectionContinuityAction>("delay_ten");
  const [hasSaved, setHasSaved] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const input = useMemo<ConnectionContinuityInput>(
    () => ({
      spaceId: activeSpace?.id ?? "",
      state,
      existedEvidence,
      cannotProve,
      action,
    }),
    [activeSpace?.id, action, cannotProve, existedEvidence, state],
  );
  const summary = getConnectionContinuitySummary(input);

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

    const result = actions.saveDiscoveryPoint(buildConnectionContinuityDiscoveryPointInput(input));

    if (!result.ok) {
      setError(result.error ?? "这次还没有存下。");
      setMessage(null);
      return;
    }

    setHasSaved(true);
    setError(null);
    setMessage("已存为连接感发现点。储蓄罐没有因为这次保存而变化。");
  }

  if (step === "gate") {
    return (
      <section className="connection-continuity-page page-stack">
        <PageHeader
          title="连接感轻检查"
          kicker="只分开事实和感觉，不判断关系。"
          onBack={goBack}
        />
        <section className="connection-continuity-landing panel page-stack">
          <BranchActivationNudge
            onReturnToSelf={() => navigate("/return-to-self")}
            onContinue={() => setStep("state")}
            continueLabel="继续看连接感"
          />
          <Link2 size={26} strokeWidth={1.8} />
          <div className="section-heading">
            <h2>连接感现在很响</h2>
            <p>
              有时连接感会突然像消失了一样。这里不诊断依恋，也不证明关系结论，
              只看事实、感觉和接下来 10 分钟。
            </p>
          </div>
          <div className="connection-continuity-note">
            <span>校准句</span>
            <p>感觉像消失，不等于事实已经消失。先把事实和感觉分开，再决定动作。</p>
          </div>
          <div className="connection-continuity-actions">
            <button className="button button--primary" type="button" onClick={() => setStep("state")}>
              看连接感
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

  if (step === "state") {
    return (
      <StepScreen
        eyebrow="1/3 此刻连接感"
        title="此刻消失的是事实，还是连接感？"
        helper="只看这一刻，不把它变成我的类型或关系结论。"
        primaryLabel="继续"
        onPrimary={() => setStep("evidence")}
        onBack={goBack}
      >
        <ChipGroup
          label="此刻更像"
          options={stateOptions}
          value={state}
          onChange={(value) => {
            setState(value);
            resetSaveState();
          }}
        />
      </StepScreen>
    );
  }

  if (step === "evidence") {
    return (
      <StepScreen
        eyebrow="2/3 事实和不能证明"
        title="有什么能被记得？又有什么还不能证明？"
        helper="可以空着。默认句也会帮你把事实和感觉分开放。"
        primaryLabel="继续"
        onPrimary={() => setStep("action")}
        onBack={goBack}
      >
        <label className="field">
          <span className="field-label">曾经存在的事实/自我接触，可空着</span>
          <textarea
            className="field-textarea connection-continuity-textarea"
            value={existedEvidence}
            onChange={(event) => {
              setExistedEvidence(event.target.value);
              resetSaveState();
            }}
            placeholder="例如：对方昨天具体回应了我说的那句话。"
            rows={4}
          />
        </label>
        <label className="field">
          <span className="field-label">现在还不能证明，可空着</span>
          <textarea
            className="field-textarea connection-continuity-textarea"
            value={cannotProve}
            onChange={(event) => {
              setCannotProve(event.target.value);
              resetSaveState();
            }}
            placeholder="例如：现在没回复，不能证明我不重要。"
            rows={4}
          />
        </label>
      </StepScreen>
    );
  }

  if (step === "action") {
    return (
      <StepScreen
        eyebrow="3/3 下一步"
        title="我先靠什么维持 10 分钟的稳定？"
        helper="不是解决关系，只是先不让连接警报替我行动。"
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
    <section className="connection-continuity-page page-stack">
      <CompletionCard
        title="连接感和事实先分开了一点"
        body="这不是关系判决，也不是安全保证。只是帮你把当下的连接警报放慢一点。"
        rows={[
          { label: "此刻连接感", value: summary.state },
          { label: "曾经存在的事实/自我接触", value: summary.existedEvidence },
          { label: "现在还不能证明", value: summary.cannotProve },
          { label: "我负责的一步", value: summary.action },
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
        <button className="button button--secondary" type="button" onClick={() => navigate("/signal-check")}>
          回到信号检查
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
  if (step === "state") return "gate";
  if (step === "evidence") return "state";
  if (step === "action") return "evidence";
  if (step === "completion") return "action";
  return "gate";
}
