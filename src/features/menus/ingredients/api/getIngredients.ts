import { buildMenuUrl, MENU_CONFIG } from "@/lib/config";
import type { IngredientResponse } from "@team-aguila/pae-menus-client";
import type { IngredientFilters } from "../../types";

export const getIngredients = async (filters?: IngredientFilters): Promise<IngredientResponse[]> => {
  const url = new URL(buildMenuUrl(MENU_CONFIG.endpoints.ingredients.list));

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    method: MENU_CONFIG.endpoints.ingredients.list.method,
  });
  if (!response.ok) {
    throw new Error("Failed to fetch ingredients");
  }
  return response.json();
};
