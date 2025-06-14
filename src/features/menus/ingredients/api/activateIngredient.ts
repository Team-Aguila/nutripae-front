import { buildMenuUrl, MENU_CONFIG } from "@/lib/config";
import type { IngredientResponse } from "@team-aguila/pae-menus-client";

export const activateIngredient = async (id: string): Promise<IngredientResponse> => {
  const url = buildMenuUrl(MENU_CONFIG.endpoints.ingredients.activate, { id });

  const response = await fetch(url, {
    method: "PATCH" as const,
  });

  if (!response.ok) {
    throw new Error("Failed to activate ingredient");
  }
  return response.json();
};
