import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/purchases/ingredient-receipts")({
  component: () => <Outlet />,
});
