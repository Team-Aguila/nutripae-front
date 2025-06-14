import { buildMenuUrl, MENU_CONFIG } from "@/lib/config";
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
  const url = new URL(buildMenuUrl(MENU_CONFIG.endpoints.schedules.list));

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    method: "GET" as const,
  });
  if (!response.ok) {
    throw new Error("Failed to fetch menu schedules");
  }
  return response.json();
};
