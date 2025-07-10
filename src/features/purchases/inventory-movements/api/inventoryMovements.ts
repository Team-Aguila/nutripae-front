import { buildPurchasesUrl, PURCHASES_CONFIG } from "@/lib/config";

export interface InventoryMovement {
  _id: string;
  movement_type: "receipt" | "usage" | "adjustment" | "expired" | "loss";
  product_id: string;
  institution_id: number;
  storage_location: string | null;
  quantity: number;
  unit: string;
  lot: string | null;
  expiration_date: string | null;
  reference_id: string | null;
  reference_type: string | null;
  movement_date: string;
  notes: string | null;
  created_by: string;
  created_at: string;
}

export interface InventoryReceiptRequest {
  product_id: string;
  institution_id: number;
  storage_location: string;
  quantity_received: number;
  unit_of_measure?: string;
  expiration_date: string;
  batch_number: string;
  purchase_order_id?: string;
  received_by: string;
  reception_date?: string;
  notes?: string;
}

export interface InventoryReceiptResponse {
  transaction_id: string;
  inventory_id: string;
  product_id: string;
  institution_id: number;
  storage_location: string;
  quantity_received: number;
  unit_of_measure: string;
  expiration_date: string;
  batch_number: string;
  purchase_order_id: string | null;
  received_by: string;
  reception_date: string;
  movement_id: string;
  notes: string | null;
  created_at: string;
}

export interface ManualInventoryAdjustmentRequest {
  product_id: string;
  inventory_id: string;
  quantity: number;
  unit?: string;
  reason: string;
  notes?: string;
  adjusted_by?: string;
}

export interface ManualInventoryAdjustmentResponse {
  transaction_id: string;
  inventory_id: string;
  product_id: string;
  institution_id: number;
  storage_location: string | null;
  adjustment_quantity: number;
  unit: string;
  reason: string;
  notes: string | null;
  adjusted_by: string;
  previous_stock: number;
  new_stock: number;
  movement_id: string;
  adjustment_date: string;
  created_at: string;
}

export interface InventoryConsumptionRequest {
  product_id: string;
  institution_id: number;
  storage_location?: string;
  quantity: number;
  unit?: string;
  consumption_date?: string;
  reason: string;
  notes?: string;
  consumed_by: string;
}

export interface InventoryConsumptionResponse {
  transaction_id: string;
  product_id: string;
  institution_id: number;
  storage_location: string | null;
  total_quantity_consumed: number;
  unit: string;
  consumption_date: string;
  reason: string;
  notes: string | null;
  consumed_by: string;
  batch_details: Array<{
    inventory_id: string;
    lot: string;
    consumed_quantity: number;
    remaining_quantity: number;
    expiration_date: string | null;
    date_of_admission: string;
  }>;
  movement_ids: string[];
  created_at: string;
}

export interface GetInventoryMovementsParams {
  institution_id?: number;
  movement_type?: "receipt" | "usage" | "adjustment" | "expired" | "loss";
  limit?: number;
  offset?: number;
}

export interface GetCurrentStockParams {
  storage_location?: string;
  lot?: string;
}

export async function getInventoryMovements(
  productId: string,
  params: GetInventoryMovementsParams = {}
): Promise<InventoryMovement[]> {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.inventoryMovements.getByProduct, { product_id: productId });
  const searchParams = new URLSearchParams();

  if (params.institution_id !== undefined) {
    searchParams.append("institution_id", params.institution_id.toString());
  }
  if (params.movement_type !== undefined) {
    searchParams.append("movement_type", params.movement_type);
  }
  if (params.limit !== undefined) {
    searchParams.append("limit", params.limit.toString());
  }
  if (params.offset !== undefined) {
    searchParams.append("offset", params.offset.toString());
  }

  const fullUrl = searchParams.toString() ? `${url}?${searchParams.toString()}` : url;

  try {
    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // Si es 404, retornar array vacío en lugar de error
      if (response.status === 404) {
        return [];
      }
      throw new Error(`Error fetching inventory movements: ${response.statusText}`);
    }

    const data = await response.json();

    // Si la respuesta es válida pero no es un array, retornar vacío
    if (!Array.isArray(data)) {
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error fetching inventory movements:", error);
    throw error;
  }
}

export async function receiveInventory(request: InventoryReceiptRequest): Promise<InventoryReceiptResponse> {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.inventoryMovements.receiveInventory);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Error receiving inventory: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error receiving inventory:", error);
    throw error;
  }
}

export async function createManualAdjustment(
  request: ManualInventoryAdjustmentRequest
): Promise<ManualInventoryAdjustmentResponse> {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.inventoryMovements.manualAdjustment);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Error creating manual adjustment: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating manual adjustment:", error);
    throw error;
  }
}

export async function consumeInventory(request: InventoryConsumptionRequest): Promise<InventoryConsumptionResponse> {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.inventoryMovements.consumeInventory);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Error consuming inventory: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error consuming inventory:", error);
    throw error;
  }
}

export async function getCurrentStock(
  productId: string,
  institutionId: number,
  params: GetCurrentStockParams = {}
): Promise<Record<string, unknown>> {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.inventoryMovements.getCurrentStock, {
    product_id: productId,
    institution_id: institutionId.toString(),
  });
  const searchParams = new URLSearchParams();

  if (params.storage_location !== undefined) {
    searchParams.append("storage_location", params.storage_location);
  }
  if (params.lot !== undefined) {
    searchParams.append("lot", params.lot);
  }

  const fullUrl = searchParams.toString() ? `${url}?${searchParams.toString()}` : url;

  try {
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
          product_id: productId,
          institution_id: institutionId,
          current_stock: 0,
          storage_locations: [],
          lots: [],
          total_available: 0,
        };
      }
      throw new Error(`Error fetching current stock: ${response.statusText}`);
    }

    const data = await response.json();

    // Si la respuesta es válida pero no tiene la estructura esperada, retornar vacío
    if (!data) {
      return {
        product_id: productId,
        institution_id: institutionId,
        current_stock: 0,
        storage_locations: [],
        lots: [],
        total_available: 0,
      };
    }

    return data;
  } catch (error) {
    console.error("Error fetching current stock:", error);
    throw error;
  }
}

export async function getStockSummary(
  productId: string,
  institutionId: number,
  storageLocation?: string
): Promise<Record<string, unknown>> {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.inventoryMovements.getStockSummary, {
    product_id: productId,
    institution_id: institutionId.toString(),
  });
  const searchParams = new URLSearchParams();

  if (storageLocation !== undefined) {
    searchParams.append("storage_location", storageLocation);
  }

  const fullUrl = searchParams.toString() ? `${url}?${searchParams.toString()}` : url;

  try {
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
          product_id: productId,
          institution_id: institutionId,
          storage_location: storageLocation || null,
          summary: {
            total_received: 0,
            total_used: 0,
            total_expired: 0,
            total_lost: 0,
            current_stock: 0,
          },
          movements_count: 0,
          last_movement_date: null,
        };
      }
      throw new Error(`Error fetching stock summary: ${response.statusText}`);
    }

    const data = await response.json();

    // Si la respuesta es válida pero no tiene la estructura esperada, retornar vacío
    if (!data) {
      return {
        product_id: productId,
        institution_id: institutionId,
        storage_location: storageLocation || null,
        summary: {
          total_received: 0,
          total_used: 0,
          total_expired: 0,
          total_lost: 0,
          current_stock: 0,
        },
        movements_count: 0,
        last_movement_date: null,
      };
    }

    return data;
  } catch (error) {
    console.error("Error fetching stock summary:", error);
    throw error;
  }
}

export async function getConsumptionHistory(
  productId: string,
  params: {
    institution_id?: number;
    storage_location?: string;
    limit?: number;
    offset?: number;
  } = {}
): Promise<InventoryMovement[]> {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.inventoryMovements.getConsumptionHistory, {
    product_id: productId,
  });
  const searchParams = new URLSearchParams();

  if (params.institution_id !== undefined) {
    searchParams.append("institution_id", params.institution_id.toString());
  }
  if (params.storage_location !== undefined) {
    searchParams.append("storage_location", params.storage_location);
  }
  if (params.limit !== undefined) {
    searchParams.append("limit", params.limit.toString());
  }
  if (params.offset !== undefined) {
    searchParams.append("offset", params.offset.toString());
  }

  const fullUrl = searchParams.toString() ? `${url}?${searchParams.toString()}` : url;

  try {
    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // Si es 404, retornar array vacío en lugar de error
      if (response.status === 404) {
        return [];
      }
      throw new Error(`Error fetching consumption history: ${response.statusText}`);
    }

    const data = await response.json();

    // Si la respuesta es válida pero no es un array, retornar vacío
    if (!Array.isArray(data)) {
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error fetching consumption history:", error);
    throw error;
  }
}

// Alias para compatibilidad con la UI
export const getInventoryMovementsByProduct = getInventoryMovements;
