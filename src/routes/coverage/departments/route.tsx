import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/coverage/departments")({
  component: () => <Outlet />,
});
