import { ArrowRight, CheckCircle2, NotebookPen, Plus, RefreshCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { accountCopy } from "../copy/accounts";
import {
  buildPersonalActionExperimentInput,
  buildPersonalActionQuickRecordPrefill,
  getNextPersonalActionRotation,
  getPersonalActionSet,
  personalActionCategoryCopy,
  type PersonalAction,
} from "../domain/personalActions";
import {
  selectAccountDetail,
  selectActiveSpace,
  selectTodayMarket,
  type AccountDetailSourceRow,
} from "../domain/selectors";
import type { AccountId } from "../domain/types";
import { useAppStore } from "../store/AppStoreContext";
import { buildExperimentRoute, buildRecordRoute, type AppRoute, type RouteState } from "../utils/route";

type AccountDetailPageProps = {
  account: AccountId;
  navigate: (route: AppRoute, state?: RouteState) => void;
};

type ActionFeedback = {
  message: string;
  experimentRoute: `/experiments/${string}`;
};

const accountTitles: Record<AccountId, string> = {
  connection: "连接明细",
  self: "自己明细",
  energy: "能量明细",
};

const accountKickers: Record<AccountId, string> = {
  connection: "这里只放可观察的接触证据，也允许不确定。",
  self: "这里记录你把自己带回来的一点点选择。",
  energy: "这里帮助你看见什么在消耗，什么在恢复。",
};

const reasonExplanations: Record<AccountId, string[]> = {
  connection: [
    "只有具体回应、被看见，或自己和自己的真实接触，才会进入连接明细。",
    "期待、猜测和沉默不会被当成关系结论。",
  ],
  self: [
    "事实和解释分开、选择一个自己能完成的动作，会进入自己明细。",
    "这里不是评价你够不够好，只记录主体性回来的时刻。",
  ],
  energy: [
    "只有你明确标记轻了一点或更累了，才会进入能量明细。",
    "能量低不是失败，它只是提醒你换一个更轻的动作。",
  ],
};

export function AccountDetailPage({ account, navigate }: AccountDetailPageProps) {
  const { state, actions: storeActions, status, lastError } = useAppStore();
  const activeSpace = selectActiveSpace(state);
  const market = selectTodayMarket(state);
  const [rotationIndex, setRotationIndex] = useState(0);
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<ActionFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const detail = useMemo(() => selectAccountDetail(state, account), [account, state]);
  const actionSet = useMemo(
    () => getPersonalActionSet({ market, rotationIndex }),
    [market, rotationIndex],
  );
  const visibleActions = [actionSet.recommended, ...actionSet.alternatives];
  const selectedAction = visibleActions.find((action) => action.id === selectedActionId);

  function chooseAction(action: PersonalAction) {
    setSelectedActionId(action.id);
    setFeedback(null);
    setError(null);
  }

  function rotateActions() {
    setRotationIndex((current) => getNextPersonalActionRotation(current));
    setSelectedActionId(null);
    setFeedback(null);
    setError(null);
  }

  function clearSelection() {
    setSelectedActionId(null);
    setFeedback(null);
    setError(null);
  }

  function saveSelectedActionAsExperiment(action: PersonalAction) {
    if (!activeSpace) {
      setError("还没有可以保存的空间。");
      setFeedback(null);
      return;
    }

    const result = storeActions.savePersonalExperiment(
      buildPersonalActionExperimentInput(action, activeSpace.id),
    );

    if (!result.ok || !result.value) {
      setError(result.ok ? "这次还没有存下，小练习还没有写进本机。" : result.error ?? "这次还没有存下。");
      setFeedback(null);
      return;
    }

    setError(null);
    setFeedback(null);
    navigate(buildExperimentRoute(result.value.id));
  }

  function completeSelectedAction(action: PersonalAction) {
    if (!activeSpace) {
      setError("还没有可以保存的空间。");
      setFeedback(null);
      return;
    }

    const experimentResult = storeActions.savePersonalExperiment(
      buildPersonalActionExperimentInput(action, activeSpace.id),
    );

    if (!experimentResult.ok || !experimentResult.value) {
      setError(
        experimentResult.ok
          ? "这次还没有存下，小练习还没有写进本机。"
          : experimentResult.error ?? "这次还没有存下。",
      );
      setFeedback(null);
      return;
    }

    const attemptResult = storeActions.savePersonalExperimentAttempt({
      experimentId: experimentResult.value.id,
      outcome: "completed",
      note: action.completionMarker,
    });

    if (!attemptResult.ok || !attemptResult.value) {
      setError(
        attemptResult.ok
          ? "小练习已存下，但完成记录还没有写进本机。可以打开小练习后再记录一次。"
          : attemptResult.error ?? "小练习已存下，但完成记录还没有写进本机。",
      );
      setFeedback(null);
      return;
    }

    setError(null);
    setFeedback({
      message: "已记录一次完成。它只会作为自己和能量的一点透明来源。",
      experimentRoute: buildExperimentRoute(experimentResult.value.id),
    });
  }

  function recordSelectedAction(action: PersonalAction) {
    navigate("/record/new", {
      quickRecordPrefill: buildPersonalActionQuickRecordPrefill(action),
    });
  }

  return (
    <section className="account-detail-page page-stack">
      <PageHeader
        title={accountTitles[account]}
        kicker={accountKickers[account]}
        onBack={() => navigate("/home")}
      />

      <section className={`account-detail-hero panel account-detail-hero--${account}`}>
        <div>
          <span className="eyebrow">打开罐子</span>
          <h2>{detail.summary.stateLabel}</h2>
          <p>{detail.summary.reason}</p>
        </div>
        <div className="account-detail-hero__value" aria-label={`${accountCopy[account].label}当前数值`}>
          <span>当前</span>
          <strong>{formatSignedValue(detail.summary.value)}</strong>
        </div>
      </section>

      <section className="panel page-stack">
        <div className="section-heading">
          <h2>最近变化</h2>
          <p>按存下的时间排列，只显示这一个储蓄罐相关的来源。</p>
        </div>
        {detail.rows.length ? (
          <div className="account-detail-list">
            {detail.rows.map((row) => (
              <AccountDetailRow key={row.impact.id} row={row} navigate={navigate} />
            ))}
          </div>
        ) : (
          <div className="account-detail-empty">
            <p>这个罐子还没有来源。可以先存一次事实，或先做一个回到自己的小动作。</p>
            <div className="account-detail-empty__actions">
              <button className="button button--primary" type="button" onClick={() => navigate("/record")}>
                记录互动
                <ArrowRight size={16} strokeWidth={1.8} />
              </button>
              <button
                className="button button--secondary"
                type="button"
                onClick={() => navigate("/return-to-self")}
              >
                回到自己
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="panel page-stack">
        <div className="section-heading">
          <h2>为什么这样算</h2>
          <p>明细只解释这次如何被放进罐子，不给关系下结论。</p>
        </div>
        <ul className="account-reason-list">
          {reasonExplanations[account].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="panel page-stack">
        <div className="section-heading">
          <h2>取一个支持自己的小动作</h2>
          <p>只选一个，别把照顾自己也变成任务。</p>
        </div>
        <div className="personal-action-menu">
          {visibleActions.map((action, index) => (
            <button
              className={`personal-action-menu__item${selectedActionId === action.id ? " is-selected" : ""}`}
              type="button"
              key={action.id}
              aria-pressed={selectedActionId === action.id}
              onClick={() => chooseAction(action)}
            >
              <span>{index === 0 ? "推荐" : "也可以"}</span>
              <strong>{action.label}</strong>
              <small>{action.helper}</small>
            </button>
          ))}
        </div>
        {selectedAction ? (
          <div className="account-action-confirmation" role="status">
            <div className="account-action-confirmation__copy">
              <span>{personalActionCategoryCopy[selectedAction.category]}</span>
              <p>已放进今天的小动作：{selectedAction.label}</p>
              <small>{selectedAction.completionMarker}</small>
            </div>
            <div className="account-action-confirmation__actions">
              <button
                className="button button--primary"
                type="button"
                onClick={() => completeSelectedAction(selectedAction)}
              >
                <CheckCircle2 size={16} strokeWidth={1.8} />
                完成一点
              </button>
              <button
                className="button button--secondary"
                type="button"
                onClick={() => saveSelectedActionAsExperiment(selectedAction)}
              >
                <Plus size={16} strokeWidth={1.8} />
                存成小练习
              </button>
              <button
                className="button button--secondary"
                type="button"
                onClick={() => recordSelectedAction(selectedAction)}
              >
                <NotebookPen size={16} strokeWidth={1.8} />
                记录一下
              </button>
              <button className="button button--ghost" type="button" onClick={clearSelection}>
                换一个
              </button>
            </div>
          </div>
        ) : null}
        <div className="experiments-inline-actions">
          <button className="button button--secondary" type="button" onClick={rotateActions}>
            <RefreshCcw size={16} strokeWidth={1.8} />
            换一组
          </button>
        </div>
        {feedback ? (
          <div className="account-action-result" role="status">
            <p>{feedback.message}</p>
            <button
              className="button button--secondary"
              type="button"
              onClick={() => navigate(feedback.experimentRoute)}
            >
              打开小练习
              <ArrowRight size={16} strokeWidth={1.8} />
            </button>
          </div>
        ) : null}
        {error ? <p className="form-error">{error}</p> : null}
        {lastError && status === "save_error" ? <p className="form-error">{lastError}</p> : null}
      </section>
    </section>
  );
}

function AccountDetailRow({
  row,
  navigate,
}: {
  row: AccountDetailSourceRow;
  navigate: (route: AppRoute) => void;
}) {
  const sourceRecordRoute =
    row.impact.sourceType === "episode" ? buildRecordRoute(row.impact.sourceId) : null;

  return (
    <article className="account-detail-row">
      <div className="account-detail-row__top">
        <span>{row.sourceLabel}</span>
        <time dateTime={row.impact.createdAt}>{formatDate(row.impact.createdAt)}</time>
      </div>
      <h3>{row.sourceTitle}</h3>
      <p>{row.sourceContext}</p>
      <dl>
        <div>
          <dt>变化</dt>
          <dd>{formatSignedValue(row.impact.value)}</dd>
        </div>
        <div>
          <dt>原因</dt>
          <dd>{row.impact.reason}</dd>
        </div>
        {row.evidence ? (
          <div>
            <dt>依据</dt>
            <dd>{row.evidence}</dd>
          </div>
        ) : null}
      </dl>
      {sourceRecordRoute ? (
        <button
          className="button button--secondary account-detail-row__source"
          type="button"
          onClick={() => navigate(sourceRecordRoute)}
        >
          打开来源记录
          <ArrowRight size={16} strokeWidth={1.8} />
        </button>
      ) : null}
    </article>
  );
}

function formatSignedValue(value: number): string {
  if (value > 0) return `+${value}`;
  return String(value);
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
