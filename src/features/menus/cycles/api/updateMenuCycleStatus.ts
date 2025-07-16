import { httpPatch } from "@/lib/http-client";
import type { MenuCycleResponse } from "@team-aguila/pae-menus-client";

export const updateMenuCycleStatus = async (id: string, status: "active" | "inactive"): Promise<MenuCycleResponse> => {
  const base_menu_url = import.meta.env.VITE_PUBLIC_BASE_MENU_URL;
  return httpPatch(`${base_menu_url}/menu-cycles/${id}`, { status });
};
