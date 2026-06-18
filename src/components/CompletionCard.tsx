import { CheckCircle2 } from "lucide-react";

type CompletionCardProps = {
  title: string;
  body: string;
  rows: Array<{ label: string; value: string }>;
  children?: React.ReactNode;
};

export function CompletionCard({ title, body, rows, children }: CompletionCardProps) {
  return (
    <section className="completion-card" aria-labelledby="completion-card-title">
      <div className="completion-card__icon" aria-hidden="true">
        <CheckCircle2 size={22} strokeWidth={1.8} />
      </div>
      <div className="completion-card__copy">
        <h2 id="completion-card-title">{title}</h2>
        <p>{body}</p>
      </div>
      <dl className="completion-card__rows">
        {rows.map((row) => (
          <div key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
      {children ? <div className="completion-card__actions">{children}</div> : null}
    </section>
  );
}
