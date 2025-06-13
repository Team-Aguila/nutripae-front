import { buildMenuUrl, MENU_CONFIG } from "@/lib/config";
import type { IngredientResponse } from "@team-aguila/pae-menus-client";

export const getIngredient = async (id: string): Promise<IngredientResponse> => {
  const url = buildMenuUrl(MENU_CONFIG.endpoints.ingredients.getById, { id });

  const response = await fetch(url, {
    method: MENU_CONFIG.endpoints.ingredients.getById.method,
  });
  if (!response.ok) {
    throw new Error("Failed to fetch ingredient");
  }
  return response.json();
};
