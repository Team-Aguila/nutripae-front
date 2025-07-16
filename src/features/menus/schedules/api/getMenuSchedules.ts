import { httpGet } from "@/lib/http-client";
import type { MenuScheduleFilters } from "../../types";

// Nota: Estos tipos deberían estar en @team-aguila/pae-menus-client pero los definimos temporalmente
export interface MenuScheduleResponse {
  _id: string;
  menu_cycle_id: string;
  coverage: Array<{
    location_id: string;
    location_type: "campus" | "town";
    location_name: string;
  }>;
  start_date: string;
  end_date: string;
  status: "active" | "future" | "completed" | "cancelled";
  cancellation_info?: {
    reason?: string;
    cancelled_at: string;
  };
  created_at: string;
  updated_at: string;
}

export const getMenuSchedules = async (filters?: MenuScheduleFilters): Promise<MenuScheduleResponse[]> => {
  const base_menu_url = import.meta.env.VITE_PUBLIC_BASE_MENU_URL;
  const url = new URL(`${base_menu_url}/menu-schedules`);

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return httpGet<MenuScheduleResponse[]>(url.toString());
};
