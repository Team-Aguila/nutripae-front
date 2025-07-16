import { buildPurchasesUrl, PURCHASES_CONFIG } from "@/lib/config";
import { httpPost, httpGet } from "@/lib/http-client";

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
    return await httpPost<PurchaseCalculationResponse>(url, request);
  } catch (error) {
    console.error("Error calculating purchase needs:", error);
    // Si es un error, retornar estructura vacía
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
}

export async function healthCheck(): Promise<Record<string, unknown>> {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.purchaseCalculation.healthCheck);

  try {
    return await httpGet<Record<string, unknown>>(url);
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
    return await httpGet<Record<string, unknown>>(url);
  } catch (error) {
    console.error("Error fetching coverage info:", error);
    // Si es un error, retornar estructura vacía
    return {
      coverage_type: coverageType,
      available_options: [],
    };
  }
}
