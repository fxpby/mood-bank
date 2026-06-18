import { ArrowLeft } from "lucide-react";

type PageHeaderProps = {
  title: string;
  kicker?: string;
  onBack?: () => void;
  trailing?: React.ReactNode;
};

export function PageHeader({ title, kicker, onBack, trailing }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="page-header__row">
        <div className="page-header__row" style={{ justifyContent: "start" }}>
          {onBack ? (
            <button className="icon-button" type="button" onClick={onBack} aria-label="返回">
              <ArrowLeft size={20} strokeWidth={1.8} />
            </button>
          ) : null}
          <h1 className="page-title">{title}</h1>
        </div>
        {trailing}
      </div>
      {kicker ? <p className="page-kicker">{kicker}</p> : null}
    </header>
  );
}
