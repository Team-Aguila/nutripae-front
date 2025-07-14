import type { InstitutionResponseWithDetails } from "@team-aguila/pae-cobertura-client";
import { httpGet } from "@/lib/http-client";

export const getInstitution = async (id: number): Promise<InstitutionResponseWithDetails> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  return httpGet(`${base_coverage_url}/institutions/${id}`);
};
