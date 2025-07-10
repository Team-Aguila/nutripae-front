import { buildPurchasesUrl, PURCHASES_CONFIG } from "@/lib/config";
import type { PurchaseOrderCreate, PurchaseOrderResponse } from "@team-aguila/pae-compras-client";

export const createPurchaseOrder = async (data: PurchaseOrderCreate): Promise<PurchaseOrderResponse> => {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.purchaseOrders.create);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al crear la orden de compra");
  }

  return response.json();
};
