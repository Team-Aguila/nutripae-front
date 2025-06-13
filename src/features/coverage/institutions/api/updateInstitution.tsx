import type { InstitutionUpdate, InstitutionResponseWithDetails } from "@team-aguila/pae-cobertura-client";

interface UpdateInstitutionParams {
  id: number;
  data: InstitutionUpdate;
}

export const updateInstitution = async ({
  id,
  data,
}: UpdateInstitutionParams): Promise<InstitutionResponseWithDetails> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const response = await fetch(`${base_coverage_url}/institutions/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update institution");
  }

  const responseData = await response.json();
  return responseData;
};
