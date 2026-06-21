import { ArrowLeft, CheckCircle2, HeartHandshake, NotebookPen, Save } from "lucide-react";
import { useMemo, useState } from "react";
import { ChipGroup, type ChipOption } from "../components/ChipGroup";
import { PageHeader } from "../components/PageHeader";
import {
  buildRichIncomingDiscoveryPointInputs,
  getActiveRichIncomingThreads,
  getOverflowRichIncomingThreads,
  getRichIncomingAnchorSuggestion,
  getRichIncomingSummary,
  richIncomingDirectionCopy,
  richIncomingEmotionCopy,
  richIncomingHandlingCopy,
  richIncomingShapeCopy,
  richIncomingThreadCopy,
  type RichIncomingDirection,
  type RichIncomingEmotion,
  type RichIncomingHandling,
  type RichIncomingShape,
  type RichIncomingThread,
} from "../domain/richIncoming";
import { selectActiveSpace } from "../domain/selectors";
import { useAppStore } from "../store/AppStoreContext";
import type { AppRoute } from "../utils/route";

type RichIncomingPageProps = {
  navigate: (route: AppRoute) => void;
};

type StepId = "landing" | "threads" | "emotions" | "handling" | "direction" | "completion";

const shapeOptions: ChipOption<RichIncomingShape>[] = [
  { value: "warm", label: richIncomingShapeCopy.warm },
  { value: "many_threads", label: richIncomingShapeCopy.many_threads },
  { value: "vulnerable", label: richIncomingShapeCopy.vulnerable },
  { value: "long_explanation", label: richIncomingShapeCopy.long_explanation },
  { value: "want_careful_reply", label: richIncomingShapeCopy.want_careful_reply },
  { value: "pressure", label: richIncomingShapeCopy.pressure },
  { value: "seen", label: richIncomingShapeCopy.seen },
  { value: "fear_missing", label: richIncomingShapeCopy.fear_missing },
  { value: "not_sure", label: richIncomingShapeCopy.not_sure },
];

const threadOptions: ChipOption<RichIncomingThread>[] = [
  { value: "being_seen", label: richIncomingThreadCopy.being_seen },
  { value: "clarification", label: richIncomingThreadCopy.clarification },
  { value: "vulnerability", label: richIncomingThreadCopy.vulnerability },
  { value: "language_buffer", label: richIncomingThreadCopy.language_buffer },
  { value: "rumination_sleep", label: richIncomingThreadCopy.rumination_sleep },
  { value: "perfectionism_delay", label: richIncomingThreadCopy.perfectionism_delay },
  { value: "values_meaning", label: richIncomingThreadCopy.values_meaning },
  { value: "mutual_care", label: richIncomingThreadCopy.mutual_care },
  { value: "later_topic", label: richIncomingThreadCopy.later_topic },
  { value: "other", label: richIncomingThreadCopy.other },
];

const emotionOptions: ChipOption<RichIncomingEmotion>[] = [
  { value: "warm", label: richIncomingEmotionCopy.warm },
  { value: "seen", label: richIncomingEmotionCopy.seen },
  { value: "moved", label: richIncomingEmotionCopy.moved },
  { value: "grateful", label: richIncomingEmotionCopy.grateful },
  { value: "settled", label: richIncomingEmotionCopy.settled },
  { value: "excited", label: richIncomingEmotionCopy.excited },
  { value: "fear_reply_badly", label: richIncomingEmotionCopy.fear_reply_badly },
  { value: "pressure", label: richIncomingEmotionCopy.pressure },
  { value: "overloaded", label: richIncomingEmotionCopy.overloaded },
  { value: "want_reply_now", label: richIncomingEmotionCopy.want_reply_now },
  { value: "want_escape", label: richIncomingEmotionCopy.want_escape },
  { value: "ruminate_sleep", label: richIncomingEmotionCopy.ruminate_sleep },
  { value: "mixed", label: richIncomingEmotionCopy.mixed },
  { value: "not_sure", label: richIncomingEmotionCopy.not_sure },
];

const handlingOptions: ChipOption<RichIncomingHandling>[] = [
  { value: "received", label: richIncomingHandlingCopy.received },
  { value: "needs_response", label: richIncomingHandlingCopy.needs_response },
  { value: "save_later", label: richIncomingHandlingCopy.save_later },
  { value: "no_response_needed", label: richIncomingHandlingCopy.no_response_needed },
];

const directionOptions: ChipOption<RichIncomingDirection>[] = [
  { value: "acknowledge_received", label: richIncomingDirectionCopy.acknowledge_received },
  { value: "respond_one_thread", label: richIncomingDirectionCopy.respond_one_thread },
  { value: "express_gratitude", label: richIncomingDirectionCopy.express_gratitude },
  { value: "ask_open_question", label: richIncomingDirectionCopy.ask_open_question },
  { value: "reflect_key_point", label: richIncomingDirectionCopy.reflect_key_point },
  { value: "save_without_reply", label: richIncomingDirectionCopy.save_without_reply },
  { value: "draft_check", label: richIncomingDirectionCopy.draft_check },
  { value: "return_to_self", label: richIncomingDirectionCopy.return_to_self },
];

export function RichIncomingPage({ navigate }: RichIncomingPageProps) {
  const { state, actions, status, lastError } = useAppStore();
  const activeSpace = selectActiveSpace(state);
  const [step, setStep] = useState<StepId>("landing");
  const [messageNote, setMessageNote] = useState("");
  const [shapes, setShapes] = useState<RichIncomingShape[]>(["many_threads"]);
  const [selectedThreads, setSelectedThreads] = useState<RichIncomingThread[]>([
    "being_seen",
    "later_topic",
  ]);
  const [emotions, setEmotions] = useState<RichIncomingEmotion[]>(["mixed"]);
  const [handlingByThread, setHandlingByThread] = useState<
    Partial<Record<RichIncomingThread, RichIncomingHandling>>
  >({});
  const [direction, setDirection] = useState<RichIncomingDirection>("acknowledge_received");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [anchorText, setAnchorText] = useState("");
  const [anchorMessage, setAnchorMessage] = useState<string | null>(null);
  const [anchorError, setAnchorError] = useState<string | null>(null);
  const [hasSavedTopics, setHasSavedTopics] = useState(false);
  const activeThreads = useMemo(
    () => getActiveRichIncomingThreads(selectedThreads),
    [selectedThreads],
  );
  const overflowThreads = useMemo(
    () => getOverflowRichIncomingThreads(selectedThreads),
    [selectedThreads],
  );
  const effectiveHandlingByThread = useMemo(() => {
    const next: Partial<Record<RichIncomingThread, RichIncomingHandling>> = {
      ...handlingByThread,
    };

    for (const thread of activeThreads) {
      next[thread] ??= getDefaultHandling(thread);
    }

    return next;
  }, [activeThreads, handlingByThread]);
  const saveInput = useMemo(
    () => ({
      spaceId: activeSpace?.id ?? "",
      messageNote,
      shapes,
      selectedThreads,
      emotions,
      handlingByThread: effectiveHandlingByThread,
      direction,
    }),
    [
      activeSpace?.id,
      direction,
      effectiveHandlingByThread,
      emotions,
      messageNote,
      selectedThreads,
      shapes,
    ],
  );
  const summary = getRichIncomingSummary(saveInput);
  const anchorSuggestion = getRichIncomingAnchorSuggestion(saveInput);
  const discoveryPointInputs = activeSpace ? buildRichIncomingDiscoveryPointInputs(saveInput) : [];
  const shouldOfferSeeingEvidence =
    shapes.includes("seen") ||
    shapes.includes("warm") ||
    selectedThreads.includes("being_seen") ||
    selectedThreads.includes("mutual_care") ||
    emotions.includes("seen") ||
    emotions.includes("warm") ||
    emotions.includes("moved") ||
    emotions.includes("grateful") ||
    emotions.includes("settled");
  const shouldOfferHealthyLove =
    shouldOfferSeeingEvidence ||
    selectedThreads.includes("values_meaning") ||
    selectedThreads.includes("vulnerability") ||
    direction === "ask_open_question" ||
    direction === "reflect_key_point" ||
    direction === "express_gratitude";

  function goBack() {
    setMessage(null);
    setError(null);
    if (step === "landing") {
      navigate("/record");
      return;
    }
    setStep(getPreviousStep(step));
  }

  function toggleShape(value: RichIncomingShape) {
    setShapes((current) => toggleItem(current, value));
    resetSaveState();
  }

  function toggleThread(value: RichIncomingThread) {
    setSelectedThreads((current) => toggleItem(current, value));
    resetSaveState();
  }

  function toggleEmotion(value: RichIncomingEmotion) {
    setEmotions((current) => toggleItem(current, value));
    resetSaveState();
  }

  function setHandling(thread: RichIncomingThread, value: RichIncomingHandling) {
    setHandlingByThread((current) => ({ ...current, [thread]: value }));
    resetSaveState();
  }

  function updateDirection(value: RichIncomingDirection) {
    setDirection(value);
    resetSaveState();
  }

  function resetSaveState() {
    setMessage(null);
    setError(null);
    setAnchorMessage(null);
    setAnchorError(null);
    setHasSavedTopics(false);
  }

  function showCompletion() {
    setAnchorText(anchorSuggestion);
    setAnchorMessage(null);
    setAnchorError(null);
    setStep("completion");
  }

  function saveTopics() {
    if (hasSavedTopics) {
      setMessage("这些线索已经存进稍后。");
      setError(null);
      return;
    }

    if (!activeSpace) {
      setError("还没有可以保存的空间。");
      setMessage(null);
      return;
    }

    if (!discoveryPointInputs.length) {
      setMessage("这次没有选择要放进稍后的线索。完成也可以。");
      setError(null);
      return;
    }

    const result = actions.saveDiscoveryPoints(discoveryPointInputs);

    if (!result.ok) {
      setError(result.error ?? "这次还没有存下。");
      setMessage(null);
      return;
    }

    setHasSavedTopics(true);
    setError(null);
    setMessage(`已存入稍后 ${discoveryPointInputs.length} 个线索。储蓄罐没有因为这次保存而变化。`);
  }

  function saveAnchor() {
    const trimmedAnchor = anchorText.trim();

    if (!trimmedAnchor) {
      setAnchorError("先留一句能托住自己的话。");
      setAnchorMessage(null);
      return;
    }

    if (!activeSpace) {
      setAnchorError("还没有可以保存的空间。");
      setAnchorMessage(null);
      return;
    }

    const result = actions.saveAnchor({
      spaceId: activeSpace.id,
      text: trimmedAnchor,
    });

    if (!result.ok) {
      setAnchorError(result.error ?? "这次还没有保存成功，锚点还没有写进本机。");
      setAnchorMessage(null);
      return;
    }

    setAnchorText(result.value?.text ?? trimmedAnchor);
    setAnchorError(null);
    setAnchorMessage("锚点已存下，首页会优先显示这句话。");
  }

  return (
    <section className="rich-incoming-page page-stack">
      <PageHeader
        title="先不用一次接住全部"
        kicker="可以只存你收到的部分，不急着决定怎么回。"
        onBack={goBack}
      />

      {step === "landing" ? (
        <section className="rich-incoming-landing panel page-stack">
          <div className="section-heading">
            <h2>这段大概是什么样</h2>
            <p>这里不会自动总结内容，也不会判断对方意图。只帮你把自己收到的线索放清楚。</p>
          </div>
          <label className="field">
            <span className="field-label">可选备注</span>
            <textarea
              className="field-textarea rich-incoming-note"
              value={messageNote}
              onChange={(event) => {
                setMessageNote(event.target.value);
                resetSaveState();
              }}
              placeholder="可以贴一小段，或只写一句：这段大概在说什么。"
              rows={5}
            />
          </label>
          <MultiChipGroup
            label="这段让我感觉"
            options={shapeOptions}
            values={shapes}
            onToggle={toggleShape}
          />
          <div className="rich-incoming-actions">
            <button className="button button--primary" type="button" onClick={() => setStep("threads")}>
              拆成几条线索
            </button>
            <button className="button button--secondary" type="button" onClick={() => navigate("/return-to-self")}>
              <HeartHandshake size={16} strokeWidth={1.8} />
              直接回到自己
            </button>
          </div>
        </section>
      ) : null}

      {step === "threads" ? (
        <RichStep
          progress="1/4 收到什么"
          title="这段里，我先收到了什么？"
          helper="不是总结全文，只是选你心里有反应的几条。"
          onNext={() => setStep("emotions")}
          onBack={goBack}
        >
          <MultiChipGroup
            label="线索"
            options={threadOptions}
            values={selectedThreads}
            onToggle={toggleThread}
          />
          {overflowThreads.length ? (
            <div className="rich-incoming-note-card">
              <span>先处理前三条</span>
              <p>其余 {overflowThreads.length} 条会作为稍后线索保留在总结里，不需要现在全部想完。</p>
            </div>
          ) : null}
        </RichStep>
      ) : null}

      {step === "emotions" ? (
        <RichStep
          progress="2/4 混合情绪"
          title="收到这些以后，我现在是什么状态？"
          helper="温暖和压力可以同时存在。"
          onNext={() => setStep("handling")}
          onBack={goBack}
        >
          <MultiChipGroup
            label="此刻状态"
            options={emotionOptions}
            values={emotions}
            onToggle={toggleEmotion}
          />
        </RichStep>
      ) : null}

      {step === "handling" ? (
        <RichStep
          progress="3/4 每条怎么放"
          title="每一条线索，现在怎么放？"
          helper="每条只选一个处理方式，减少过载。"
          onNext={() => setStep("direction")}
          onBack={goBack}
        >
          <div className="rich-thread-list">
            {activeThreads.map((thread) => (
              <section className="rich-thread-card" key={thread}>
                <div className="section-heading">
                  <h2>{richIncomingThreadCopy[thread]}</h2>
                  <p>{getThreadHint(thread)}</p>
                </div>
                <ChipGroup
                  label="处理方式"
                  options={handlingOptions}
                  value={handlingByThread[thread] ?? getDefaultHandling(thread)}
                  onChange={(value) => setHandling(thread, value)}
                />
              </section>
            ))}
          </div>
        </RichStep>
      ) : null}

      {step === "direction" ? (
        <RichStep
          progress="4/4 够小的方向"
          title="如果要回，一次够不够只回一个方向？"
          helper="回应不必覆盖所有线索，先让对方知道你收到了也可以。"
          onNext={showCompletion}
          onBack={goBack}
          primaryLabel="看总结"
        >
          <ChipGroup
            label="一个足够的下一步"
            options={directionOptions}
            value={direction}
            onChange={updateDirection}
          />
        </RichStep>
      ) : null}

      {step === "completion" ? (
        <section className="completion-card rich-incoming-completion">
          <span className="completion-card__icon">
            <CheckCircle2 size={24} strokeWidth={1.8} />
          </span>
          <div className="completion-card__copy">
            <h2>这次先存到这里</h2>
            <p>不需要一次回应所有线索。先看见，已经能少丢一点。</p>
          </div>
          <dl className="completion-card__rows">
            <div>
              <dt>我收到的温暖/理解</dt>
              <dd>{summary.warmth}</dd>
            </div>
            <div>
              <dt>现在需要回应的一条</dt>
              <dd>{summary.response}</dd>
            </div>
            <div>
              <dt>可以稍后再看的点</dt>
              <dd>{summary.later}</dd>
            </div>
            <div>
              <dt>我身体/情绪的状态</dt>
              <dd>{summary.state}</dd>
            </div>
            <div>
              <dt>一个足够的下一步</dt>
              <dd>{summary.next}</dd>
            </div>
          </dl>
          {message ? <p className="helper-text">{message}</p> : null}
          {error ? <p className="form-error">{error}</p> : null}
          {lastError && status === "save_error" ? <p className="form-error">{lastError}</p> : null}
          <section className="rich-incoming-anchor">
            <div className="section-heading">
              <h2>留一句锚点</h2>
              <p>如果这次有一句话能托住你，可以存下给之后的自己。它不是关系证明，也不需要对方承担。</p>
            </div>
            <label className="field">
              <span className="field-label">锚点内容</span>
              <textarea
                className="field-textarea rich-incoming-anchor__textarea"
                value={anchorText}
                onChange={(event) => {
                  setAnchorText(event.target.value);
                  setAnchorMessage(null);
                  setAnchorError(null);
                }}
                rows={3}
              />
            </label>
            <button className="button button--secondary" type="button" onClick={saveAnchor}>
              <Save size={16} strokeWidth={1.8} />
              存成锚点
            </button>
            {anchorMessage ? <p className="helper-text">{anchorMessage}</p> : null}
            {anchorError ? <p className="form-error">{anchorError}</p> : null}
          </section>
          <div className="completion-card__actions">
            <button className="button button--secondary" type="button" onClick={saveTopics}>
              <Save size={16} strokeWidth={1.8} />
              把发现点存进稍后
            </button>
            <button className="button button--secondary" type="button" onClick={() => navigate("/record/new")}>
              <NotebookPen size={16} strokeWidth={1.8} />
              保存为记录
            </button>
            <button className="button button--secondary" type="button" onClick={() => navigate("/draft-check")}>
              进入草稿自检
            </button>
            {shouldOfferSeeingEvidence ? (
              <button className="button button--secondary" type="button" onClick={() => navigate("/seeing-evidence")}>
                看见被看见的证据
              </button>
            ) : null}
            {shouldOfferHealthyLove ? (
              <button className="button button--secondary" type="button" onClick={() => navigate("/healthy-love")}>
                学习怎么爱/被爱
              </button>
            ) : null}
            <button className="button button--secondary" type="button" onClick={() => navigate("/repair-understanding")}>
              修复/理解一下
            </button>
            <button className="button button--secondary" type="button" onClick={() => navigate("/return-to-self")}>
              <HeartHandshake size={16} strokeWidth={1.8} />
              回到自己
            </button>
            <button className="button button--ghost" type="button" onClick={() => navigate("/home")}>
              完成
            </button>
          </div>
        </section>
      ) : null}
    </section>
  );
}

function RichStep({
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

function MultiChipGroup<TValue extends string>({
  label,
  options,
  values,
  onToggle,
}: {
  label: string;
  options: ChipOption<TValue>[];
  values: TValue[];
  onToggle: (value: TValue) => void;
}) {
  return (
    <fieldset className="chip-group">
      <legend>{label}</legend>
      <div className="chip-row">
        {options.map((option) => (
          <button
            className="chip"
            type="button"
            aria-pressed={values.includes(option.value)}
            key={option.value}
            onClick={() => onToggle(option.value)}
          >
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function toggleItem<TValue extends string>(items: TValue[], value: TValue): TValue[] {
  return items.includes(value) ? items.filter((item) => item !== value) : [...items, value];
}

function getDefaultHandling(thread: RichIncomingThread): RichIncomingHandling {
  if (thread === "later_topic" || thread === "values_meaning") return "save_later";
  if (thread === "clarification") return "needs_response";
  return "received";
}

function getThreadHint(thread: RichIncomingThread): string {
  if (thread === "being_seen") return "这条可以先收下，不需要马上换成更多回应。";
  if (thread === "vulnerability") return "先确认我收到了，再决定是否给建议。";
  if (thread === "rumination_sleep") return "这条适合先放下，不让夜里继续加码。";
  if (thread === "perfectionism_delay") return "不需要一次回应得完美。";
  if (thread === "later_topic") return "适合稍后再聊，不必现在解决。";
  return "先选一个放法，别一次接住全部。";
}

function getPreviousStep(step: StepId): StepId {
  if (step === "threads") return "landing";
  if (step === "emotions") return "threads";
  if (step === "handling") return "emotions";
  if (step === "direction") return "handling";
  if (step === "completion") return "direction";
  return "landing";
}
