import { buildMenuUrl, MENU_CONFIG } from "@/lib/config";
import type { DishUpdate, DishResponse } from "@team-aguila/pae-menus-client";

export const updateDish = async (id: string, data: DishUpdate): Promise<DishResponse> => {
  const url = buildMenuUrl(MENU_CONFIG.endpoints.dishes.update, { id });

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update dish");
  }
  return response.json();
};
