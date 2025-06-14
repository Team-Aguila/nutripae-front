import { buildMenuUrl, MENU_CONFIG } from "@/lib/config";
import type { MenuCycleResponse } from "@team-aguila/pae-menus-client";

export const deactivateMenuCycle = async (id: string): Promise<MenuCycleResponse> => {
  const url = buildMenuUrl(MENU_CONFIG.endpoints.cycles.deactivate, { id });
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Failed to deactivate menu cycle:", errorData);
    throw new Error("Failed to deactivate menu cycle");
  }

  const data = await response.json();
  return data;
};
