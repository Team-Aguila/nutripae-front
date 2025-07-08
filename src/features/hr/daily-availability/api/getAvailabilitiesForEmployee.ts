import { buildApiUrl, HR_CONFIG } from "@/lib/config";
import type { DailyAvailability } from "../../types";

export const getAvailabilitiesForEmployee = async (
  employeeId: string,
  skip: number = 0,
  limit: number = 100
): Promise<DailyAvailability[]> => {
  const url = buildApiUrl(
    `${HR_CONFIG.endpoints.availabilities.listByEmployee.endpoint}/${employeeId}?skip=${skip}&limit=${limit}`,
    HR_CONFIG.baseUrl
  );

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch availabilities for employee");
  }

  const data: DailyAvailability[] = await response.json();
  return data;
};
