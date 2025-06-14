import { buildMenuUrl, MENU_CONFIG } from "@/lib/config";
import type { IngredientResponse } from "@team-aguila/pae-menus-client";

export const getActiveIngredients = async (filters?: {
  skip?: number;
  limit?: number;
  category?: string;
  search?: string;
}): Promise<IngredientResponse[]> => {
  const url = new URL(buildMenuUrl(MENU_CONFIG.endpoints.ingredients.active));

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
    throw new Error("Failed to fetch active ingredients");
  }
  return response.json();
};
