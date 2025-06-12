import type { DepartmentResponseWithDetails } from "@team-aguila/pae-cobertura-client";

export const getDepartments = async (): Promise<Array<DepartmentResponseWithDetails>> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  console.log(base_coverage_url);
  const response = await fetch(`${base_coverage_url}/departments`);
  const data = await response.json();
  return data;
};
