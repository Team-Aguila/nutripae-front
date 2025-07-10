import type { DepartmentCreate, DepartmentResponseWithDetails } from "@team-aguila/pae-cobertura-client";
import { httpPost } from "@/lib/http-client";

export const createDepartment = async (departmentData: DepartmentCreate): Promise<DepartmentResponseWithDetails> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  return httpPost(`${base_coverage_url}/departments`, departmentData);
};
