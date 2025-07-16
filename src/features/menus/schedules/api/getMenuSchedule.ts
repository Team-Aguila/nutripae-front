import { httpGet } from "@/lib/http-client";
import type { MenuScheduleResponse } from "./getMenuSchedules";

export const getMenuSchedule = async (id: string): Promise<MenuScheduleResponse> => {
  const base_menu_url = import.meta.env.VITE_PUBLIC_BASE_MENU_URL;
  const url = `${base_menu_url}/menu-schedules/${id}`;

  return httpGet<MenuScheduleResponse>(url);
};
