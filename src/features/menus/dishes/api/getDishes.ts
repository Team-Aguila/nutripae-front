import { buildMenuUrl, MENU_CONFIG } from "@/lib/config";
import type { DishResponse } from "@team-aguila/pae-menus-client";
import type { DishFilters } from "../../types";

export const getDishes = async (filters?: DishFilters): Promise<DishResponse[]> => {
  const url = new URL(buildMenuUrl(MENU_CONFIG.endpoints.dishes.list));

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    method: "GET" as const,
  });
  if (!response.ok) {
    throw new Error("Failed to fetch dishes");
  }
  return response.json();
};
