import type { EmployeeUpdate, Employee } from "@team-aguila/pae-recursos-humanos-client";
import { httpPut } from "@/lib/http-client";

export const updateEmployee = async (id: number, data: EmployeeUpdate): Promise<Employee> => {
  const base_hr_url = import.meta.env.VITE_PUBLIC_BASE_HR_URL;
  return httpPut(`${base_hr_url}/employees/${id}`, data);
};
