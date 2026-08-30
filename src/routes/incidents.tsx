import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";

export const Route = createFileRoute("/incidents")({
  component: () => <Outlet />,
});

export function useIsIncidentsIndex() {
  return useRouterState({ select: (s) => s.location.pathname === "/incidents" });
}
