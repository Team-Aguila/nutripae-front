import { httpPost } from "@/lib/http-client";

export interface MenuScheduleAssignmentRequest {
  menu_cycle_id: string;
  campus_ids?: string[];
  town_ids?: string[];
  start_date: string;
  end_date: string;
}

export interface MenuScheduleAssignmentSummary {
  menu_cycle_id: string;
  menu_cycle_name: string;
  locations: Array<{
    id: string;
    name: string;
    location_type: "campus" | "town";
  }>;
  start_date: string;
  end_date: string;
  duration_days: number;
  schedule_id: string;
}

export const assignMenuCycle = async (data: MenuScheduleAssignmentRequest): Promise<MenuScheduleAssignmentSummary> => {
  const base_menu_url = import.meta.env.VITE_PUBLIC_BASE_MENU_URL;
  const url = `${base_menu_url}/menu-schedules/assign`;
  return httpPost<MenuScheduleAssignmentSummary>(url, data);
};
