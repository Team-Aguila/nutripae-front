import { httpPatch } from "@/lib/http-client";
import type { IngredientResponse } from "@team-aguila/pae-menus-client";

export const inactivateIngredient = async (id: string): Promise<IngredientResponse> => {
  const base_menu_url = import.meta.env.VITE_PUBLIC_BASE_MENU_URL;
  const url = `${base_menu_url}/ingredients/${id}/inactivate`;
  return httpPatch<IngredientResponse>(url);
};
