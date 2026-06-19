import { useEffect, useMemo, useState } from "react";
import { AppShell } from "./components/AppShell";
import { useAppStore } from "./store/AppStoreContext";
import { AccountDetailPage } from "./routes/AccountDetailPage";
import { HomePage } from "./routes/HomePage";
import { PlaceholderPage } from "./routes/PlaceholderPage";
import { QuickRecordPage } from "./routes/QuickRecordPage";
import { RecordDetailPage } from "./routes/RecordDetailPage";
import { RecordPage } from "./routes/RecordPage";
import { ReturnToSelfPage } from "./routes/ReturnToSelfPage";
import { SettingsPage } from "./routes/SettingsPage";
import { SignalCheckPage } from "./routes/SignalCheckPage";
import { SetupPage } from "./routes/SetupPage";
import { TopicDetailPage } from "./routes/TopicDetailPage";
import { TopicsPage } from "./routes/TopicsPage";
import { TriggerPage } from "./routes/TriggerPage";
import { isSetupRoute, normalizeRoute, type AppRoute, type RouteState } from "./utils/route";

export function App() {
  const { state } = useAppStore();
  const [route, setRoute] = useState<AppRoute>(() => normalizeRoute(window.location.pathname));
  const hasCompletedSetup = state.settings.hasCompletedSetup;

  const effectiveRoute = useMemo<AppRoute>(() => {
    if (!hasCompletedSetup && !isSetupRoute(route)) {
      return "/setup";
    }

    if (hasCompletedSetup && route === "/setup") {
      return "/home";
    }

    return route === "/" ? "/home" : route;
  }, [hasCompletedSetup, route]);

  useEffect(() => {
    const handlePopState = () => setRoute(normalizeRoute(window.location.pathname));
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (window.location.pathname !== effectiveRoute) {
      window.history.replaceState({}, "", effectiveRoute);
      setRoute(effectiveRoute);
    }
    window.scrollTo({ left: 0, top: 0 });
  }, [effectiveRoute]);

  function navigate(nextRoute: AppRoute, routeState?: RouteState) {
    window.history.pushState(routeState ?? {}, "", nextRoute);
    setRoute(nextRoute);
    window.scrollTo({ left: 0, top: 0 });
  }

  const showBottomNav = effectiveRoute !== "/setup";

  return (
    <AppShell route={effectiveRoute} navigate={navigate} showBottomNav={showBottomNav}>
      {renderRoute(effectiveRoute, navigate)}
    </AppShell>
  );
}

function renderRoute(route: AppRoute, navigate: (route: AppRoute, state?: RouteState) => void) {
  if (route === "/setup") {
    return <SetupPage navigate={navigate} />;
  }

  if (route === "/home" || route === "/") {
    return <HomePage navigate={navigate} />;
  }

  if (route === "/trigger") {
    return <TriggerPage navigate={navigate} />;
  }

  if (route === "/record") {
    return <RecordPage navigate={navigate} />;
  }

  if (route === "/record/new") {
    return <QuickRecordPage navigate={navigate} />;
  }

  if (route.startsWith("/record/")) {
    return <RecordDetailPage navigate={navigate} />;
  }

  if (route === "/settings") {
    return <SettingsPage navigate={navigate} />;
  }

  if (route === "/return-to-self") {
    return <ReturnToSelfPage navigate={navigate} />;
  }

  if (route === "/signal-check") {
    return <SignalCheckPage navigate={navigate} />;
  }

  if (route === "/topics") {
    return <TopicsPage navigate={navigate} />;
  }

  if (route.startsWith("/topics/")) {
    return <TopicDetailPage navigate={navigate} />;
  }

  if (route === "/accounts/connection") {
    return <AccountDetailPage account="connection" navigate={navigate} />;
  }

  if (route === "/accounts/self") {
    return <AccountDetailPage account="self" navigate={navigate} />;
  }

  if (route === "/accounts/energy") {
    return <AccountDetailPage account="energy" navigate={navigate} />;
  }

  return <PlaceholderPage route={route} navigate={navigate} />;
}
