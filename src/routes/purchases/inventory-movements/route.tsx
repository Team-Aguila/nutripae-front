import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/purchases/inventory-movements")({
  component: () => <Outlet />,
});
