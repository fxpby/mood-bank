import { ArrowLeft } from "lucide-react";

type StepScreenProps = {
  eyebrow: string;
  title: string;
  helper: string;
  children: React.ReactNode;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  tertiaryLabel?: string;
  onTertiary?: () => void;
  onBack?: () => void;
};

export function StepScreen({
  eyebrow,
  title,
  helper,
  children,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  tertiaryLabel,
  onTertiary,
  onBack,
}: StepScreenProps) {
  return (
    <section className="step-screen">
      <header className="step-screen__header">
        <div className="step-screen__top">
          {onBack ? (
            <button className="icon-button" type="button" onClick={onBack} aria-label="返回上一步">
              <ArrowLeft size={20} strokeWidth={1.8} />
            </button>
          ) : null}
          <span>{eyebrow}</span>
        </div>
        <h1>{title}</h1>
        <p>{helper}</p>
      </header>
      <div className="step-screen__body">{children}</div>
      <footer className="step-screen__actions">
        <button className="button button--primary" type="button" onClick={onPrimary}>
          {primaryLabel}
        </button>
        {secondaryLabel && onSecondary ? (
          <button className="button button--secondary" type="button" onClick={onSecondary}>
            {secondaryLabel}
          </button>
        ) : null}
        {tertiaryLabel && onTertiary ? (
          <button className="button button--ghost" type="button" onClick={onTertiary}>
            {tertiaryLabel}
          </button>
        ) : null}
      </footer>
    </section>
  );
}
