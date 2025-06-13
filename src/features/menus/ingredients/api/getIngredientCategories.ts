import { buildMenuUrl, MENU_CONFIG } from "@/lib/config";

export const getIngredientCategories = async (): Promise<string[]> => {
  const url = buildMenuUrl(MENU_CONFIG.endpoints.ingredients.categories);

  const response = await fetch(url, {
    method: "GET" as const,
  });
  if (!response.ok) {
    throw new Error("Failed to fetch ingredient categories");
  }
  return response.json();
};
