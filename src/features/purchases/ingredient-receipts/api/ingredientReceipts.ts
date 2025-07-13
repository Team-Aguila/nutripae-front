import { buildPurchasesUrl, PURCHASES_CONFIG } from "@/lib/config";

export interface ReceivedItem {
  product_id: string;
  quantity: number;
  unit?: string;
  storage_location?: string;
  lot: string;
  expiration_date: string;
}

export interface IngredientReceiptCreate {
  institution_id: number;
  purchase_order_id?: string;
  receipt_date: string;
  delivery_person_name: string;
  items: ReceivedItem[];
}

export interface IngredientReceiptResponse {
  _id: string;
  institution_id: number;
  purchase_order_id?: string;
  receipt_date: string;
  delivery_person_name: string;
  items: ReceivedItem[];
  created_at: string;
  created_by: string;
}

export interface GetIngredientReceiptsParams {
  limit?: number;
  offset?: number;
}

export async function createIngredientReceipt(receipt: IngredientReceiptCreate): Promise<IngredientReceiptResponse> {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.ingredientReceipts.create);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(receipt),
    });

    if (!response.ok) {
      throw new Error(`Error creating ingredient receipt: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating ingredient receipt:", error);
    throw error;
  }
}

export async function getIngredientReceipt(receiptId: string): Promise<IngredientReceiptResponse> {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.ingredientReceipts.getById, { receipt_id: receiptId });

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error fetching ingredient receipt: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching ingredient receipt:", error);
    throw error;
  }
}

export async function getIngredientReceiptsByInstitution(
  institutionId: number,
  params: GetIngredientReceiptsParams = {}
): Promise<IngredientReceiptResponse[]> {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.ingredientReceipts.getByInstitution, {
    institution_id: institutionId.toString(),
  });
  const searchParams = new URLSearchParams();

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
      throw new Error(`Error fetching ingredient receipts: ${response.statusText}`);
    }

    const data = await response.json();

    // Si la respuesta es válida pero no es un array, retornar vacío
    if (!Array.isArray(data)) {
      return [];
    }

    return data;
  } catch (error) {
    console.error("❌ Error en la petición HTTP:", error);
    throw error;
  }
}
