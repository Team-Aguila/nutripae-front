import type { InstitutionResponseWithDetails } from "@team-aguila/pae-cobertura-client";

export const getInstitutions = async (): Promise<Array<InstitutionResponseWithDetails>> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const url = new URL(`${base_coverage_url}/institutions`);
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Failed to fetch institutions");
  }
  const data = await response.json();
  return data;
};
