import { buildPurchasesUrl, PURCHASES_CONFIG } from "@/lib/config";
import { httpGet } from "@/lib/http-client";

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

export const getPurchaseOrder = async (orderId: string): Promise<PurchaseOrder> => {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.purchaseOrders.getById, { order_id: orderId });

  try {
    return await httpGet<PurchaseOrder>(url);
  } catch (error) {
    console.error(`Error al obtener la orden de compra ${orderId}:`, error);
    throw new Error(`Error al obtener la orden de compra: ${error}`);
  }
};
