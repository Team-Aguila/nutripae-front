import type { EmployeeCreate, Employee } from "@team-aguila/pae-recursos-humanos-client";
import { httpPost } from "@/lib/http-client";

export const createEmployee = async (data: EmployeeCreate): Promise<Employee> => {
  const base_hr_url = import.meta.env.VITE_PUBLIC_BASE_HR_URL;
  return httpPost(`${base_hr_url}/employees`, data);
};
