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
  reason?: string; // Campo opcional para filtrar movimientos del sistema
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

export interface InventoryBatchStock {
  inventory_id: string;
  lot: string | null;
  available_quantity: number;
  unit: string;
  storage_location: string;
  institution_id: number;
  expiration_date: string | null;
  date_of_admission: string;
}

export interface CurrentStockResponse {
  product_id: string;
  institution_id: number;
  total_available: number;
  unit: string;
  batches: InventoryBatchStock[];
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

    // Filtrar movimientos con reason: "SYSTEM" para que no se muestren en la UI
    const filteredData = data.filter((movement: InventoryMovement) => {
      // Si el movimiento no tiene reason o reason no es "SYSTEM", incluirlo
      return !movement.reason || movement.reason !== "SYSTEM";
    });

    return filteredData;
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

export async function getAvailableStock(
  productId: string,
  institutionId: number,
  storageLocation?: string
): Promise<CurrentStockResponse> {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.inventoryMovements.getCurrentStock, {
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
      if (response.status === 404) {
        return {
          product_id: productId,
          institution_id: institutionId,
          total_available: 0,
          unit: "unidad",
          batches: [],
        };
      }
      throw new Error(`Error fetching available stock: ${response.statusText}`);
    }

    const data = await response.json();

    // Validar que la respuesta tenga la estructura esperada
    if (!data || typeof data !== "object") {
      return {
        product_id: productId,
        institution_id: institutionId,
        total_available: 0,
        unit: "unidad",
        batches: [],
      };
    }

    // Asegurar que batches existe y es un array
    const processedData: CurrentStockResponse = {
      product_id: data.product_id || productId,
      institution_id: data.institution_id || institutionId,
      total_available: data.total_available || 0,
      unit: data.unit || "unidad",
      batches: Array.isArray(data.batches) ? data.batches : [],
    };

    return processedData;
  } catch (error) {
    console.error("❌ Error fetching available stock:", error);
    // En caso de error, retornar estructura vacía en lugar de lanzar error
    return {
      product_id: productId,
      institution_id: institutionId,
      total_available: 0,
      unit: "unidad",
      batches: [],
    };
  }
}

// Función para calcular stock disponible basado en movimientos de entrada y salida
export async function calculateAvailableStockFromMovements(
  productId: string,
  institutionId: number,
  storageLocation?: string
): Promise<CurrentStockResponse> {
  try {
    // Obtener todos los movimientos para el producto
    const allMovements = await getInventoryMovements(productId, {
      institution_id: institutionId,
    });

    if (allMovements.length === 0) {
      return {
        product_id: productId,
        institution_id: institutionId,
        total_available: 0,
        unit: "unidad",
        batches: [],
      };
    }

    // Filtrar por ubicación de almacenamiento si se especifica
    const filteredMovements = storageLocation
      ? allMovements.filter((m) => m.storage_location === storageLocation)
      : allMovements;

    // Separar movimientos por tipo DESPUÉS del filtrado
    const receiptMovements = filteredMovements.filter((m) => m.movement_type === "receipt");
    const usageMovements = filteredMovements.filter((m) => m.movement_type === "usage");
    const adjustmentMovements = filteredMovements.filter((m) => m.movement_type === "adjustment");
    const expiredMovements = filteredMovements.filter((m) => m.movement_type === "expired");
    const lossMovements = filteredMovements.filter((m) => m.movement_type === "loss");

    // Crear un mapa para rastrear cada lote de entrada por separado
    const batchesMap = new Map<string, InventoryBatchStock>();

    // PASO 1: Procesar solo las entradas (receipts) para crear los lotes base
    receiptMovements.forEach((movement) => {
      // Usar reference_id si está disponible, sino usar el ID del movimiento
      const inventoryId = movement.reference_id || movement._id;

      batchesMap.set(inventoryId, {
        inventory_id: inventoryId,
        lot: movement.lot,
        available_quantity: movement.quantity, // Cantidad inicial de la entrada
        unit: movement.unit,
        storage_location: movement.storage_location || "",
        institution_id: movement.institution_id,
        expiration_date: movement.expiration_date,
        date_of_admission: movement.movement_date,
      });
    });

    // PASO 2: Calcular cuánto se ha consumido en total por unidad de medida y ubicación
    const totalConsumptions = new Map<string, number>(); // key: "unit-location"

    // Sumar todas las salidas
    [...usageMovements, ...expiredMovements, ...lossMovements].forEach((movement) => {
      const consumptionKey = `${movement.unit}-${movement.storage_location}`;
      const currentConsumption = totalConsumptions.get(consumptionKey) || 0;
      totalConsumptions.set(consumptionKey, currentConsumption + movement.quantity);
    });

    // Restar ajustes negativos (que reducen stock)
    adjustmentMovements.forEach((movement) => {
      if (movement.quantity < 0) {
        const consumptionKey = `${movement.unit}-${movement.storage_location}`;
        const currentConsumption = totalConsumptions.get(consumptionKey) || 0;
        totalConsumptions.set(consumptionKey, currentConsumption + Math.abs(movement.quantity));
      }
    });

    // PASO 3: Aplicar consumos a los lotes (FIFO - First In, First Out)
    for (const [consumptionKey, totalConsumed] of totalConsumptions.entries()) {
      let remainingToConsume = totalConsumed;
      const [unit, location] = consumptionKey.split("-");

      // Obtener lotes que coinciden con la unidad y ubicación, ordenados por fecha (FIFO)
      const matchingBatches = Array.from(batchesMap.entries())
        .filter(([, batch]) => batch.unit === unit && batch.storage_location === location)
        .sort(([, a], [, b]) => new Date(a.date_of_admission).getTime() - new Date(b.date_of_admission).getTime());

      // Consumir de cada lote en orden FIFO
      for (const [, batch] of matchingBatches) {
        if (remainingToConsume <= 0) break;

        const toConsumeFromThisBatch = Math.min(remainingToConsume, batch.available_quantity);
        batch.available_quantity -= toConsumeFromThisBatch;
        remainingToConsume -= toConsumeFromThisBatch;
      }
    }

    // PASO 4: Aplicar ajustes positivos (que aumentan stock)
    adjustmentMovements.forEach((movement) => {
      if (movement.quantity > 0) {
        // Para ajustes positivos, intentar encontrar un lote existente o crear uno nuevo
        const matchingBatch = Array.from(batchesMap.values()).find(
          (batch) =>
            batch.unit === movement.unit &&
            batch.storage_location === movement.storage_location &&
            batch.lot === movement.lot
        );

        if (matchingBatch) {
          matchingBatch.available_quantity += movement.quantity;
        } else {
          // Crear nuevo lote para el ajuste positivo
          const inventoryId = movement.reference_id || `adjustment-${movement._id}`;
          batchesMap.set(inventoryId, {
            inventory_id: inventoryId,
            lot: movement.lot,
            available_quantity: movement.quantity,
            unit: movement.unit,
            storage_location: movement.storage_location || "",
            institution_id: movement.institution_id,
            expiration_date: movement.expiration_date,
            date_of_admission: movement.movement_date,
          });
        }
      }
    });

    // PASO 5: Filtrar solo los lotes con stock disponible > 0
    const availableBatches = Array.from(batchesMap.values()).filter((batch) => batch.available_quantity > 0);

    // Calcular total disponible
    const totalAvailable = availableBatches.reduce((sum, batch) => sum + batch.available_quantity, 0);

    // Determinar unidad principal (la más común)
    const unitCounts = availableBatches.reduce(
      (acc, batch) => {
        acc[batch.unit] = (acc[batch.unit] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const mainUnit =
      Object.keys(unitCounts).length > 0
        ? Object.entries(unitCounts).reduce((a, b) => (unitCounts[a[0]] > unitCounts[b[0]] ? a : b))[0]
        : "unidad";

    const result: CurrentStockResponse = {
      product_id: productId,
      institution_id: institutionId,
      total_available: totalAvailable,
      unit: mainUnit,
      batches: availableBatches,
    };

    return result;
  } catch (error) {
    console.error("❌ Error calculando stock desde movimientos:", error);
    return {
      product_id: productId,
      institution_id: institutionId,
      total_available: 0,
      unit: "unidad",
      batches: [],
    };
  }
}
