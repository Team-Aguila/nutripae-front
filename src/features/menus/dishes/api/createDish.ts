import { buildMenuUrl, MENU_CONFIG } from "@/lib/config";
import type { DishCreate, DishResponse } from "@team-aguila/pae-menus-client";

export const createDish = async (data: DishCreate): Promise<DishResponse> => {
  const url = buildMenuUrl(MENU_CONFIG.endpoints.dishes.create);

  const response = await fetch(url, {
    method: "POST" as const,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create dish");
  }
  return response.json();
};
