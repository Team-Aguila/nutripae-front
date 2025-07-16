import { buildPurchasesUrl, PURCHASES_CONFIG } from "@/lib/config";
import { httpPost } from "@/lib/http-client";
import type { PurchaseOrderCreate, PurchaseOrderResponse } from "@team-aguila/pae-compras-client";

export const createPurchaseOrder = async (data: PurchaseOrderCreate): Promise<PurchaseOrderResponse> => {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.purchaseOrders.create);

  try {
    return await httpPost<PurchaseOrderResponse>(url, data);
  } catch (error) {
    console.error("Error al crear la orden de compra:", error);
    throw new Error("Error al crear la orden de compra");
  }
};
