import { httpGet } from "@/lib/http-client";

export interface DepartmentTown {
  id: string;
  name: string;
  department_id: string;
}

export const getDepartmentTowns = async (departmentId: string): Promise<DepartmentTown[]> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const url = `${base_coverage_url}/departments/${departmentId}/towns`;
  try {
    const result = await httpGet<DepartmentTown[]>(url);
    return result;
  } catch (error) {
    console.error("getDepartmentTowns - Error:", error);
    throw error;
  }
};
