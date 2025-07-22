import type { DailyAvailability } from "../../types";
import { httpGet } from "@/lib/http-client";

export const getAvailabilitiesForEmployee = async (
  employeeId: string,
  skip: number = 0,
  limit: number = 100
): Promise<DailyAvailability[]> => {
  const base_hr_url = import.meta.env.VITE_PUBLIC_BASE_HR_URL;
  return httpGet<DailyAvailability[]>(
    `${base_hr_url}/availabilities/employee/${employeeId}?skip=${skip}&limit=${limit}`
  );
};
