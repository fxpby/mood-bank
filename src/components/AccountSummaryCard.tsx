import { ChevronRight } from "lucide-react";
import type { AccountSummary } from "../domain/selectors";
import type { AppRoute } from "../utils/route";

type AccountSummaryCardProps = {
  summary: AccountSummary;
  navigate: (route: AppRoute) => void;
};

const accountRoutes: Record<AccountSummary["account"], AppRoute> = {
  connection: "/accounts/connection",
  self: "/accounts/self",
  energy: "/accounts/energy",
};

export function AccountSummaryCard({ summary, navigate }: AccountSummaryCardProps) {
  return (
    <article className={`account-card account-card--${summary.account}`}>
      <span className="account-card__marker" aria-hidden="true" />
      <div className="account-card__content">
        <div className="account-card__copy">
          <strong>{summary.label}</strong>
          <p className="account-card__state">{summary.stateLabel}</p>
        </div>
        <button
          className="account-card__detail"
          type="button"
          onClick={() => navigate(accountRoutes[summary.account])}
        >
          明细 <ChevronRight size={15} strokeWidth={1.8} />
        </button>
      </div>
      <p className="account-card__reason">{summary.reason}</p>
    </article>
  );
}
