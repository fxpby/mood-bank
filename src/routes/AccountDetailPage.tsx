import { ArrowRight, RefreshCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { accountCopy } from "../copy/accounts";
import { selectAccountDetail, type AccountDetailSourceRow } from "../domain/selectors";
import type { AccountId } from "../domain/types";
import { useAppStore } from "../store/AppStoreContext";
import type { AppRoute } from "../utils/route";

type AccountDetailPageProps = {
  account: AccountId;
  navigate: (route: AppRoute) => void;
};

type SuggestedAction = {
  id: string;
  label: string;
  helper: string;
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

const suggestedActions: Record<AccountId, SuggestedAction[]> = {
  connection: [
    {
      id: "record_observable",
      label: "只存一个可观察事实",
      helper: "先不推导未来，只写下真实发生的一句。",
    },
    {
      id: "name_uncertainty",
      label: "允许这次还不确定",
      helper: "把温暖和结论分开放，给关系留一点空间。",
    },
    {
      id: "return_body",
      label: "先回到身体",
      helper: "如果想反复检查信号，先把注意力带回来。",
    },
  ],
  self: [
    {
      id: "one_owned_step",
      label: "选一个自己的下一步",
      helper: "小到两分钟也可以，不需要一次想完整。",
    },
    {
      id: "save_draft",
      label: "把想解释的话先存下",
      helper: "让情绪先落地，不急着用回应换确定。",
    },
    {
      id: "soft_sentence",
      label: "给自己一句不攻击的话",
      helper: "先停止内在审判，再决定要不要行动。",
    },
  ],
  energy: [
    {
      id: "lighter_action",
      label: "换一个更轻的动作",
      helper: "喝水、洗手、站起来，先让系统降一点负荷。",
    },
    {
      id: "close_loop",
      label: "今天先不做重大结论",
      helper: "把结论留到更稳的时候，今晚只照顾能量。",
    },
    {
      id: "notice_cost",
      label: "写下一个消耗来源",
      helper: "看见消耗，不等于责怪任何人。",
    },
  ],
};

export function AccountDetailPage({ account, navigate }: AccountDetailPageProps) {
  const { state } = useAppStore();
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const detail = useMemo(() => selectAccountDetail(state, account), [account, state]);
  const actions = suggestedActions[account];
  const selectedAction = actions.find((action) => action.id === selectedActionId);

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
              <AccountDetailRow key={row.impact.id} row={row} />
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
          {actions.map((action, index) => (
            <button
              className={`personal-action-menu__item${selectedActionId === action.id ? " is-selected" : ""}`}
              type="button"
              key={action.id}
              onClick={() => setSelectedActionId(action.id)}
            >
              <span>{index === 0 ? "推荐" : "也可以"}</span>
              <strong>{action.label}</strong>
              <small>{action.helper}</small>
            </button>
          ))}
        </div>
        {selectedAction ? (
          <div className="account-action-confirmation" role="status">
            <p>已放进今天的小动作：{selectedAction.label}</p>
            <button className="button button--ghost" type="button" onClick={() => setSelectedActionId(null)}>
              <RefreshCcw size={16} strokeWidth={1.8} />
              换一个
            </button>
          </div>
        ) : null}
      </section>
    </section>
  );
}

function AccountDetailRow({ row }: { row: AccountDetailSourceRow }) {
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
