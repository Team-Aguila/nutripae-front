import type { InstitutionCreate, InstitutionResponseWithDetails } from "@team-aguila/pae-cobertura-client";
import { httpPost } from "@/lib/http-client";

export const createInstitution = async (
  institutionData: InstitutionCreate
): Promise<InstitutionResponseWithDetails> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  return httpPost(`${base_coverage_url}/institutions`, institutionData);
};
