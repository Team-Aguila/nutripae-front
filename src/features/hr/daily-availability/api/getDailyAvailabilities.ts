import type { DailyAvailabilityDetails } from "../../types";
import { httpGet } from "@/lib/http-client";

export const getDailyAvailabilities = async (
  startDate: string,
  endDate: string
): Promise<DailyAvailabilityDetails[]> => {
  const base_hr_url = import.meta.env.VITE_PUBLIC_BASE_HR_URL;
  return httpGet<DailyAvailabilityDetails[]>(
    `${base_hr_url}/availabilities?start_date=${startDate}&end_date=${endDate}`
  );
};
