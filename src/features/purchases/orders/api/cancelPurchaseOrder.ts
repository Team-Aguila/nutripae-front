import { buildPurchasesUrl, PURCHASES_CONFIG } from "@/lib/config";
import type { CancelOrderRequest, CancelOrderResponse } from "@team-aguila/pae-compras-client";

export const cancelPurchaseOrder = async (orderId: string, data: CancelOrderRequest): Promise<CancelOrderResponse> => {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.purchaseOrders.cancel, { order_id: orderId });

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al cancelar la orden de compra");
  }

  return response.json();
};
