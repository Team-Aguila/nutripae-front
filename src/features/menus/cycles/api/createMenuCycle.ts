import { buildMenuUrl, MENU_CONFIG } from "@/lib/config";
import type { MenuCycleCreate, MenuCycleResponse } from "@team-aguila/pae-menus-client";

export const createMenuCycle = async (data: MenuCycleCreate): Promise<MenuCycleResponse> => {
  const url = buildMenuUrl(MENU_CONFIG.endpoints.cycles.create);
  const response = await fetch(url, {
    method: "POST" as const,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Failed to create menu cycle:", errorData);
    throw new Error("Failed to create menu cycle");
  }

  const responseData = await response.json();
  return responseData;
};
