import type { MenuCycleCreate, MenuCycleResponse } from "@team-aguila/pae-menus-client";
import { httpPost } from "@/lib/http-client";

export const createMenuCycle = async (data: MenuCycleCreate): Promise<MenuCycleResponse> => {
  const base_menu_url = import.meta.env.VITE_PUBLIC_BASE_MENU_URL;
  return httpPost(`${base_menu_url}/menu-cycles`, data);
};
