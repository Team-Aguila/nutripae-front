import type { InstitutionResponseWithDetails } from "@team-aguila/pae-cobertura-client";

export const getInstitutionsByTown = async (townId: number): Promise<Array<InstitutionResponseWithDetails>> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const response = await fetch(`${base_coverage_url}/towns/${townId}/institutions`);
  if (!response.ok) {
    throw new Error("Failed to fetch institutions for town");
  }
  const data = await response.json();
  return data;
};
