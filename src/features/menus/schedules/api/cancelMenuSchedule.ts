import { buildMenuUrl, MENU_CONFIG } from "@/lib/config";
import type { MenuScheduleResponse } from "./getMenuSchedules";

export const cancelMenuSchedule = async (id: string, reason?: string): Promise<MenuScheduleResponse> => {
  const url = new URL(buildMenuUrl(MENU_CONFIG.endpoints.schedules.cancel, { id }));

  if (reason) {
    url.searchParams.append("reason", reason);
  }

  const response = await fetch(url.toString(), {
    method: "PATCH" as const,
  });

  if (!response.ok) {
    throw new Error("Failed to cancel menu schedule");
  }
  return response.json();
};
