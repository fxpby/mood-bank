export type AppRoute =
  | "/"
  | "/home"
  | "/setup"
  | "/trigger"
  | "/return-to-self"
  | "/record"
  | "/record/new"
  | "/settings"
  | "/topics"
  | "/experiments"
  | "/signal-check"
  | "/draft-check"
  | "/accounts/connection"
  | "/accounts/self"
  | "/accounts/energy";

export function normalizeRoute(pathname: string): AppRoute {
  if (pathname.startsWith("/accounts/connection")) return "/accounts/connection";
  if (pathname.startsWith("/accounts/self")) return "/accounts/self";
  if (pathname.startsWith("/accounts/energy")) return "/accounts/energy";

  const cleanPath = pathname.replace(/\/+$/, "") || "/";
  const knownRoutes: AppRoute[] = [
    "/",
    "/home",
    "/setup",
    "/trigger",
    "/return-to-self",
    "/record",
    "/record/new",
    "/settings",
    "/topics",
    "/experiments",
    "/signal-check",
    "/draft-check",
  ];

  return knownRoutes.includes(cleanPath as AppRoute) ? (cleanPath as AppRoute) : "/";
}

export function isSetupRoute(route: AppRoute): boolean {
  return route === "/setup";
}
