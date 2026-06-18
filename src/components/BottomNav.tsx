import { Dumbbell, Home, NotebookPen, Settings, Sparkles } from "lucide-react";
import { navCopy } from "../copy/navigation";
import type { AppRoute } from "../utils/route";

type BottomNavProps = {
  currentRoute: AppRoute;
  navigate: (route: AppRoute) => void;
};

const navItems: Array<{
  route: AppRoute;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
}> = [
  { route: "/home", label: navCopy.home, icon: Home },
  { route: "/record", label: navCopy.record, icon: NotebookPen },
  { route: "/topics", label: navCopy.topics, icon: Sparkles },
  { route: "/experiments", label: navCopy.experiments, icon: Dumbbell },
  { route: "/settings", label: navCopy.settings, icon: Settings },
];

export function BottomNav({ currentRoute, navigate }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="主导航">
      <div className="bottom-nav__inner">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isCurrent = isRouteCurrent(currentRoute, item.route);

          return (
            <button
              key={item.route}
              className="nav-button"
              type="button"
              aria-current={isCurrent ? "page" : undefined}
              onClick={() => navigate(item.route)}
            >
              <Icon className="nav-button__icon" size={20} strokeWidth={1.8} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function isRouteCurrent(currentRoute: AppRoute, itemRoute: AppRoute): boolean {
  if (itemRoute === "/home") {
    return currentRoute === "/" || currentRoute === "/home";
  }

  return currentRoute === itemRoute || currentRoute.startsWith(itemRoute);
}
