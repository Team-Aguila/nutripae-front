import { buildMenuUrl, MENU_CONFIG } from "@/lib/config";
import type { DishResponse } from "@team-aguila/pae-menus-client";

export const getDish = async (id: string): Promise<DishResponse> => {
  const url = buildMenuUrl(MENU_CONFIG.endpoints.dishes.getById, { id });

  const response = await fetch(url, {
    method: "GET" as const,
  });
  if (!response.ok) {
    throw new Error("Failed to fetch dish");
  }
  return response.json();
};
