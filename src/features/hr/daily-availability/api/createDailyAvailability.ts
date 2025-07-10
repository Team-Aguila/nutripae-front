import { httpPost } from "@/lib/http-client";
import type { DailyAvailability } from "../../types";

export const createDailyAvailability = async (availability: DailyAvailability): Promise<DailyAvailability> => {
  const base_hr_url = import.meta.env.VITE_PUBLIC_BASE_HR_URL;
  return httpPost(`${base_hr_url}/daily-availabilities`, availability);
};
