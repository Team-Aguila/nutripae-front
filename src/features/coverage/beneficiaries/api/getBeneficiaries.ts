import type { BeneficiaryReadWithDetails } from "@team-aguila/pae-cobertura-client";
import { httpGet } from "@/lib/http-client";

export const getBeneficiaries = async (): Promise<Array<BeneficiaryReadWithDetails>> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  return httpGet(`${base_coverage_url}/beneficiaries`);
};
