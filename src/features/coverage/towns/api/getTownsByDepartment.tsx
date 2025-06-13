import type { TownResponseWithDetails } from "@team-aguila/pae-cobertura-client";

export const getTownsByDepartment = async (departmentId: number): Promise<Array<TownResponseWithDetails>> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const response = await fetch(`${base_coverage_url}/departments/${departmentId}/towns`);
  if (!response.ok) {
    throw new Error("Failed to fetch towns for department");
  }
  const data = await response.json();
  return data;
};
