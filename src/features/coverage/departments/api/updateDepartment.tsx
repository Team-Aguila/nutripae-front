import { httpPatch } from "@/lib/http-client";
import type { DepartmentUpdate, DepartmentResponseWithDetails } from "@team-aguila/pae-cobertura-client";

interface UpdateDepartmentParams {
  id: number;
  data: DepartmentUpdate;
}

export const updateDepartment = async ({
  id,
  data,
}: UpdateDepartmentParams): Promise<DepartmentResponseWithDetails> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  return httpPatch(`${base_coverage_url}/departments/${id}`, data);
};
