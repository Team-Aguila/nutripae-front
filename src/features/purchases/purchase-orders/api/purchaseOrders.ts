import { buildPurchasesUrl, PURCHASES_CONFIG } from "@/lib/config";
import { httpGet, httpPost, httpPatch } from "@/lib/http-client";

export interface PurchaseOrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
}

export interface PurchaseOrder {
  _id: string;
  order_number: string;
  provider_id: string;
  provider_name: string;
  institution_id: number;
  institution_name: string;
  order_date: string;
  expected_delivery_date: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  items: PurchaseOrderItem[];
  total_amount: number;
  created_at: string;
  updated_at: string | null;
  created_by: string;
  notes?: string;
}

export interface PurchaseOrderListResponse {
  orders: PurchaseOrder[];
  total_count: number;
  page_info: {
    offset: number;
    limit: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

export interface PurchaseOrderCreate {
  provider_id: string;
  institution_id: number;
  expected_delivery_date: string;
  items: Omit<PurchaseOrderItem, "product_name" | "total_price">[];
  notes?: string;
}

export interface GetPurchaseOrdersParams {
  provider_id?: string;
  institution_id?: number;
  status?: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  limit?: number;
  offset?: number;
}

export async function getPurchaseOrders(params: GetPurchaseOrdersParams = {}): Promise<PurchaseOrderListResponse> {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.purchaseOrders.list);
  const searchParams = new URLSearchParams();

  if (params.provider_id !== undefined) {
    searchParams.append("provider_id", params.provider_id);
  }
  if (params.institution_id !== undefined) {
    searchParams.append("institution_id", params.institution_id.toString());
  }
  if (params.status !== undefined) {
    searchParams.append("status", params.status);
  }
  if (params.limit !== undefined) {
    searchParams.append("limit", params.limit.toString());
  }
  if (params.offset !== undefined) {
    searchParams.append("offset", params.offset.toString());
  }

  const fullUrl = searchParams.toString() ? `${url}?${searchParams.toString()}` : url;

  try {
    const data = await httpGet<PurchaseOrderListResponse>(fullUrl);

    // Validar que la respuesta tenga la estructura esperada
    if (!data || !Array.isArray(data.orders)) {
      return {
        orders: [],
        total_count: 0,
        page_info: {
          offset: params.offset || 0,
          limit: params.limit || 100,
          has_next: false,
          has_previous: false,
        },
      };
    }

    return data;
  } catch (error) {
    // Si es un error, retornar estructura vacía
    console.error("Error fetching purchase orders:", error);
    return {
      orders: [],
      total_count: 0,
      page_info: {
        offset: params.offset || 0,
        limit: params.limit || 100,
        has_next: false,
        has_previous: false,
      },
    };
  }
}

export async function getPurchaseOrder(orderId: string): Promise<PurchaseOrder> {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.purchaseOrders.getById, { order_id: orderId });

  try {
    return await httpGet<PurchaseOrder>(url);
  } catch (error) {
    console.error("Error fetching purchase order:", error);
    throw error;
  }
}

export async function createPurchaseOrder(order: PurchaseOrderCreate): Promise<PurchaseOrder> {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.purchaseOrders.create);

  try {
    return await httpPost<PurchaseOrder>(url, order);
  } catch (error) {
    console.error("Error creating purchase order:", error);
    throw error;
  }
}

export async function markPurchaseOrderAsShipped(orderId: string): Promise<PurchaseOrder> {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.purchaseOrders.markShipped, { order_id: orderId });

  try {
    return await httpPatch<PurchaseOrder>(url);
  } catch (error) {
    console.error("Error marking purchase order as shipped:", error);
    throw error;
  }
}

export async function cancelPurchaseOrder(orderId: string): Promise<PurchaseOrder> {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.purchaseOrders.cancel, { order_id: orderId });

  try {
    return await httpPatch<PurchaseOrder>(url);
  } catch (error) {
    console.error("Error cancelling purchase order:", error);
    throw error;
  }
}
