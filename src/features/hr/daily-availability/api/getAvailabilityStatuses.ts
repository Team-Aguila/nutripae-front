import { httpGet } from "@/lib/http-client";

export interface AvailabilityStatus {
  id: number;
  name: string;
}

export const getAvailabilityStatuses = async (): Promise<AvailabilityStatus[]> => {
  const base_hr_url = import.meta.env.VITE_PUBLIC_BASE_HR_URL;
  return httpGet<AvailabilityStatus[]>(`${base_hr_url}/options/availability-statuses`);
};
