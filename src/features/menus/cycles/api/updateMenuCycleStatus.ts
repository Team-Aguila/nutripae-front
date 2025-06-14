import { buildMenuUrl, MENU_CONFIG } from "@/lib/config";
import type { MenuCycleResponse } from "@team-aguila/pae-menus-client";

export const updateMenuCycleStatus = async (id: string, status: "active" | "inactive"): Promise<MenuCycleResponse> => {
  const url = buildMenuUrl(MENU_CONFIG.endpoints.cycles.update, { id });
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Failed to update menu cycle status:", errorData);
    throw new Error(`Failed to ${status === "active" ? "activate" : "deactivate"} menu cycle`);
  }

  const data = await response.json();
  return data;
};
