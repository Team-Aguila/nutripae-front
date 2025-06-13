import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/coverage/towns")({
  component: () => <Outlet />,
});
