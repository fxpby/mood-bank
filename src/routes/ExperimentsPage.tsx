import {
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  NotebookPen,
  Plus,
  RefreshCcw,
} from "lucide-react";
import { useMemo, useState } from "react";
import { ChipGroup, type ChipOption } from "../components/ChipGroup";
import { PageHeader } from "../components/PageHeader";
import {
  experimentStatusCopy,
  experimentStatusHelper,
  getExperimentsByStatus,
} from "../domain/experiments";
import {
  buildPersonalActionQuickRecordPrefill,
  getNextPersonalActionRotation,
  getPersonalActionSet,
  personalActionCategoryCopy,
  type PersonalAction,
} from "../domain/personalActions";
import {
  selectActiveSpace,
  selectTodayMarket,
  selectTodayMarketLabel,
  selectTodayMarketNote,
} from "../domain/selectors";
import type { PersonalExperimentStatus } from "../domain/types";
import { useAppStore } from "../store/AppStoreContext";
import { buildExperimentRoute, type AppRoute, type RouteState } from "../utils/route";

type ExperimentsPageProps = {
  navigate: (route: AppRoute, state?: RouteState) => void;
};

type CompletionState = "choosing" | "selected" | "completed";

type ExperimentFilter = PersonalExperimentStatus | "all";

const experimentFilterOptions: ChipOption<ExperimentFilter>[] = [
  { value: "active", label: experimentStatusCopy.active },
  { value: "idea", label: experimentStatusCopy.idea },
  { value: "paused", label: experimentStatusCopy.paused },
  { value: "retired", label: experimentStatusCopy.retired },
  { value: "all", label: "全部" },
];

export function ExperimentsPage({ navigate }: ExperimentsPageProps) {
  const { state, actions, status, lastError } = useAppStore();
  const activeSpace = selectActiveSpace(state);
  const market = selectTodayMarket(state);
  const marketLabel = selectTodayMarketLabel(state);
  const marketNote = selectTodayMarketNote(state);
  const [rotationIndex, setRotationIndex] = useState(0);
  const [selectedAction, setSelectedAction] = useState<PersonalAction | null>(null);
  const [completionState, setCompletionState] = useState<CompletionState>("choosing");
  const [focus, setFocus] = useState("");
  const [tinyAction, setTinyAction] = useState("");
  const [completionMarker, setCompletionMarker] = useState("");
  const [filter, setFilter] = useState<ExperimentFilter>("active");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const actionSet = useMemo(
    () => getPersonalActionSet({ market, rotationIndex }),
    [market, rotationIndex],
  );
  const visibleActions = [actionSet.recommended, ...actionSet.alternatives];
  const savedExperiments = getExperimentsByStatus(state, filter);

  function chooseAction(action: PersonalAction) {
    setSelectedAction(action);
    setCompletionState("selected");
  }

  function rotateActions() {
    setRotationIndex((current) => getNextPersonalActionRotation(current));
    setSelectedAction(null);
    setCompletionState("choosing");
    setFeedback(null);
    setError(null);
  }

  function completeAction() {
    setCompletionState("completed");
  }

  function recordSelectedAction(action: PersonalAction) {
    navigate("/record/new", {
      quickRecordPrefill: buildPersonalActionQuickRecordPrefill(action),
    });
  }

  function saveSelectedActionAsExperiment(action: PersonalAction) {
    if (!activeSpace) {
      setError("还没有可以保存的空间。");
      setFeedback(null);
      return;
    }

    const result = actions.savePersonalExperiment({
      spaceId: activeSpace.id,
      focus: personalActionCategoryCopy[action.category],
      tinyAction: action.label,
      completionMarker: action.completionMarker,
      source: "personal_action",
      sourceActionId: action.id,
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

    setError(null);
    setFeedback("已存成小练习。可以之后回来记录一次。");
    navigate(buildExperimentRoute(result.value.id));
  }

  function saveManualExperiment(nextStatus: PersonalExperimentStatus) {
    if (!activeSpace) {
      setError("还没有可以保存的空间。");
      setFeedback(null);
      return;
    }

    if (!focus.trim() || !tinyAction.trim() || !completionMarker.trim()) {
      setError("先把三个小问题都留一句。");
      setFeedback(null);
      return;
    }

    const result = actions.savePersonalExperiment({
      spaceId: activeSpace.id,
      focus,
      tinyAction,
      completionMarker,
      status: nextStatus,
      source: "manual",
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

    setFocus("");
    setTinyAction("");
    setCompletionMarker("");
    setError(null);
    setFeedback(nextStatus === "idea" ? "已先存成一个小想法。" : "小练习已存下。");
    navigate(buildExperimentRoute(result.value.id));
  }

  return (
    <section className="experiments-page page-stack">
      <PageHeader
        title="取一个支持自己的小动作"
        kicker="只选一个，别把照顾自己也变成任务。"
        onBack={() => navigate("/home")}
      />

      <section className="experiments-context panel">
        <div>
          <span className="eyebrow">今天的状态</span>
          <h2>{marketLabel}</h2>
          <p>{marketNote}</p>
        </div>
        <div className="experiments-context__space">
          <span>当前空间</span>
          <strong>{activeSpace?.displayName ?? "某段关系"}</strong>
        </div>
      </section>

      {completionState !== "completed" ? (
        <section className="panel page-stack">
          <div className="section-heading">
            <h2>今天先试这一个</h2>
            <p>推荐只是帮你减少选择，不代表其他动作不对。</p>
          </div>
          <div className="personal-action-menu experiments-action-menu">
            {visibleActions.map((action, index) => (
              <PersonalActionButton
                action={action}
                badge={index === 0 ? "推荐" : "也可以"}
                isSelected={selectedAction?.id === action.id}
                key={action.id}
                onClick={() => chooseAction(action)}
              />
            ))}
          </div>
          <div className="experiments-inline-actions">
            {selectedAction ? (
              <button
                className="button button--primary"
                type="button"
                onClick={() => saveSelectedActionAsExperiment(selectedAction)}
              >
                <Plus size={16} strokeWidth={1.8} />
                存成小练习
              </button>
            ) : null}
            <button className="button button--secondary" type="button" onClick={rotateActions}>
              <RefreshCcw size={16} strokeWidth={1.8} />
              换一个
            </button>
            <button className="button button--ghost" type="button" onClick={() => navigate("/home")}>
              稍后
            </button>
          </div>
        </section>
      ) : null}

      {completionState === "selected" && selectedAction ? (
        <section className="account-action-confirmation experiments-selection" role="status">
          <div>
            <span>{personalActionCategoryCopy[selectedAction.category]}</span>
            <p>已放进今天的小动作：{selectedAction.label}</p>
            <small>{selectedAction.helper}</small>
          </div>
          <div className="experiments-inline-actions">
            <button className="button button--primary" type="button" onClick={completeAction}>
              <CheckCircle2 size={16} strokeWidth={1.8} />
              完成一点
            </button>
            <button className="button button--ghost" type="button" onClick={rotateActions}>
              <RefreshCcw size={16} strokeWidth={1.8} />
              换一个
            </button>
            <button
              className="button button--secondary"
              type="button"
              onClick={() => saveSelectedActionAsExperiment(selectedAction)}
            >
              <Plus size={16} strokeWidth={1.8} />
              存成小练习
            </button>
          </div>
        </section>
      ) : null}

      {completionState === "completed" && selectedAction ? (
        <section className="completion-card experiments-completion-card">
          <span className="completion-card__icon">
            <CheckCircle2 size={24} strokeWidth={1.8} />
          </span>
          <div className="completion-card__copy">
            <h2>完成一点就算</h2>
            <p>不是为了表现，是为了把自己带回来。</p>
          </div>
          <dl className="completion-card__rows">
            <div>
              <dt>今天的小动作</dt>
              <dd>{selectedAction.label}</dd>
            </div>
            <div>
              <dt>算练习过一次</dt>
              <dd>{selectedAction.completionMarker}</dd>
            </div>
          </dl>
          <div className="completion-card__actions">
            <button className="button button--primary" type="button" onClick={() => navigate("/return-to-self")}>
              <HeartHandshake size={16} strokeWidth={1.8} />
              回到自己
            </button>
            <button className="button button--secondary" type="button" onClick={() => recordSelectedAction(selectedAction)}>
              <NotebookPen size={16} strokeWidth={1.8} />
              记录一下
            </button>
            <button className="button button--ghost" type="button" onClick={() => navigate("/home")}>
              完成
              <ArrowRight size={16} strokeWidth={1.8} />
            </button>
          </div>
        </section>
      ) : null}

      <section className="panel page-stack">
        <div className="section-heading">
          <h2>自己建一个小练习</h2>
          <p>三个短句就够，不需要写成计划。</p>
        </div>
        <label className="field">
          <span className="field-label">我想练习什么</span>
          <input
            className="field-input"
            value={focus}
            onChange={(event) => setFocus(event.target.value)}
            placeholder="例如：慢一点回复"
          />
        </label>
        <label className="field">
          <span className="field-label">小到今天能试一次的动作</span>
          <input
            className="field-input"
            value={tinyAction}
            onChange={(event) => setTinyAction(event.target.value)}
            placeholder="例如：先写一句事实，不发送"
          />
        </label>
        <label className="field">
          <span className="field-label">什么算练习过一次</span>
          <input
            className="field-input"
            value={completionMarker}
            onChange={(event) => setCompletionMarker(event.target.value)}
            placeholder="例如：写出来就算"
          />
        </label>
        <div className="experiments-inline-actions">
          <button className="button button--primary" type="button" onClick={() => saveManualExperiment("active")}>
            <Plus size={16} strokeWidth={1.8} />
            存下小练习
          </button>
          <button className="button button--secondary" type="button" onClick={() => saveManualExperiment("idea")}>
            先存成想法
          </button>
        </div>
        {feedback ? <p className="helper-text">{feedback}</p> : null}
        {error ? <p className="form-error">{error}</p> : null}
        {lastError && status === "save_error" ? <p className="form-error">{lastError}</p> : null}
      </section>

      <section className="panel page-stack">
        <div className="section-heading">
          <h2>已经存下的小练习</h2>
          <p>只是给之后的自己留一个入口。</p>
        </div>
        <ChipGroup label="筛选" options={experimentFilterOptions} value={filter} onChange={setFilter} />
        {savedExperiments.length ? (
          <div className="experiment-list">
            {savedExperiments.map((experiment) => (
              <article className="experiment-card" key={experiment.id}>
                <span>{experimentStatusCopy[experiment.status]}</span>
                <small>{experiment.attempts.length ? `记录过 ${experiment.attempts.length} 次` : "还没记录"}</small>
                <h3>{experiment.focus}</h3>
                <p>{experiment.tinyAction}</p>
                <p>{experimentStatusHelper[experiment.status]}</p>
                <button
                  className="button button--secondary"
                  type="button"
                  onClick={() => navigate(buildExperimentRoute(experiment.id))}
                >
                  打开练习
                  <ArrowRight size={16} strokeWidth={1.8} />
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="topics-empty">
            <h2>还没有存下小练习</h2>
            <p>可以先从一个推荐动作开始，也可以自己写一个很小的动作。</p>
          </div>
        )}
      </section>
    </section>
  );
}

function PersonalActionButton({
  action,
  badge,
  isSelected,
  onClick,
}: {
  action: PersonalAction;
  badge: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`personal-action-menu__item${isSelected ? " is-selected" : ""}`}
      type="button"
      aria-pressed={isSelected}
      onClick={onClick}
    >
      <span>{badge}</span>
      <strong>{action.label}</strong>
      <small>{action.helper}</small>
    </button>
  );
}
