import type { Employee } from "../../../hr/types";
import { httpGet } from "@/lib/http-client";

export const getEmployee = async (employeeId: number): Promise<Employee> => {
  const base_hr_url = import.meta.env.VITE_PUBLIC_BASE_HR_URL;
  return httpGet<Employee>(`${base_hr_url}/employees/${employeeId}`);
};
