import { buildMenuUrl, MENU_CONFIG } from "@/lib/config";
import type { IngredientDetailedResponse } from "./getIngredientsDetailed";

export const getIngredientDetailed = async (id: string): Promise<IngredientDetailedResponse> => {
  const url = buildMenuUrl(MENU_CONFIG.endpoints.ingredients.getDetailedById, { id });

  const response = await fetch(url, {
    method: "GET" as const,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch detailed ingredient");
  }

  return response.json();
};
