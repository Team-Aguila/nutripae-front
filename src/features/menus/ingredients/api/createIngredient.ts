import { httpPost } from "@/lib/http-client";
import type { IngredientCreate, IngredientResponse } from "@team-aguila/pae-menus-client";

export const createIngredient = async (data: IngredientCreate): Promise<IngredientResponse> => {
  const base_menu_url = import.meta.env.VITE_PUBLIC_BASE_MENU_URL;
  return httpPost<IngredientResponse>(`${base_menu_url}/ingredients`, data);
};
