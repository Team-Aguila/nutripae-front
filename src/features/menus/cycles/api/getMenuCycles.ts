import { httpGet } from "@/lib/http-client";
import type { MenuCycleResponse } from "@team-aguila/pae-menus-client";

export const getMenuCycles = async (): Promise<MenuCycleResponse[]> => {
  const base_menu_url = import.meta.env.VITE_PUBLIC_BASE_MENU_URL;
  return httpGet<MenuCycleResponse[]>(`${base_menu_url}/menu-cycles`);
};
