import { httpPut } from "@/lib/http-client";
import type { IngredientUpdate, IngredientResponse } from "@team-aguila/pae-menus-client";

export const updateIngredient = async (id: string, data: IngredientUpdate): Promise<IngredientResponse> => {
  const base_menu_url = import.meta.env.VITE_PUBLIC_BASE_MENU_URL;
  const url = `${base_menu_url}/ingredients/${id}`;

  return httpPut<IngredientResponse>(url, data);
};
