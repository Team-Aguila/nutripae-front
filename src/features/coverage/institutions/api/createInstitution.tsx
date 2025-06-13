import type { InstitutionCreate, InstitutionResponseWithDetails } from "@team-aguila/pae-cobertura-client";

export const createInstitution = async (
  institutionData: InstitutionCreate
): Promise<InstitutionResponseWithDetails> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const response = await fetch(`${base_coverage_url}/institutions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(institutionData),
  });

  if (!response.ok) {
    throw new Error("Failed to create institution");
  }

  const data = await response.json();
  return data;
};
