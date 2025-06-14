import { buildMenuUrl, MENU_CONFIG } from "@/lib/config";
import type { MenuCycleUpdate, MenuCycleResponse } from "@team-aguila/pae-menus-client";

export const updateMenuCycle = async (id: string, data: MenuCycleUpdate): Promise<MenuCycleResponse> => {
  const url = buildMenuUrl(MENU_CONFIG.endpoints.cycles.update, { id });
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Failed to update menu cycle:", errorData);
    throw new Error("Failed to update menu cycle");
  }

  const responseData = await response.json();
  return responseData;
};
