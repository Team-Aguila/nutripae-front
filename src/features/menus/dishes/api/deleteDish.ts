import { httpPut } from "@/lib/http-client";
import type { DishResponse } from "@team-aguila/pae-menus-client";

export const deleteDish = async (id: string): Promise<DishResponse> => {
  const base_menu_url = import.meta.env.VITE_PUBLIC_BASE_MENU_URL;
  return httpPut<DishResponse>(`${base_menu_url}/dishes/${id}`, { status: "inactive" });
};
