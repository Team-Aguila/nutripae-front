import { buildMenuUrl, MENU_CONFIG } from "@/lib/config";
import type { MenuScheduleResponse } from "./getMenuSchedules";

export const getMenuSchedule = async (id: string): Promise<MenuScheduleResponse> => {
  const url = buildMenuUrl(MENU_CONFIG.endpoints.schedules.getById, { id });

  const response = await fetch(url, {
    method: "GET" as const,
  });
  if (!response.ok) {
    throw new Error("Failed to fetch menu schedule");
  }
  return response.json();
};
