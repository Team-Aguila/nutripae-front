import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/menu/schedules")({
  component: () => <Outlet />,
});
