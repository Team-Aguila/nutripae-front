import { httpGet } from "@/lib/http-client";
import type { DishResponse } from "@team-aguila/pae-menus-client";
import type { DishFilters } from "../../types";

export const getDishes = async (filters?: DishFilters): Promise<DishResponse[]> => {
  const base_menu_url = import.meta.env.VITE_PUBLIC_BASE_MENU_URL;
  const url = new URL(`${base_menu_url}/dishes`);

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return httpGet<DishResponse[]>(url.toString());
};
