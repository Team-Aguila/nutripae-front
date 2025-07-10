import { buildPurchasesUrl, PURCHASES_CONFIG } from "@/lib/config";

export interface PurchaseCalculationRequest {
  start_date: string;
  end_date: string;
  coverage: {
    type: "municipality" | "campus";
    ids: (number | string)[];
  };
}

export interface PurchaseListItem {
  ingredient_name: string;
  ingredient_id: string;
  unit: string;
  total_gross_quantity: number;
  current_inventory: number;
  safety_stock: number;
  net_quantity_to_purchase: number;
}

export interface PurchaseCalculationResponse {
  calculation_period: {
    start_date: string;
    end_date: string;
  };
  purchase_list: PurchaseListItem[];
  total_ingredients: number;
  calculation_summary?: Record<string, unknown>;
}

export async function calculatePurchaseNeeds(
  request: PurchaseCalculationRequest
): Promise<PurchaseCalculationResponse> {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.purchaseCalculation.calculate);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      // Si es 404, retornar estructura vacía en lugar de error
      if (response.status === 404) {
        return {
          calculation_period: {
            start_date: request.start_date,
            end_date: request.end_date,
          },
          purchase_list: [],
          total_ingredients: 0,
          calculation_summary: {
            total_cost_estimate: 0,
            critical_items: 0,
            normal_items: 0,
          },
        };
      }
      throw new Error(`Error calculating purchase needs: ${response.statusText}`);
    }

    const data = await response.json();

    // Si la respuesta es válida pero no tiene la estructura esperada, retornar vacío
    if (!data || !Array.isArray(data.purchase_list)) {
      return {
        calculation_period: {
          start_date: request.start_date,
          end_date: request.end_date,
        },
        purchase_list: [],
        total_ingredients: 0,
        calculation_summary: {
          total_cost_estimate: 0,
          critical_items: 0,
          normal_items: 0,
        },
      };
    }

    return data;
  } catch (error) {
    console.error("Error calculating purchase needs:", error);
    throw error;
  }
}

export async function healthCheck(): Promise<Record<string, unknown>> {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.purchaseCalculation.healthCheck);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error checking health: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error checking health:", error);
    return { status: "error", message: "Service unavailable" };
  }
}

export async function getCoverageInfo(coverageType: string): Promise<Record<string, unknown>> {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.purchaseCalculation.getCoverageInfo, {
    coverage_type: coverageType,
  });

  try {
    const response = await fetch(url);

    if (!response.ok) {
      // Si es 404, retornar estructura vacía en lugar de error
      if (response.status === 404) {
        return {
          coverage_type: coverageType,
          available_options: [],
        };
      }
      throw new Error(`Error fetching coverage info: ${response.statusText}`);
    }

    const data = await response.json();

    // Si la respuesta es válida pero no tiene la estructura esperada, retornar vacío
    if (!data) {
      return {
        coverage_type: coverageType,
        available_options: [],
      };
    }

    return data;
  } catch (error) {
    console.error("Error fetching coverage info:", error);
    throw error;
  }
}
