import { createFileRoute } from "@tanstack/react-router";
import { PurchaseOrdersPage } from "@/features/purchases/purchase-orders/pages/PurchaseOrdersPage";

export const Route = createFileRoute("/purchases/purchase-orders/")({
  component: PurchaseOrdersPage,
});
