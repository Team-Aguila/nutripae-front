import { buildMenuUrl, MENU_CONFIG } from "@/lib/config";
import type { IngredientUpdate, IngredientResponse } from "@team-aguila/pae-menus-client";

export const updateIngredient = async (id: string, data: IngredientUpdate): Promise<IngredientResponse> => {
  const url = buildMenuUrl(MENU_CONFIG.endpoints.ingredients.update, { id });

  const response = await fetch(url, {
    method: "PUT" as const,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update ingredient");
  }
  return response.json();
};
