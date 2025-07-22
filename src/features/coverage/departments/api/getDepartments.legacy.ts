import { httpGet } from "@/lib/http-client";

export interface Department {
  id: string;
  name: string;
  code?: string;
}

export const getDepartments = async (): Promise<Department[]> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const url = `${base_coverage_url}/departments`;
  try {
    const result = await httpGet<Department[]>(url);
    return result;
  } catch (error) {
    console.error("getDepartments - Error:", error);
    throw error;
  }
};
