import { httpGet } from "@/lib/http-client";

export const getIngredientCategories = async (): Promise<string[]> => {
  const base_menu_url = import.meta.env.VITE_PUBLIC_BASE_MENU_URL;
  const url = `${base_menu_url}/ingredients/categories`;
  return httpGet<string[]>(url);
};
