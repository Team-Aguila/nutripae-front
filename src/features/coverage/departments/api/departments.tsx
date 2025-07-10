import type { DepartmentResponseWithDetails } from "@team-aguila/pae-cobertura-client";
import { httpGet } from "@/lib/http-client";

export const getDepartments = async (): Promise<Array<DepartmentResponseWithDetails>> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  return httpGet<Array<DepartmentResponseWithDetails>>(`${base_coverage_url}/departments`);
};
