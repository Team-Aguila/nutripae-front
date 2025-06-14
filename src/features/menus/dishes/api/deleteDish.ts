import { buildMenuUrl, MENU_CONFIG } from "@/lib/config";
import type { DishResponse } from "@team-aguila/pae-menus-client";

export const deleteDish = async (id: string): Promise<DishResponse> => {
  const url = buildMenuUrl(MENU_CONFIG.endpoints.dishes.update, { id });

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: "inactive" }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete dish");
  }
  return response.json();
};
