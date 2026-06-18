import { useEffect, useMemo, useState } from "react";
import { AppShell } from "./components/AppShell";
import { useAppStore } from "./store/AppStoreContext";
import { HomePage } from "./routes/HomePage";
import { PlaceholderPage } from "./routes/PlaceholderPage";
import { SettingsPage } from "./routes/SettingsPage";
import { SetupPage } from "./routes/SetupPage";
import { isSetupRoute, normalizeRoute, type AppRoute } from "./utils/route";

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

  function navigate(nextRoute: AppRoute) {
    window.history.pushState({}, "", nextRoute);
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

function renderRoute(route: AppRoute, navigate: (route: AppRoute) => void) {
  if (route === "/setup") {
    return <SetupPage navigate={navigate} />;
  }

  if (route === "/home" || route === "/") {
    return <HomePage navigate={navigate} />;
  }

  if (route === "/settings") {
    return <SettingsPage navigate={navigate} />;
  }

  return <PlaceholderPage route={route} navigate={navigate} />;
}
