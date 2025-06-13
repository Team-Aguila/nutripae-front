import { buildMenuUrl, MENU_CONFIG } from "@/lib/config";
import type { MenuCycleResponse } from "@team-aguila/pae-menus-client";

export const getMenuCycles = async (): Promise<MenuCycleResponse[]> => {
  const url = buildMenuUrl(MENU_CONFIG.endpoints.cycles.list);
  const response = await fetch(url, {
    method: "GET" as const,
  });
  if (!response.ok) {
    throw new Error("Failed to fetch menu cycles");
  }
  const data = await response.json();
  return data;
};
