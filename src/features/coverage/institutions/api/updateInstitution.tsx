import type { InstitutionUpdate, InstitutionResponseWithDetails } from "@team-aguila/pae-cobertura-client";
import { httpPatch } from "@/lib/http-client";

interface UpdateInstitutionParams {
  id: number;
  data: InstitutionUpdate;
}

export const updateInstitution = async ({
  id,
  data,
}: UpdateInstitutionParams): Promise<InstitutionResponseWithDetails> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  return httpPatch(`${base_coverage_url}/institutions/${id}`, data);
};