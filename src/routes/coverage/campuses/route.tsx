import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/coverage/campuses")({
  component: CampusesLayout,
});

function CampusesLayout() {
  return <Outlet />;
}
