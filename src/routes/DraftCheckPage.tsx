import { ArrowLeft, HeartHandshake, MessageSquareText, Save, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { ChipGroup, type ChipOption } from "../components/ChipGroup";
import { PageHeader } from "../components/PageHeader";
import {
  buildDraftCheckDiscoveryPointInput,
  buildDraftCheckDraftInput,
  buildDraftCheckPrivateRecordInput,
  draftAfterSendCopy,
  draftCheckMotivationCopy,
  draftCheckStateCopy,
  draftContentRiskCopy,
  draftNoResponseToleranceCopy,
  draftRecommendationCopy,
  draftStanceCopy,
  getDraftCheckRecommendation,
  type DraftAfterSend,
  type DraftCheckMotivation,
  type DraftCheckRecommendation,
  type DraftCheckSaveInput,
  type DraftCheckState,
  type DraftContentRisk,
  type DraftNoResponseTolerance,
  type DraftStance,
} from "../domain/draftCheck";
import { selectActiveSpace } from "../domain/selectors";
import { useAppStore } from "../store/AppStoreContext";
import type { AppRoute } from "../utils/route";

type DraftCheckPageProps = {
  navigate: (route: AppRoute) => void;
};

type StepId =
  | "landing"
  | "state"
  | "motivation"
  | "tolerance"
  | "content"
  | "stance"
  | "afterSend"
  | "recommendation";

type SaveKind = "discovery" | "draft" | "privateRecord";

const stateOptions: ChipOption<DraftCheckState>[] = [
  { value: "present", label: draftCheckStateCopy.present },
  { value: "connection_alarm", label: draftCheckStateCopy.connection_alarm },
  { value: "old_echo", label: draftCheckStateCopy.old_echo },
  { value: "inner_judge", label: draftCheckStateCopy.inner_judge },
  { value: "boundary_pressure", label: draftCheckStateCopy.boundary_pressure },
  { value: "body_overload", label: draftCheckStateCopy.body_overload },
  { value: "not_sure", label: draftCheckStateCopy.not_sure },
];

const motivationOptions: ChipOption<DraftCheckMotivation>[] = [
  { value: "express_feeling", label: draftCheckMotivationCopy.express_feeling },
  { value: "repair_apologize", label: draftCheckMotivationCopy.repair_apologize },
  { value: "make_request", label: draftCheckMotivationCopy.make_request },
  { value: "name_boundary", label: draftCheckMotivationCopy.name_boundary },
  { value: "stay_present", label: draftCheckMotivationCopy.stay_present },
  { value: "hope_response", label: draftCheckMotivationCopy.hope_response },
  { value: "prove_self", label: draftCheckMotivationCopy.prove_self },
  { value: "rescue_other", label: draftCheckMotivationCopy.rescue_other },
  { value: "ease_anxiety", label: draftCheckMotivationCopy.ease_anxiety },
  { value: "show_wrong", label: draftCheckMotivationCopy.show_wrong },
];

const toleranceOptions: ChipOption<DraftNoResponseTolerance>[] = [
  { value: "return_to_life", label: draftNoResponseToleranceCopy.return_to_life },
  { value: "hard_but_wait", label: draftNoResponseToleranceCopy.hard_but_wait },
  { value: "check_repeatedly", label: draftNoResponseToleranceCopy.check_repeatedly },
  { value: "send_more", label: draftNoResponseToleranceCopy.send_more },
  { value: "ruminate_sleep", label: draftNoResponseToleranceCopy.ruminate_sleep },
  { value: "collapse", label: draftNoResponseToleranceCopy.collapse },
  { value: "not_sure", label: draftNoResponseToleranceCopy.not_sure },
];

const contentOptions: ChipOption<DraftContentRisk>[] = [
  { value: "low_risk", label: draftContentRiskCopy.low_risk },
  { value: "too_private", label: draftContentRiskCopy.too_private },
  { value: "analyze_other", label: draftContentRiskCopy.analyze_other },
  { value: "must_reply", label: draftContentRiskCopy.must_reply },
  { value: "over_explain", label: draftContentRiskCopy.over_explain },
  { value: "too_many_topics", label: draftContentRiskCopy.too_many_topics },
  { value: "unclear_boundary", label: draftContentRiskCopy.unclear_boundary },
  { value: "attack_blame", label: draftContentRiskCopy.attack_blame },
  { value: "not_sure", label: draftContentRiskCopy.not_sure },
];

const stanceOptions: ChipOption<DraftStance>[] = [
  { value: "creator", label: draftStanceCopy.creator },
  { value: "coach", label: draftStanceCopy.coach },
  { value: "challenger", label: draftStanceCopy.challenger },
  { value: "victim", label: draftStanceCopy.victim },
  { value: "rescuer", label: draftStanceCopy.rescuer },
  { value: "persecutor", label: draftStanceCopy.persecutor },
  { value: "not_sure", label: draftStanceCopy.not_sure },
];

const afterSendOptions: ChipOption<DraftAfterSend>[] = [
  { value: "return_to_life", label: draftAfterSendCopy.return_to_life },
  { value: "clearer", label: draftAfterSendCopy.clearer },
  { value: "more_boundary", label: draftAfterSendCopy.more_boundary },
  { value: "watch_reply", label: draftAfterSendCopy.watch_reply },
  { value: "regret_withdraw", label: draftAfterSendCopy.regret_withdraw },
  { value: "send_more", label: draftAfterSendCopy.send_more },
  { value: "ruminate_sleep", label: draftAfterSendCopy.ruminate_sleep },
  { value: "not_sure", label: draftAfterSendCopy.not_sure },
];

export function DraftCheckPage({ navigate }: DraftCheckPageProps) {
  const { state: appState, actions, status, lastError } = useAppStore();
  const activeSpace = selectActiveSpace(appState);
  const [step, setStep] = useState<StepId>("landing");
  const [draftText, setDraftText] = useState("");
  const [state, setState] = useState<DraftCheckState>("present");
  const [motivation, setMotivation] = useState<DraftCheckMotivation>("express_feeling");
  const [noResponseTolerance, setNoResponseTolerance] =
    useState<DraftNoResponseTolerance>("hard_but_wait");
  const [contentRisk, setContentRisk] = useState<DraftContentRisk>("low_risk");
  const [stance, setStance] = useState<DraftStance>("creator");
  const [afterSend, setAfterSend] = useState<DraftAfterSend>("return_to_life");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedKinds, setSavedKinds] = useState<Set<SaveKind>>(() => new Set());

  const checkInput = useMemo(
    () => ({
      draftText,
      state,
      motivation,
      noResponseTolerance,
      contentRisk,
      stance,
      afterSend,
    }),
    [afterSend, contentRisk, draftText, motivation, noResponseTolerance, stance, state],
  );
  const result = getDraftCheckRecommendation(checkInput);
  const recommendationCopy = draftRecommendationCopy[result.recommendation];
  const shouldOfferOldEcho = state === "old_echo" || state === "inner_judge";

  function goBack() {
    setMessage(null);
    setError(null);
    if (step === "landing") {
      navigate("/home");
      return;
    }
    setStep(getPreviousStep(step));
  }

  function startCheck() {
    setMessage(null);
    setError(null);
    setStep("state");
  }

  function updateDraftText(value: string) {
    setDraftText(value);
    resetSaveStatus();
  }

  function updateState(value: DraftCheckState) {
    setState(value);
    resetSaveStatus();
  }

  function updateMotivation(value: DraftCheckMotivation) {
    setMotivation(value);
    resetSaveStatus();
  }

  function updateNoResponseTolerance(value: DraftNoResponseTolerance) {
    setNoResponseTolerance(value);
    resetSaveStatus();
  }

  function updateContentRisk(value: DraftContentRisk) {
    setContentRisk(value);
    resetSaveStatus();
  }

  function updateStance(value: DraftStance) {
    setStance(value);
    resetSaveStatus();
  }

  function updateAfterSend(value: DraftAfterSend) {
    setAfterSend(value);
    resetSaveStatus();
  }

  function resetSaveStatus() {
    setMessage(null);
    setError(null);
    setSavedKinds(new Set());
  }

  function getSaveInput(): DraftCheckSaveInput | null {
    if (!activeSpace) {
      setError("还没有可以保存的空间。");
      setMessage(null);
      return null;
    }

    return {
      ...checkInput,
      spaceId: activeSpace.id,
      spaceType: activeSpace.type,
    };
  }

  function saveDiscoveryPoint(recommendation: DraftCheckRecommendation = result.recommendation) {
    if (savedKinds.has("discovery")) {
      setMessage("已经存到稍后再看。");
      setError(null);
      return;
    }

    const input = getSaveInput();
    if (!input) return;

    const saveResult = actions.saveDiscoveryPoint(
      buildDraftCheckDiscoveryPointInput(input, recommendation),
    );

    if (!saveResult.ok) {
      setError(saveResult.error ?? "这次还没有存下。");
      setMessage(null);
      return;
    }

    setSavedKinds((current) => new Set(current).add("discovery"));
    setError(null);
    setMessage("已存到稍后再看。储蓄罐没有因为这次保存而变化。");
  }

  function saveDraft() {
    if (savedKinds.has("draft")) {
      setMessage("草稿已经存下。");
      setError(null);
      return;
    }

    const input = getSaveInput();
    if (!input) return;

    const saveResult = actions.saveDraft(buildDraftCheckDraftInput(input));

    if (!saveResult.ok) {
      setError(saveResult.error ?? "这次草稿还没有保存成功。");
      setMessage(null);
      return;
    }

    setSavedKinds((current) => new Set(current).add("draft"));
    setError(null);
    setMessage("草稿已存下。它不会让储蓄罐变化。");
  }

  function savePrivateRecord() {
    if (savedKinds.has("privateRecord")) {
      setMessage("已经转成私下记录。");
      setError(null);
      return;
    }

    if (!draftText.trim()) {
      setError("还没有草稿内容可以转成私下记录。");
      setMessage(null);
      return;
    }

    const input = getSaveInput();
    if (!input) return;

    const saveResult = actions.saveQuickRecord(buildDraftCheckPrivateRecordInput(input));

    if (!saveResult.ok) {
      setError(saveResult.error ?? "这次还没有保存成记录。");
      setMessage(null);
      return;
    }

    setSavedKinds((current) => new Set(current).add("privateRecord"));
    setError(null);
    setMessage("已转成私下记录。它只保存你的线索，不替对方下结论。");
  }

  return (
    <section className="draft-check-page page-stack">
      <PageHeader
        title="草稿自检"
        kicker="这里不会帮你写得更会获得回应，只帮你看：现在适不适合发。"
        onBack={goBack}
      />

      {step === "landing" ? (
        <section className="draft-check-landing panel">
          <MessageSquareText size={26} strokeWidth={1.8} />
          <div className="section-heading">
            <h2>先不急着发</h2>
            <p>把想发的话放在这里，或先跳过。这里不会替你发送，也不会预测对方反应。</p>
          </div>
          <label className="field">
            <span className="field-label">草稿</span>
            <textarea
              className="field-textarea draft-check-textarea"
              value={draftText}
              onChange={(event) => updateDraftText(event.target.value)}
              placeholder="把想发的话放在这里，或先跳过。"
              rows={6}
            />
          </label>
          <div className="draft-check-actions">
            <button className="button button--primary" type="button" onClick={startCheck}>
              开始自检
            </button>
            <button className="button button--secondary" type="button" onClick={startCheck}>
              还没写，先检查状态
            </button>
            <button className="button button--ghost" type="button" onClick={() => navigate("/return-to-self")}>
              <HeartHandshake size={16} strokeWidth={1.8} />
              直接回到自己
            </button>
          </div>
        </section>
      ) : null}

      {step === "state" ? (
        <DraftStep
          progress="1/6 当前状态"
          title="现在是我在说话，还是浪在说话？"
          helper="先看见此刻状态。被触发不代表不能表达，只是需要慢一点。"
          onNext={() => setStep("motivation")}
          onBack={goBack}
        >
          <ChipGroup label="此刻更像" options={stateOptions} value={state} onChange={updateState} />
          <CalibrationCard>
            连接警报、旧感觉、内部审判者都不是错误。它们是在提醒你：这里可能有在乎、害怕或旧伤口。
          </CalibrationCard>
        </DraftStep>
      ) : null}

      {step === "motivation" ? (
        <DraftStep
          progress="2/6 发送动机"
          title="这段话最想完成什么？"
          helper="一个草稿可以有很多层，先选最响的那一层。"
          onNext={() => setStep("tolerance")}
          onBack={goBack}
        >
          <ChipGroup
            label="主要动机"
            options={motivationOptions}
            value={motivation}
            onChange={updateMotivation}
          />
        </DraftStep>
      ) : null}

      {step === "tolerance" ? (
        <DraftStep
          progress="3/6 无回应承受度"
          title="如果暂时没有回应，我会怎样？"
          helper="这一步不是劝你别发，而是确认发送后你还在自己这里。"
          onNext={() => setStep("content")}
          onBack={goBack}
        >
          <ChipGroup
            label="可能的反应"
            options={toleranceOptions}
            value={noResponseTolerance}
            onChange={updateNoResponseTolerance}
          />
          <CalibrationCard>
            想要回应很正常。自检只是在问：如果回应没有马上来，我是否还有一点回到生活的空间。
          </CalibrationCard>
        </DraftStep>
      ) : null}

      {step === "content" ? (
        <DraftStep
          progress="4/6 内容压力"
          title="草稿里最需要减轻的是什么？"
          helper="不做隐私识别，只让你自己看一眼压力、话题量和边界。"
          onNext={() => setStep("stance")}
          onBack={goBack}
        >
          <ChipGroup
            label="可能的压力点"
            options={contentOptions}
            value={contentRisk}
            onChange={updateContentRisk}
          />
        </DraftStep>
      ) : null}

      {step === "stance" ? (
        <DraftStep
          progress="5/6 主体姿态"
          title="这段话更像从哪个位置发出？"
          helper="借用戏剧三角和赋能三角，只看姿态，不给自己贴标签。"
          onNext={() => setStep("afterSend")}
          onBack={goBack}
        >
          <ChipGroup label="此刻姿态" options={stanceOptions} value={stance} onChange={updateStance} />
          <CalibrationCard>
            更稳的方向通常不是证明、拯救或控诉，而是回到创造者、引导者、挑战者：我表达我的选择、支持但不接管、清楚说出边界。
          </CalibrationCard>
        </DraftStep>
      ) : null}

      {step === "afterSend" ? (
        <DraftStep
          progress="6/6 发送后预演"
          title="如果发出去，接下来更可能发生什么？"
          helper="预演不是预测对方，只是看见自己发送后的状态。"
          onNext={() => setStep("recommendation")}
          onBack={goBack}
          primaryLabel="查看建议"
        >
          <ChipGroup
            label="发送后我可能会"
            options={afterSendOptions}
            value={afterSend}
            onChange={updateAfterSend}
          />
        </DraftStep>
      ) : null}

      {step === "recommendation" ? (
        <section className="completion-card draft-recommend-card">
          <span className="completion-card__icon">
            <Sparkles size={24} strokeWidth={1.8} />
          </span>
          <div className="completion-card__copy">
            <h2>{recommendationCopy.title}</h2>
            <p>{recommendationCopy.copy}</p>
          </div>
          <div className="draft-reason-card">
            <span>依据</span>
            <p>{result.reason}</p>
          </div>
          <dl className="completion-card__rows">
            <div>
              <dt>当前状态</dt>
              <dd>{draftCheckStateCopy[state]}</dd>
            </div>
            <div>
              <dt>主要动机</dt>
              <dd>{draftCheckMotivationCopy[motivation]}</dd>
            </div>
            <div>
              <dt>发送后预演</dt>
              <dd>{draftAfterSendCopy[afterSend]}</dd>
            </div>
          </dl>
          {message ? <p className="helper-text">{message}</p> : null}
          {error ? <p className="form-error">{error}</p> : null}
          {lastError && status === "save_error" ? <p className="form-error">{lastError}</p> : null}
          <div className="completion-card__actions">{renderRecommendationActions(result.recommendation)}</div>
        </section>
      ) : null}
    </section>
  );

  function renderRecommendationActions(recommendation: DraftCheckRecommendation) {
    return (
      <>
        {recommendation === "ready_enough" ? (
          <button className="button button--secondary" type="button" onClick={() => saveDiscoveryPoint()}>
            <Save size={16} strokeWidth={1.8} />
            保存检查结果
          </button>
        ) : null}
        {recommendation === "lighten_it" ? (
          <>
            <button className="button button--secondary" type="button" onClick={() => saveDiscoveryPoint()}>
              <Save size={16} strokeWidth={1.8} />
              保存轻一点方向
            </button>
            <button className="button button--secondary" type="button" onClick={saveDraft}>
              保存草稿
            </button>
          </>
        ) : null}
        {recommendation === "save_as_draft" ? (
          <button className="button button--secondary" type="button" onClick={saveDraft}>
            <Save size={16} strokeWidth={1.8} />
            保存草稿
          </button>
        ) : null}
        {recommendation === "private_record_first" ? (
          <>
            {draftText.trim() ? (
              <button className="button button--secondary" type="button" onClick={savePrivateRecord}>
                转成私下记录
              </button>
            ) : null}
            <button className="button button--secondary" type="button" onClick={() => saveDiscoveryPoint()}>
              <Save size={16} strokeWidth={1.8} />
              放进稍后
            </button>
          </>
        ) : null}
        {recommendation === "boundary_expression" ? (
          <>
            <button className="button button--secondary" type="button" onClick={() => saveDiscoveryPoint()}>
              <Save size={16} strokeWidth={1.8} />
              保存边界方向
            </button>
            <button className="button button--secondary" type="button" onClick={saveDraft}>
              保存草稿
            </button>
          </>
        ) : null}
        {recommendation === "return_to_self_first" ? (
          <>
            <button className="button button--secondary" type="button" onClick={saveDraft}>
              <Save size={16} strokeWidth={1.8} />
              保存草稿不发
            </button>
            <button className="button button--primary" type="button" onClick={() => navigate("/return-to-self")}>
              <HeartHandshake size={16} strokeWidth={1.8} />
              进入回到自己
            </button>
          </>
        ) : null}
        {recommendation !== "return_to_self_first" ? (
          <button className="button button--primary" type="button" onClick={() => navigate("/return-to-self")}>
            <HeartHandshake size={16} strokeWidth={1.8} />
            回到自己
          </button>
        ) : null}
        {shouldOfferOldEcho ? (
          <button className="button button--secondary" type="button" onClick={() => navigate("/old-echo")}>
            看看旧感觉
          </button>
        ) : null}
        <button className="button button--ghost" type="button" onClick={() => navigate("/home")}>
          完成
        </button>
      </>
    );
  }
}

function DraftStep({
  progress,
  title,
  helper,
  children,
  onNext,
  onBack,
  primaryLabel = "下一步",
}: {
  progress: string;
  title: string;
  helper: string;
  children: React.ReactNode;
  onNext: () => void;
  onBack: () => void;
  primaryLabel?: string;
}) {
  return (
    <section className="step-screen">
      <div className="step-screen__header">
        <div className="step-screen__top">
          <span>{progress}</span>
        </div>
        <h1>{title}</h1>
        <p>{helper}</p>
      </div>
      <div className="step-screen__body">{children}</div>
      <div className="step-screen__actions">
        <button className="button button--primary" type="button" onClick={onNext}>
          {primaryLabel}
        </button>
        <button className="button button--ghost" type="button" onClick={onBack}>
          <ArrowLeft size={16} strokeWidth={1.8} />
          返回
        </button>
      </div>
    </section>
  );
}

function CalibrationCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="draft-calibration-card">
      <span>校准一下</span>
      <p>{children}</p>
    </div>
  );
}

function getPreviousStep(step: StepId): StepId {
  if (step === "state") return "landing";
  if (step === "motivation") return "state";
  if (step === "tolerance") return "motivation";
  if (step === "content") return "tolerance";
  if (step === "stance") return "content";
  if (step === "afterSend") return "stance";
  if (step === "recommendation") return "afterSend";
  return "landing";
}
