import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/coverage/institutions")({
  component: InstitutionsLayout,
});

function InstitutionsLayout() {
  return <Outlet />;
}
