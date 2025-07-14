import { httpGet } from "@/lib/http-client";
import type { IngredientResponse } from "@team-aguila/pae-menus-client";

export const getActiveIngredients = async (filters?: {
  skip?: number;
  limit?: number;
  category?: string;
  search?: string;
}): Promise<IngredientResponse[]> => {
  const base_menu_url = import.meta.env.VITE_PUBLIC_BASE_MENU_URL;
  const url = new URL(`${base_menu_url}/ingredients/active`);

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return httpGet<IngredientResponse[]>(url.toString());
};
