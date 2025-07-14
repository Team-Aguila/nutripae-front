import { httpDelete } from "@/lib/http-client";

export const deleteIngredient = async (id: string): Promise<void> => {
  const base_menu_url = import.meta.env.VITE_PUBLIC_BASE_MENU_URL;
  const url = `${base_menu_url}/ingredients/${id}`;
  return httpDelete(url);
};
