
import { httpGet } from "@/lib/http-client";
import type { DailyAvailability } from "../../types";

export const getDetailedAvailabilities = async (
  startDate: string,
  endDate: string,
  employeeId?: string
): Promise<DailyAvailability[]> => {
  const base_hr_url = import.meta.env.VITE_PUBLIC_BASE_HR_URL;
  const queryParams = new URLSearchParams({
    start_date: startDate,
    end_date: endDate,
    employee_id: employeeId || "",
  }).toString();

  return httpGet<DailyAvailability[]>(`${base_hr_url}/daily-availabilities?${queryParams}`);
};
