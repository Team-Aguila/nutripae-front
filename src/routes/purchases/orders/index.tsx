import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { PurchaseOrdersPage } from "@/features/purchases/purchase-orders/pages/PurchaseOrdersPage";

function RouteComponent() {
  return (
    <div>
      <SiteHeader
        items={[
          { label: "Compras", href: "/purchases" },
          { label: "Órdenes de Compra", isCurrentPage: true },
        ]}
      />
      <PurchaseOrdersPage />
    </div>
  );
}

export const Route = createFileRoute("/purchases/orders/")({
  component: RouteComponent,
});
