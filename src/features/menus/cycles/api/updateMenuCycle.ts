import type { MenuCycleUpdate, MenuCycleResponse } from "@team-aguila/pae-menus-client";
import { httpPatch } from "@/lib/http-client";

export const updateMenuCycle = async (id: string, data: MenuCycleUpdate): Promise<MenuCycleResponse> => {
  const base_menu_url = import.meta.env.VITE_PUBLIC_BASE_MENU_URL;
  return httpPatch(`${base_menu_url}/menu-cycles/${id}`, data);
};
