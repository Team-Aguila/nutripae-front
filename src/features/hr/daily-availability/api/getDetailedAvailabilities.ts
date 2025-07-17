import { httpGet } from "@/lib/http-client";
import type { DailyAvailabilityDetails } from "../../types";

export const getDetailedAvailabilities = async (
  startDate: string,
  endDate: string,
  employeeId?: number
): Promise<DailyAvailabilityDetails[]> => {
  const base_hr_url = import.meta.env.VITE_PUBLIC_BASE_HR_URL;
  const queryParams = new URLSearchParams({
    start_date: startDate,
    end_date: endDate,
  });

  if (employeeId) {
    queryParams.append("employee_id", employeeId.toString());
  }

  return httpGet<DailyAvailabilityDetails[]>(`${base_hr_url}/daily-availabilities?${queryParams.toString()}`);
};
