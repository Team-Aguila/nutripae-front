import type { DailyAvailability } from "../../types";
import { httpGet } from "@/lib/http-client";

export const getDailyAvailabilities = async (startDate: string, endDate: string): Promise<DailyAvailability[]> => {
  const base_hr_url = import.meta.env.VITE_PUBLIC_BASE_HR_URL;
  return httpGet<DailyAvailability[]>(
    `${base_hr_url}/daily-availabilities?start_date=${startDate}&end_date=${endDate}`
  );
};
