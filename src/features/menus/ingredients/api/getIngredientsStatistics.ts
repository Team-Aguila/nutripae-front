import { httpGet } from "@/lib/http-client";

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
  const base_menu_url = import.meta.env.VITE_PUBLIC_BASE_MENU_URL;
  const url = `${base_menu_url}/ingredients/statistics`;

  return httpGet<IngredientsStatistics>(url);
};
