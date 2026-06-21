import { ArrowRight, HeartHandshake, NotebookPen, Save } from "lucide-react";
import { useState } from "react";
import { ChipGroup, type ChipOption } from "../components/ChipGroup";
import { PageHeader } from "../components/PageHeader";
import {
  experimentOutcomeCopy,
  experimentOutcomeHelper,
  experimentStatusCopy,
  experimentStatusHelper,
  getExperimentById,
} from "../domain/experiments";
import type { PersonalExperimentAttemptOutcome, PersonalExperimentStatus } from "../domain/types";
import { useAppStore } from "../store/AppStoreContext";
import {
  buildExperimentRoute,
  getExperimentRouteId,
  buildTopicRoute,
  type AppRoute,
  type RouteState,
} from "../utils/route";

type ExperimentDetailPageProps = {
  navigate: (route: AppRoute, state?: RouteState) => void;
};

const outcomeOptions: PersonalExperimentAttemptOutcome[] = [
  "completed",
  "partial",
  "noticed",
  "not_suitable",
];

const statusOptions: ChipOption<PersonalExperimentStatus>[] = [
  { value: "active", label: experimentStatusCopy.active, helper: experimentStatusHelper.active },
  { value: "idea", label: experimentStatusCopy.idea, helper: experimentStatusHelper.idea },
  { value: "paused", label: experimentStatusCopy.paused, helper: experimentStatusHelper.paused },
  { value: "retired", label: experimentStatusCopy.retired, helper: experimentStatusHelper.retired },
];

export function ExperimentDetailPage({ navigate }: ExperimentDetailPageProps) {
  const { state, actions, status, lastError } = useAppStore();
  const experimentId = getExperimentRouteId(window.location.pathname);
  const experiment = getExperimentById(state, experimentId);
  const [outcome, setOutcome] = useState<PersonalExperimentAttemptOutcome>("partial");
  const [note, setNote] = useState("");
  const [latestOutcome, setLatestOutcome] = useState<PersonalExperimentAttemptOutcome | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFocus, setEditFocus] = useState("");
  const [editTinyAction, setEditTinyAction] = useState("");
  const [editMarker, setEditMarker] = useState("");
  const [learningNote, setLearningNote] = useState("");

  if (!experiment) {
    return (
      <section className="experiment-detail-page page-stack">
        <PageHeader
          title="这个小练习暂时找不到"
          kicker="它可能已经被清理，或这个链接不是现在这只储蓄罐里的内容。"
          onBack={() => navigate("/experiments")}
        />
        <section className="topics-empty">
          <h2>回到练习</h2>
          <p>你可以打开其他小练习，或重新存一个今天能试一次的动作。</p>
          <button className="button button--primary" type="button" onClick={() => navigate("/experiments")}>
            回到练习
          </button>
        </section>
      </section>
    );
  }

  const currentExperiment = experiment;
  const canRecordAttempt = currentExperiment.status === "active";

  function beginEdit() {
    setEditFocus(currentExperiment.focus);
    setEditTinyAction(currentExperiment.tinyAction);
    setEditMarker(currentExperiment.completionMarker);
    setIsEditing(true);
    setError(null);
    setFeedback(null);
  }

  function saveEdit() {
    if (!editFocus.trim() || !editTinyAction.trim() || !editMarker.trim()) {
      setError("先把三个小问题都留一句。");
      setFeedback(null);
      return;
    }

    const result = actions.updatePersonalExperiment({
      id: currentExperiment.id,
      focus: editFocus,
      tinyAction: editTinyAction,
      completionMarker: editMarker,
    });

    if (!result.ok) {
      setError(result.error ?? "这次还没有保存成功。");
      setFeedback(null);
      return;
    }

    setIsEditing(false);
    setError(null);
    setFeedback("小练习已更新。");
  }

  function updateStatus(nextStatus: PersonalExperimentStatus) {
    const result = actions.updatePersonalExperimentStatus({
      id: currentExperiment.id,
      status: nextStatus,
    });

    if (!result.ok) {
      setError(result.error ?? "这次还没有更新成功。");
      setFeedback(null);
      return;
    }

    setError(null);
    setFeedback(`已调整为：${experimentStatusCopy[nextStatus]}。`);
  }

  function saveLearningAsDiscoveryPoint() {
    const result = actions.savePersonalExperimentDiscoveryPoint({
      experimentId: currentExperiment.id,
      note: learningNote,
    });

    if (!result.ok || !result.value) {
      setError(result.ok ? "这次还没有存下。" : result.error ?? "这次还没有存下。");
      setFeedback(null);
      return;
    }

    setLearningNote("");
    setError(null);
    setFeedback("已存进稍后，可以之后再看。");
    navigate(buildTopicRoute(result.value.id));
  }

  function saveAttempt() {
    if (!canRecordAttempt) {
      setError("这个小练习现在不在进行中。先把状态调回「正在练」，再记录一次。");
      setFeedback(null);
      return;
    }

    const result = actions.savePersonalExperimentAttempt({
      experimentId: currentExperiment.id,
      outcome,
      note,
    });

    if (!result.ok) {
      setError(result.error ?? "这次还没有存下。");
      setFeedback(null);
      return;
    }

    if (!result.value) {
      setError("这次还没有存下。");
      setFeedback(null);
      return;
    }

    setNote("");
    setLatestOutcome(outcome);
    setError(null);
    setFeedback(`已记录：${experimentOutcomeCopy[outcome]}。`);
  }

  function recordReflection() {
    navigate("/record/new", {
      quickRecordPrefill: {
        source: "quick_record",
        title: `一次小练习：${currentExperiment.focus}`,
        facts: `我练习了「${currentExperiment.tinyAction}」。这次结果是：${experimentOutcomeCopy[outcome]}。`,
        nextAction: "not_now",
      },
    });
  }

  return (
    <section className="experiment-detail-page page-stack">
      <PageHeader title="小练习" kicker="记录一次就够，不需要保持表现。" onBack={() => navigate("/experiments")} />

      <section className="experiment-detail-hero panel page-stack">
        <span className="eyebrow">练习意图</span>
        <span className="experiment-status-pill">{experimentStatusCopy[currentExperiment.status]}</span>
        <h1>{experiment.focus}</h1>
        <p>{experimentStatusHelper[currentExperiment.status]}</p>
        <dl className="completion-card__rows">
          <div>
            <dt>微小动作</dt>
            <dd>{experiment.tinyAction}</dd>
          </div>
          <div>
            <dt>什么算练习过一次</dt>
            <dd>{experiment.completionMarker}</dd>
          </div>
        </dl>
      </section>

      <section className="panel page-stack">
        <div className="section-heading">
          <h2>整理这个小练习</h2>
          <p>可以改轻一点，也可以先停下。状态变化不会影响储蓄罐。</p>
        </div>
        <ChipGroup label="状态" options={statusOptions} value={currentExperiment.status} onChange={updateStatus} />
        {isEditing ? (
          <div className="page-stack">
            <label className="field">
              <span className="field-label">我想练习什么</span>
              <input
                className="field-input"
                value={editFocus}
                onChange={(event) => setEditFocus(event.target.value)}
              />
            </label>
            <label className="field">
              <span className="field-label">小到今天能试一次的动作</span>
              <input
                className="field-input"
                value={editTinyAction}
                onChange={(event) => setEditTinyAction(event.target.value)}
              />
            </label>
            <label className="field">
              <span className="field-label">什么算练习过一次</span>
              <input
                className="field-input"
                value={editMarker}
                onChange={(event) => setEditMarker(event.target.value)}
              />
            </label>
            <div className="experiments-inline-actions">
              <button className="button button--primary" type="button" onClick={saveEdit}>
                <Save size={16} strokeWidth={1.8} />
                保存修改
              </button>
              <button className="button button--ghost" type="button" onClick={() => setIsEditing(false)}>
                取消
              </button>
            </div>
          </div>
        ) : (
          <button className="button button--secondary" type="button" onClick={beginEdit}>
            编辑三句话
          </button>
        )}
      </section>

      <section className="panel page-stack">
        <div className="section-heading">
          <h2>记录一次练习</h2>
          <p>
            {canRecordAttempt
              ? "完成、完成一部分、只是看见，都会被温柔地记录。不适合也有信息。"
              : "这个小练习现在先放着。需要记录时，先把状态调回正在练。"}
          </p>
        </div>
        <div className="experiment-outcome-grid" role="group" aria-label="练习结果">
          {outcomeOptions.map((option) => (
            <button
              className="experiment-outcome"
              type="button"
              aria-pressed={outcome === option}
              key={option}
              onClick={() => setOutcome(option)}
            >
              <strong>{experimentOutcomeCopy[option]}</strong>
              <span>{experimentOutcomeHelper[option]}</span>
            </button>
          ))}
        </div>
        <label className="field">
          <span className="field-label">一点补充，可空着</span>
          <textarea
            className="field-textarea"
            value={note}
            rows={3}
            onChange={(event) => setNote(event.target.value)}
            placeholder="例如：我只做了一半，但我看见了自己在怕什么。"
          />
        </label>
        <button className="button button--primary" type="button" onClick={saveAttempt}>
          记录一次练习
        </button>
        {feedback ? <p className="helper-text">{feedback}</p> : null}
        {latestOutcome && latestOutcome !== "completed" ? (
          <button className="button button--secondary" type="button" onClick={() => navigate("/self-compassion")}>
            自我关怀一下
          </button>
        ) : null}
        {error ? <p className="form-error">{error}</p> : null}
        {lastError && status === "save_error" ? <p className="form-error">{lastError}</p> : null}
      </section>

      <section className="panel page-stack">
        <div className="section-heading">
          <h2>把一个学习点放进稍后</h2>
          <p>如果这次练习让你看见了什么，可以先存起来，不需要现在分析完。</p>
        </div>
        <label className="field">
          <span className="field-label">我想稍后再看的点，可空着</span>
          <textarea
            className="field-textarea"
            value={learningNote}
            rows={3}
            onChange={(event) => setLearningNote(event.target.value)}
            placeholder="例如：我发现自己收到照顾时会立刻想回报。"
          />
        </label>
        <button className="button button--secondary" type="button" onClick={saveLearningAsDiscoveryPoint}>
          存进稍后
        </button>
      </section>

      <section className="panel page-stack">
        <div className="section-heading">
          <h2>练习记录</h2>
          <p>只看最近发生过什么，不追赶进度。</p>
        </div>
        {experiment.attempts.length ? (
          <div className="experiment-attempt-list">
            {experiment.attempts.map((attempt) => (
              <article className="experiment-attempt-card" key={attempt.id}>
                <div>
                  <strong>{experimentOutcomeCopy[attempt.outcome]}</strong>
                  <time dateTime={attempt.createdAt}>{formatDate(attempt.createdAt)}</time>
                </div>
                <p>{attempt.note || experimentOutcomeHelper[attempt.outcome]}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="topics-empty">
            <h2>还没有记录过</h2>
            <p>可以等一次真的发生后再回来。只是想到它，也已经是一个入口。</p>
          </div>
        )}
      </section>

      <section className="completion-card">
        <span className="completion-card__icon">
          <ArrowRight size={24} strokeWidth={1.8} />
        </span>
        <div className="completion-card__copy">
          <h2>接下来可以很小</h2>
          <p>如果想多看一点，可以记录；如果现在有点被激活，先回到自己。</p>
        </div>
        <div className="completion-card__actions">
          <button className="button button--primary" type="button" onClick={() => navigate("/return-to-self")}>
            <HeartHandshake size={16} strokeWidth={1.8} />
            回到自己
          </button>
          <button className="button button--secondary" type="button" onClick={recordReflection}>
            <NotebookPen size={16} strokeWidth={1.8} />
            记录一下
          </button>
          <button className="button button--ghost" type="button" onClick={() => navigate(buildExperimentRoute(experiment.id))}>
            留在这里
          </button>
        </div>
      </section>
    </section>
  );
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
