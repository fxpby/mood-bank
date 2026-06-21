import { HeartHandshake, ShieldAlert } from "lucide-react";
import { supportBoundaryCopy, supportBoundaryReasonCopy } from "../copy/safety";
import type { SupportBoundaryKind } from "../domain/safety";

type SupportBoundaryCardProps = {
  kind?: SupportBoundaryKind | null;
  onReturnToSelf?: () => void;
  onClose?: () => void;
  closeLabel?: string;
};

export function SupportBoundaryCard({
  kind,
  onReturnToSelf,
  onClose,
  closeLabel = supportBoundaryCopy.continueAction,
}: SupportBoundaryCardProps) {
  return (
    <aside className="support-boundary-card" aria-labelledby="support-boundary-title">
      <span className="support-boundary-card__icon" aria-hidden="true">
        <ShieldAlert size={22} strokeWidth={1.8} />
      </span>
      <div className="support-boundary-card__copy">
        <h2 id="support-boundary-title">{supportBoundaryCopy.title}</h2>
        <p>{supportBoundaryCopy.body}</p>
        {kind ? <p>{supportBoundaryReasonCopy[kind]}</p> : null}
        <small>{supportBoundaryCopy.helper}</small>
      </div>
      <div className="support-boundary-card__actions">
        {onReturnToSelf ? (
          <button className="button button--primary" type="button" onClick={onReturnToSelf}>
            <HeartHandshake size={16} strokeWidth={1.8} />
            {supportBoundaryCopy.primaryAction}
          </button>
        ) : null}
        {onClose ? (
          <button className="button button--secondary" type="button" onClick={onClose}>
            {closeLabel}
          </button>
        ) : null}
      </div>
    </aside>
  );
}
