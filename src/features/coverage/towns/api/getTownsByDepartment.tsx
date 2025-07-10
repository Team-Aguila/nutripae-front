import type { TownResponseWithDetails } from "@team-aguila/pae-cobertura-client";
import { httpGet } from "@/lib/http-client";

export const getTownsByDepartment = async (departmentId: number): Promise<Array<TownResponseWithDetails>> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  return httpGet(`${base_coverage_url}/departments/${departmentId}/towns`);
};
