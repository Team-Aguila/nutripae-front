import { httpGet } from "@/lib/http-client";
import type { Employee } from "@team-aguila/pae-recursos-humanos-client";

export const getEmployees = async (params?: {
  skip?: number;
  limit?: number;
  search?: string;
  role_id?: number;
  is_active?: boolean;
}): Promise<Employee[]> => {
  const queryParams = params
    ? Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, typeof value === "boolean" ? Number(value) : value])
    )
    : undefined;

  const base_hr_url = import.meta.env.VITE_PUBLIC_BASE_HR_URL;
  return httpGet<Employee[]>(`${base_hr_url}/employees?${queryParams}`);
};
