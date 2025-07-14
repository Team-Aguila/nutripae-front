import { buildPurchasesUrl, PURCHASES_CONFIG } from "@/lib/config";
import { httpPatch } from "@/lib/http-client";
import type { MarkShippedResponse } from "@team-aguila/pae-compras-client";

export const markPurchaseOrderShipped = async (orderId: string): Promise<MarkShippedResponse> => {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.purchaseOrders.markShipped, { order_id: orderId });

  try {
    return await httpPatch<MarkShippedResponse>(url);
  } catch (error) {
    console.error(`Error al marcar la orden ${orderId} como enviada:`, error);
    throw new Error("Error al marcar la orden como enviada");
  }
};
