import { buildApiUrl, HR_CONFIG } from "@/lib/config";
import type { DailyAvailability } from "../../types";

export const getDailyAvailabilities = async (startDate: string, endDate: string): Promise<DailyAvailability[]> => {
  const url = buildApiUrl(
    `${HR_CONFIG.endpoints.availabilities.listByDateRange.endpoint}?start_date=${startDate}&end_date=${endDate}`,
    HR_CONFIG.baseUrl
  );

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch daily availabilities");
  }

  const data: DailyAvailability[] = await response.json();
  return data;
};