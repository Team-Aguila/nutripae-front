import { buildMenuUrl, MENU_CONFIG } from "@/lib/config";

// Interface para estadísticas generales de ingredientes
export interface IngredientsStatistics {
  total_ingredients: number;
  active_ingredients: number;
  inactive_ingredients: number;
  total_categories: number;
  categories: string[]; // Array de strings, no objetos
  most_used_ingredients?: {
    id: string;
    name: string;
    usage_count: number;
  }[];
  least_used_ingredients?: {
    id: string;
    name: string;
    usage_count: number;
  }[];
  unused_ingredients?: {
    id: string;
    name: string;
  }[];
}

export const getIngredientsStatistics = async (): Promise<IngredientsStatistics> => {
  const url = buildMenuUrl(MENU_CONFIG.endpoints.ingredients.statistics);

  const response = await fetch(url, {
    method: "GET" as const,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch ingredients statistics");
  }

  return response.json();
};
