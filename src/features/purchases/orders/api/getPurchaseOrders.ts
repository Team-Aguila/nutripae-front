import { buildPurchasesUrl, PURCHASES_CONFIG } from "@/lib/config";
import { httpGet } from "@/lib/http-client";
import type { PaginatedPurchaseOrderResponse } from "@team-aguila/pae-compras-client";

export const getPurchaseOrders = async (params?: {
  order_number?: string;
  provider_id?: string;
  status?: string;
  created_from?: string;
  created_to?: string;
  delivery_from?: string;
  delivery_to?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedPurchaseOrderResponse> => {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.purchaseOrders.list);

  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
  }

  const fullUrl = searchParams.toString() ? `${url}?${searchParams.toString()}` : url;

  try {
    return await httpGet<PaginatedPurchaseOrderResponse>(fullUrl);
  } catch (error) {
    console.error("Error al obtener las órdenes de compra:", error);
    throw new Error("Error al obtener las órdenes de compra");
  }
};
