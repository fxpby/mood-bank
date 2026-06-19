import { ArrowRight, CheckCircle2, HeartHandshake, NotebookPen, RefreshCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "../components/PageHeader";
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
import { useAppStore } from "../store/AppStoreContext";
import type { AppRoute, RouteState } from "../utils/route";

type ExperimentsPageProps = {
  navigate: (route: AppRoute, state?: RouteState) => void;
};

type CompletionState = "choosing" | "selected" | "completed";

export function ExperimentsPage({ navigate }: ExperimentsPageProps) {
  const { state } = useAppStore();
  const activeSpace = selectActiveSpace(state);
  const market = selectTodayMarket(state);
  const marketLabel = selectTodayMarketLabel(state);
  const marketNote = selectTodayMarketNote(state);
  const [rotationIndex, setRotationIndex] = useState(0);
  const [selectedAction, setSelectedAction] = useState<PersonalAction | null>(null);
  const [completionState, setCompletionState] = useState<CompletionState>("choosing");
  const actionSet = useMemo(
    () => getPersonalActionSet({ market, rotationIndex }),
    [market, rotationIndex],
  );
  const visibleActions = [actionSet.recommended, ...actionSet.alternatives];

  function chooseAction(action: PersonalAction) {
    setSelectedAction(action);
    setCompletionState("selected");
  }

  function rotateActions() {
    setRotationIndex((current) => getNextPersonalActionRotation(current));
    setSelectedAction(null);
    setCompletionState("choosing");
  }

  function completeAction() {
    setCompletionState("completed");
  }

  function recordSelectedAction(action: PersonalAction) {
    navigate("/record/new", {
      quickRecordPrefill: buildPersonalActionQuickRecordPrefill(action),
    });
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
