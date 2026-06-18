import { FileSearch, HeartHandshake, MessageSquareText, RotateCcw } from "lucide-react";
import type { AppRoute } from "../utils/route";

type PrimaryActionPanelProps = {
  navigate: (route: AppRoute) => void;
};

const actions: Array<{
  label: string;
  subtitle: string;
  route: AppRoute;
  badge?: string;
  tone?: "trigger" | "return" | "placeholder";
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
}> = [
  {
    label: "我被触发了",
    subtitle: "先停一下",
    route: "/trigger",
    badge: "稍后",
    tone: "trigger",
    icon: RotateCcw,
  },
  {
    label: "回到自己",
    subtitle: "取一个小动作",
    route: "/return-to-self",
    tone: "return",
    icon: HeartHandshake,
  },
  {
    label: "想检查信号",
    subtitle: "稍后支持",
    route: "/signal-check",
    badge: "稍后",
    tone: "placeholder",
    icon: FileSearch,
  },
  {
    label: "草稿自检",
    subtitle: "稍后支持",
    route: "/draft-check",
    badge: "稍后",
    tone: "placeholder",
    icon: MessageSquareText,
  },
];

export function PrimaryActionPanel({ navigate }: PrimaryActionPanelProps) {
  return (
    <section className="primary-actions" aria-labelledby="primary-actions-title">
      <div className="section-heading">
        <h2 id="primary-actions-title">现在先做什么</h2>
        <p>不用急着判断关系，先选一个能让你少加重的入口。</p>
      </div>
      <div className="primary-actions__grid">
        {actions.map((action, index) => {
          const Icon = action.icon;

          return (
            <button
              className={[
                "action-tile",
                index === 0 ? "action-tile--primary" : "",
                action.tone === "return" ? "action-tile--return" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              type="button"
              key={action.label}
              onClick={() => navigate(action.route)}
            >
              <span className="action-tile__top">
                <Icon size={20} strokeWidth={1.8} />
                {action.badge ? <span className="small-badge">{action.badge}</span> : null}
              </span>
              <span className="action-tile__label">{action.label}</span>
              <span className="action-tile__subtitle">{action.subtitle}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
