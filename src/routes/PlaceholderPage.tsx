import { ArrowRight } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { placeholderCopy } from "../copy/placeholders";
import type { AppRoute } from "../utils/route";

type PlaceholderPageProps = {
  route: AppRoute;
  navigate: (route: AppRoute) => void;
};

export function PlaceholderPage({ route, navigate }: PlaceholderPageProps) {
  const copy = getPlaceholderCopy(route);
  const actions = getActions(route);

  return (
    <section className="placeholder-page page-stack">
      <PageHeader title={copy.title} kicker={copy.body} onBack={() => navigate("/home")} />
      <section className="panel page-stack">
        <p className="helper-text">
          这个页面不会创建记录，也不会改变连接、自己或能量储蓄罐。
        </p>
        <div className="placeholder-actions">
          {actions.map((action) => (
            <button
              className={action.primary ? "button button--primary" : "button button--secondary"}
              type="button"
              key={action.route}
              onClick={() => navigate(action.route)}
            >
              {action.label}
              <ArrowRight size={16} strokeWidth={1.8} />
            </button>
          ))}
        </div>
      </section>
    </section>
  );
}

function getPlaceholderCopy(route: AppRoute): { title: string; body: string } {
  if (route === "/signal-check") return placeholderCopy.signalCheck;
  if (route === "/draft-check") return placeholderCopy.draftCheck;
  if (route === "/topics") return placeholderCopy.topics;
  if (route === "/experiments") return placeholderCopy.experiments;
  if (route.startsWith("/accounts/")) return placeholderCopy.accountDetail;
  return placeholderCopy.p0Flow;
}

function getActions(route: AppRoute): Array<{ label: string; route: AppRoute; primary?: boolean }> {
  if (route === "/topics" || route === "/record" || route === "/record/new") {
    return [
      { label: "回到首页", route: "/home", primary: true },
      { label: "回到自己", route: "/return-to-self" },
    ];
  }

  if (route === "/experiments") {
    return [
      { label: "回到自己", route: "/return-to-self", primary: true },
      { label: "回到首页", route: "/home" },
    ];
  }

  if (route.startsWith("/accounts/")) {
    return [{ label: "回到首页", route: "/home", primary: true }];
  }

  return [
    { label: "我被触发了", route: "/trigger", primary: true },
    { label: "回到自己", route: "/return-to-self" },
  ];
}
