import { httpGet } from "@/lib/http-client";
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
  const base_menu_url = import.meta.env.VITE_PUBLIC_BASE_MENU_URL;
  const url = new URL(`${base_menu_url}/ingredients/detailed`);

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return httpGet<IngredientDetailedResponse[]>(url.toString());
};
