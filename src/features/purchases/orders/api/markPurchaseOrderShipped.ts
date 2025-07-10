import { buildPurchasesUrl, PURCHASES_CONFIG } from "@/lib/config";
import type { MarkShippedResponse } from "@team-aguila/pae-compras-client";

export const markPurchaseOrderShipped = async (orderId: string): Promise<MarkShippedResponse> => {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.purchaseOrders.markShipped, { order_id: orderId });

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al marcar la orden como enviada");
  }

  return response.json();
};
