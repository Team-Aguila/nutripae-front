import type { InstitutionResponseWithDetails } from "@team-aguila/pae-cobertura-client";

export const getInstitution = async (id: number): Promise<InstitutionResponseWithDetails> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const response = await fetch(`${base_coverage_url}/institutions/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch institution");
  }
  const data = await response.json();
  return data;
};
