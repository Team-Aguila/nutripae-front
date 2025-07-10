import { httpPost } from "@/lib/http-client";
import type { DishCreate, DishResponse } from "@team-aguila/pae-menus-client";

export const createDish = async (data: DishCreate): Promise<DishResponse> => {
  const base_menu_url = import.meta.env.VITE_PUBLIC_BASE_MENU_URL;
  return httpPost<DishResponse>(`${base_menu_url}/dishes`, data);
};
