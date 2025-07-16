import { httpPatch } from "@/lib/http-client";
import type { MenuScheduleResponse } from "./getMenuSchedules";

export const cancelMenuSchedule = async (id: string, reason?: string): Promise<MenuScheduleResponse> => {
  const base_menu_url = import.meta.env.VITE_PUBLIC_BASE_MENU_URL;
  const url = new URL(`${base_menu_url}/menu-schedules/${id}/cancel`);
  if (reason) {
    url.searchParams.append("reason", reason);
  }

  return httpPatch<MenuScheduleResponse>(url.toString());
};
