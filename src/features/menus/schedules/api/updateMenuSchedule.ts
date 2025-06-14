import { buildMenuUrl, MENU_CONFIG } from "@/lib/config";
import type { MenuScheduleResponse } from "./getMenuSchedules";

export interface MenuScheduleUpdateRequest {
  start_date?: string;
  end_date?: string;
  campus_ids?: string[];
  town_ids?: string[];
}

export const updateMenuSchedule = async (
  id: string,
  data: MenuScheduleUpdateRequest
): Promise<MenuScheduleResponse> => {
  const url = buildMenuUrl(MENU_CONFIG.endpoints.schedules.update, { id });

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Failed to update menu schedule:", errorData);
    throw new Error("Failed to update menu schedule");
  }

  return response.json();
};
