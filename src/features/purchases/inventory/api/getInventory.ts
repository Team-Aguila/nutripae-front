import { buildPurchasesUrl, PURCHASES_CONFIG } from "@/lib/config";

export interface InventoryItem {
  status: string;
  _id: string;
  product_id: string;
  product_name: string;
  institution_id: number;
  institution_name: string;
  provider_name: string;
  category: string;
  quantity: number;
  base_unit: string;
  storage_location: string | null;
  lot: string;
  batch_number: string;
  last_entry_date: string;
  expiration_date: string;
  minimum_threshold: number;
  is_below_threshold: boolean;
  initial_weight: number;
  created_at: string;
}

export interface InventoryConsultationResponse {
  items: InventoryItem[];
  total_count: number;
  page_info: {
    offset: number;
    limit: number;
    has_next: boolean;
    has_previous: boolean;
  };
  summary: {
    total_items: number;
    below_threshold_count: number;
    expired_count: number;
    categories: string[];
  };
}

export interface GetInventoryParams {
  institution_id?: number;
  product_id?: string;
  category?: string;
  provider_id?: string;
  show_expired?: boolean;
  show_below_threshold?: boolean;
  limit?: number;
  offset?: number;
}

export async function getInventory(params: GetInventoryParams = {}): Promise<InventoryConsultationResponse> {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.inventory.consult);
  const searchParams = new URLSearchParams();

  if (params.institution_id !== undefined) {
    searchParams.append("institution_id", params.institution_id.toString());
  }
  if (params.product_id !== undefined) {
    searchParams.append("product_id", params.product_id);
  }
  if (params.category !== undefined) {
    searchParams.append("category", params.category);
  }
  if (params.provider_id !== undefined) {
    searchParams.append("provider_id", params.provider_id);
  }
  if (params.show_expired !== undefined) {
    searchParams.append("show_expired", params.show_expired.toString());
  }
  if (params.show_below_threshold !== undefined) {
    searchParams.append("show_below_threshold", params.show_below_threshold.toString());
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
      // Si es 404, retornar estructura vacía en lugar de error
      if (response.status === 404) {
        return {
          items: [],
          total_count: 0,
          page_info: {
            offset: params.offset || 0,
            limit: params.limit || 100,
            has_next: false,
            has_previous: false,
          },
          summary: {
            total_items: 0,
            below_threshold_count: 0,
            expired_count: 0,
            categories: [],
          },
        };
      }
      throw new Error(`Error fetching inventory: ${response.statusText}`);
    }

    const data = await response.json();

    // Si la respuesta es válida pero no tiene la estructura esperada, retornar vacío
    if (!data || !Array.isArray(data.items)) {
      return {
        items: [],
        total_count: 0,
        page_info: {
          offset: params.offset || 0,
          limit: params.limit || 100,
          has_next: false,
          has_previous: false,
        },
        summary: {
          total_items: 0,
          below_threshold_count: 0,
          expired_count: 0,
          categories: [],
        },
      };
    }

    return data;
  } catch (error) {
    console.error("Error fetching inventory:", error);
    throw error;
  }
}

export async function updateMinimumThreshold(
  inventoryId: string,
  newThreshold: number
): Promise<Record<string, unknown>> {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.inventory.updateThreshold, { inventory_id: inventoryId });

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ new_threshold: newThreshold }),
    });

    if (!response.ok) {
      throw new Error(`Error updating threshold: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating threshold:", error);
    throw error;
  }
}
