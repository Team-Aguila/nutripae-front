import { buildMenuUrl, MENU_CONFIG } from "@/lib/config";
import type { IngredientCreate, IngredientResponse } from "@team-aguila/pae-menus-client";

export const createIngredient = async (data: IngredientCreate): Promise<IngredientResponse> => {
  const url = buildMenuUrl(MENU_CONFIG.endpoints.ingredients.create);

  const response = await fetch(url, {
    method: "POST" as const,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create ingredient");
  }
  return response.json();
};
