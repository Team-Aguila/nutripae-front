import { createFileRoute } from "@tanstack/react-router";
import InventoryPage from "@/features/purchases/inventory/pages/InventoryPage";

export const Route = createFileRoute("/purchases/inventory/")({
  component: InventoryPage,
});
