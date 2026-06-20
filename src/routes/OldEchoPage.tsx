import { HeartHandshake, NotebookPen, Save } from "lucide-react";
import { useMemo, useState } from "react";
import { ChipGroup, type ChipOption } from "../components/ChipGroup";
import { CompletionCard } from "../components/CompletionCard";
import { PageHeader } from "../components/PageHeader";
import { StepScreen } from "../components/StepScreen";
import {
  buildOldEchoDiscoveryPointInput,
  getOldEchoSummary,
  oldEchoNeedCopy,
  oldEchoProtectionCopy,
  oldEchoResponseCopy,
  type OldEchoInput,
  type OldEchoNeed,
  type OldEchoProtection,
  type OldEchoResponse,
} from "../domain/oldEcho";
import { selectActiveSpace } from "../domain/selectors";
import { useAppStore } from "../store/AppStoreContext";
import type { AppRoute } from "../utils/route";

type OldEchoPageProps = {
  navigate: (route: AppRoute) => void;
};

type StepId = "gate" | "fact" | "need" | "protection" | "critic" | "response" | "completion";

const needOptions: ChipOption<OldEchoNeed>[] = [
  { value: "seen", label: oldEchoNeedCopy.seen },
  { value: "chosen", label: oldEchoNeedCopy.chosen },
  { value: "safety", label: oldEchoNeedCopy.safety },
  { value: "respect", label: oldEchoNeedCopy.respect },
  { value: "not_abandoned", label: oldEchoNeedCopy.not_abandoned },
  { value: "not_shamed", label: oldEchoNeedCopy.not_shamed },
  { value: "authentic", label: oldEchoNeedCopy.authentic },
  { value: "not_sure", label: oldEchoNeedCopy.not_sure },
];

const protectionOptions: ChipOption<OldEchoProtection>[] = [
  { value: "check", label: oldEchoProtectionCopy.check },
  { value: "prove", label: oldEchoProtectionCopy.prove },
  { value: "attack", label: oldEchoProtectionCopy.attack },
  { value: "withdraw", label: oldEchoProtectionCopy.withdraw },
  { value: "please", label: oldEchoProtectionCopy.please },
  { value: "control", label: oldEchoProtectionCopy.control },
  { value: "numb", label: oldEchoProtectionCopy.numb },
  { value: "rescue", label: oldEchoProtectionCopy.rescue },
  { value: "perfect", label: oldEchoProtectionCopy.perfect },
  { value: "not_sure", label: oldEchoProtectionCopy.not_sure },
];

const responseOptions: ChipOption<OldEchoResponse>[] = [
  { value: "name_present", label: "先分清今天和旧感觉" },
  { value: "return_to_self", label: "先回到自己" },
  { value: "record_facts", label: "只记录事实" },
  { value: "save_later", label: "存到稍后" },
  { value: "boundary_sentence", label: "写一句边界或请求" },
  { value: "support_person", label: "找真人支持" },
  { value: "not_sure", label: "现在先不决定" },
];

export function OldEchoPage({ navigate }: OldEchoPageProps) {
  const { state, actions, status, lastError } = useAppStore();
  const activeSpace = selectActiveSpace(state);
  const [step, setStep] = useState<StepId>("gate");
  const [presentFact, setPresentFact] = useState("");
  const [need, setNeed] = useState<OldEchoNeed>("not_abandoned");
  const [protection, setProtection] = useState<OldEchoProtection>("check");
  const [innerCritic, setInnerCritic] = useState("");
  const [response, setResponse] = useState<OldEchoResponse>("name_present");
  const [hasSaved, setHasSaved] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const input = useMemo<OldEchoInput>(
    () => ({
      spaceId: activeSpace?.id ?? "",
      presentFact,
      need,
      protection,
      innerCritic,
      response,
    }),
    [activeSpace?.id, innerCritic, need, presentFact, protection, response],
  );
  const summary = getOldEchoSummary(input);

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

    const result = actions.saveDiscoveryPoint(buildOldEchoDiscoveryPointInput(input));

    if (!result.ok) {
      setError(result.error ?? "这次还没有存下。");
      setMessage(null);
      return;
    }

    setHasSaved(true);
    setError(null);
    setMessage("已存入稍后。储蓄罐没有因为这次保存而变化。");
  }

  if (step === "gate") {
    return (
      <section className="old-echo-page page-stack">
        <PageHeader
          title="旧感觉 / 内部审判者"
          kicker="只轻轻看一下，不挖创伤，也不下诊断。"
          onBack={goBack}
        />
        <section className="old-echo-landing panel page-stack">
          <div className="section-heading">
            <h2>这一下可能比今天更旧</h2>
            <p>
              这里不是为了找出创伤来源，只是把今天的小事、旧感觉和严厉声音稍微分开。
              如果现在很满，可以先回到自己。
            </p>
          </div>
          <div className="old-echo-note">
            <span>校准句</span>
            <p>旧感觉是真的疼，但它不等于今天的全部事实。</p>
          </div>
          <div className="old-echo-actions">
            <button className="button button--primary" type="button" onClick={() => setStep("fact")}>
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

  if (step === "fact") {
    return (
      <StepScreen
        eyebrow="1/5 今天的蚊子"
        title="今天可确认的小事是什么？"
        helper="只写今天发生了什么，不急着解释它代表什么。"
        primaryLabel="继续"
        onPrimary={() => setStep("need")}
        onBack={goBack}
      >
        <label className="field">
          <span className="field-label">今天的事实，可很短</span>
          <textarea
            className="field-textarea"
            value={presentFact}
            onChange={(event) => {
              setPresentFact(event.target.value);
              resetSaveState();
            }}
            placeholder="例如：我看到对方暂时没有回复。"
            rows={4}
          />
        </label>
      </StepScreen>
    );
  }

  if (step === "need") {
    return (
      <StepScreen
        eyebrow="2/5 被碰到的需要"
        title="它可能碰到了哪个需要？"
        helper="不是找唯一真相，只是给这份疼一点语言。"
        primaryLabel="继续"
        onPrimary={() => setStep("protection")}
        onBack={goBack}
      >
        <ChipGroup
          label="可能被碰到"
          options={needOptions}
          value={need}
          onChange={(value) => {
            setNeed(value);
            resetSaveState();
          }}
        />
      </StepScreen>
    );
  }

  if (step === "protection") {
    return (
      <StepScreen
        eyebrow="3/5 旧保护程序"
        title="它想让我怎么保护自己？"
        helper="看见保护程序，不等于要照做。"
        primaryLabel="继续"
        onPrimary={() => setStep("critic")}
        onBack={goBack}
      >
        <ChipGroup
          label="旧保护程序想让我"
          options={protectionOptions}
          value={protection}
          onChange={(value) => {
            setProtection(value);
            resetSaveState();
          }}
        />
      </StepScreen>
    );
  }

  if (step === "critic") {
    return (
      <StepScreen
        eyebrow="4/5 内部审判者"
        title="有没有一个很严厉的声音？"
        helper="可以写一句，也可以空着。看见它，不等于相信它。"
        primaryLabel="继续"
        onPrimary={() => setStep("response")}
        onBack={goBack}
      >
        <label className="field">
          <span className="field-label">它在说什么，可空着</span>
          <textarea
            className="field-textarea"
            value={innerCritic}
            onChange={(event) => {
              setInnerCritic(event.target.value);
              resetSaveState();
            }}
            placeholder="例如：我是不是太麻烦了。"
            rows={4}
          />
        </label>
      </StepScreen>
    );
  }

  if (step === "response") {
    return (
      <StepScreen
        eyebrow="5/5 当下的我"
        title="现在可以怎样回应自己？"
        helper="只选一个小动作，不需要解决整段历史。"
        primaryLabel="看总结"
        onPrimary={() => setStep("completion")}
        onBack={goBack}
      >
        <ChipGroup
          label="当下的我选择"
          options={responseOptions}
          value={response}
          onChange={(value) => {
            setResponse(value);
            resetSaveState();
          }}
        />
      </StepScreen>
    );
  }

  return (
    <section className="old-echo-page page-stack">
      <CompletionCard
        title="这一下已经被看见一点"
        body="不需要立刻知道源头。今天和旧感觉先分开一点，就已经是在练习。"
        rows={[
          { label: "今天的蚊子", value: summary.presentFact },
          { label: "可能被碰到", value: summary.need },
          { label: "旧保护程序", value: summary.protection },
          { label: "内部审判者", value: summary.innerCritic },
          { label: "当下回应", value: summary.response },
        ]}
      >
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
        <button className="button button--secondary" type="button" onClick={() => navigate("/record/new")}>
          <NotebookPen size={16} strokeWidth={1.8} />
          记录一下
        </button>
        <button className="button button--primary" type="button" onClick={() => navigate("/home")}>
          完成
        </button>
      </CompletionCard>
    </section>
  );
}

function getPreviousStep(step: StepId): StepId {
  if (step === "fact") return "gate";
  if (step === "need") return "fact";
  if (step === "protection") return "need";
  if (step === "critic") return "protection";
  if (step === "response") return "critic";
  if (step === "completion") return "response";
  return "gate";
}
