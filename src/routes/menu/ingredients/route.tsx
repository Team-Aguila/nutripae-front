import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/menu/ingredients")({
  component: () => <Outlet />,
});
