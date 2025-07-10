import { httpGet } from "@/lib/http-client";
import type { IngredientResponse } from "@team-aguila/pae-menus-client";
import type { IngredientFilters } from "../../types";

export const getIngredients = async (filters?: IngredientFilters): Promise<IngredientResponse[]> => {
  const base_menu_url = import.meta.env.VITE_PUBLIC_BASE_MENU_URL;
  const url = new URL(`${base_menu_url}/ingredients`);

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return httpGet<IngredientResponse[]>(url.toString());
};
