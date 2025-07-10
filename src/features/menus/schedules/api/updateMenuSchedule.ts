import { httpPatch } from "@/lib/http-client";
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
  const base_menu_url = import.meta.env.VITE_PUBLIC_BASE_MENU_URL;
  const url = `${base_menu_url}/schedules/${id}`;

  return httpPatch<MenuScheduleResponse>(url, data);
};
