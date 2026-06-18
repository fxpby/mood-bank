import { BottomNav } from "./BottomNav";
import { StorageWarning } from "./StorageWarning";
import type { AppRoute } from "../utils/route";

type AppShellProps = {
  route: AppRoute;
  navigate: (route: AppRoute) => void;
  children: React.ReactNode;
  showBottomNav?: boolean;
};

export function AppShell({ route, navigate, children, showBottomNav = true }: AppShellProps) {
  return (
    <div className="app-shell">
      <main className={showBottomNav ? "app-content" : "app-content app-content--setup"}>
        <StorageWarning navigate={navigate} />
        {children}
      </main>
      {showBottomNav ? <BottomNav currentRoute={route} navigate={navigate} /> : null}
    </div>
  );
}
