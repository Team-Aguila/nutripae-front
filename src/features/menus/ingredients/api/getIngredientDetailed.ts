import { httpGet } from "@/lib/http-client";
import type { IngredientDetailedResponse } from "./getIngredientsDetailed";

export const getIngredientDetailed = async (id: string): Promise<IngredientDetailedResponse> => {
  const base_menu_url = import.meta.env.VITE_PUBLIC_BASE_MENU_URL;
  const url = `${base_menu_url}/ingredients/${id}/detailed`;
  return httpGet<IngredientDetailedResponse>(url);
};
