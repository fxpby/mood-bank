import { ArrowRight, HeartHandshake, NotebookPen } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "../components/PageHeader";
import {
  experimentOutcomeCopy,
  experimentOutcomeHelper,
  getExperimentById,
} from "../domain/experiments";
import type { PersonalExperimentAttemptOutcome } from "../domain/types";
import { useAppStore } from "../store/AppStoreContext";
import {
  buildExperimentRoute,
  getExperimentRouteId,
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

export function ExperimentDetailPage({ navigate }: ExperimentDetailPageProps) {
  const { state, actions, status, lastError } = useAppStore();
  const experimentId = getExperimentRouteId(window.location.pathname);
  const experiment = getExperimentById(state, experimentId);
  const [outcome, setOutcome] = useState<PersonalExperimentAttemptOutcome>("partial");
  const [note, setNote] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  function saveAttempt() {
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
        <h1>{experiment.focus}</h1>
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
          <h2>记录一次练习</h2>
          <p>完成、完成一部分、只是看见，都会被温柔地记录。不适合也有信息。</p>
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
        {error ? <p className="form-error">{error}</p> : null}
        {lastError && status === "save_error" ? <p className="form-error">{lastError}</p> : null}
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
