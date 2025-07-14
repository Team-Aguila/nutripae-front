import type { BeneficiaryCreate, BeneficiaryReadWithDetails } from "@team-aguila/pae-cobertura-client";
import { httpPost } from "@/lib/http-client";

export const createBeneficiary = async (beneficiaryData: BeneficiaryCreate): Promise<BeneficiaryReadWithDetails> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  return httpPost(`${base_coverage_url}/beneficiaries`, beneficiaryData);
};
