import { buildApiUrl, HR_CONFIG } from "@/lib/config";
import type { DailyAvailability } from "../../types";

export const getDetailedAvailabilities = async (
  startDate: string,
  endDate: string,
  employeeId?: string
): Promise<DailyAvailability[]> => {
  const queryParams = new URLSearchParams({
    start_date: startDate,
    end_date: endDate,
    employee_id: employeeId || "",
  }).toString();

  const url = buildApiUrl(
    `${HR_CONFIG.endpoints.availabilities.listByDateRange.endpoint}?${queryParams}`,
    HR_CONFIG.baseUrl
  );

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch detailed availabilities");
  }

  const data: DailyAvailability[] = await response.json();
  return data;
};
