import type { DepartmentResponseWithDetails } from "@team-aguila/pae-cobertura-client";

export const getDepartment = async (id: number): Promise<DepartmentResponseWithDetails> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const response = await fetch(`${base_coverage_url}/departments/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch department");
  }
  const data = await response.json();
  return data;
};
