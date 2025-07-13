import { createFileRoute } from "@tanstack/react-router";
import InventoryMovementsPage from "@/features/purchases/inventory-movements/pages/InventoryMovementsPage";

export const Route = createFileRoute("/purchases/inventory-movements/")({
  component: InventoryMovementsPage,
});
