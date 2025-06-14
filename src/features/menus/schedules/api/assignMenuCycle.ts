import { buildMenuUrl, MENU_CONFIG } from "@/lib/config";

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
  const url = buildMenuUrl(MENU_CONFIG.endpoints.schedules.assign);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to assign menu cycle");
  }
  return response.json();
};
