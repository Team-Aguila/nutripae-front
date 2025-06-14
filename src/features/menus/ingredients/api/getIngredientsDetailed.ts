import { buildMenuUrl, MENU_CONFIG } from "@/lib/config";
import type { IngredientResponse } from "@team-aguila/pae-menus-client";
import type { IngredientFilters } from "../../types";

// Interface para ingredientes con información detallada (estadísticas de uso)
export interface IngredientDetailedResponse extends IngredientResponse {
  usage_stats?: {
    dishes_count: number;
    menu_cycles_count: number;
    total_recipes: number;
    last_used?: string;
  };
}

export const getIngredientsDetailed = async (filters?: IngredientFilters): Promise<IngredientDetailedResponse[]> => {
  const url = new URL(buildMenuUrl(MENU_CONFIG.endpoints.ingredients.detailed));

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    method: "GET" as const,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch detailed ingredients");
  }

  return response.json();
};
