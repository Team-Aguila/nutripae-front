import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/coverage/coverages")({
  component: CoveragesLayout,
});

function CoveragesLayout() {
  return <Outlet />;
}
