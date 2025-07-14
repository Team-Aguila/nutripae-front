import { buildPurchasesUrl, PURCHASES_CONFIG } from "@/lib/config";
import { httpPatch } from "@/lib/http-client";
import type { CancelOrderRequest, CancelOrderResponse } from "@team-aguila/pae-compras-client";

export const cancelPurchaseOrder = async (orderId: string, data: CancelOrderRequest): Promise<CancelOrderResponse> => {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.purchaseOrders.cancel, { order_id: orderId });

  try {
    return await httpPatch<CancelOrderResponse>(url, data);
  } catch (error) {
    console.error(`Error al cancelar la orden de compra ${orderId}:`, error);
    throw new Error("Error al cancelar la orden de compra");
  }
};
