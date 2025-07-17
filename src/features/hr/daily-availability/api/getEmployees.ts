import { httpGet } from "@/lib/http-client";
import type { Employee } from "../../types";

export const getEmployees = async (search?: string, role_id?: number, is_active?: boolean): Promise<Employee[]> => {
  const base_hr_url = import.meta.env.VITE_PUBLIC_BASE_HR_URL;
  const queryParams = new URLSearchParams();

  if (search) queryParams.append("search", search);
  if (role_id) queryParams.append("role_id", role_id.toString());
  if (is_active !== undefined) queryParams.append("is_active", is_active.toString());

  return httpGet<Employee[]>(`${base_hr_url}/employees?${queryParams.toString()}`);
};
