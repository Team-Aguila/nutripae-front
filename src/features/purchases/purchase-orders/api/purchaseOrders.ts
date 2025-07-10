import { buildPurchasesUrl, PURCHASES_CONFIG } from "@/lib/config";

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

  const response = await fetch(fullUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    // Si es 404, retornar estructura vacía en lugar de error
    if (response.status === 404) {
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
    throw new Error(`Error fetching purchase orders: ${response.statusText}`);
  }

  const data = await response.json();

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
}

export async function getPurchaseOrder(orderId: string): Promise<PurchaseOrder> {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.purchaseOrders.getById, { order_id: orderId });

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching purchase order: ${response.statusText}`);
  }

  return await response.json();
}

export async function createPurchaseOrder(order: PurchaseOrderCreate): Promise<PurchaseOrder> {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.purchaseOrders.create);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      throw new Error(`Error creating purchase order: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating purchase order:", error);
    throw error;
  }
}

export async function markPurchaseOrderAsShipped(orderId: string): Promise<PurchaseOrder> {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.purchaseOrders.markShipped, { order_id: orderId });

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error marking purchase order as shipped: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error marking purchase order as shipped:", error);
    throw error;
  }
}

export async function cancelPurchaseOrder(orderId: string): Promise<PurchaseOrder> {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.purchaseOrders.cancel, { order_id: orderId });

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error cancelling purchase order: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error cancelling purchase order:", error);
    throw error;
  }
}
