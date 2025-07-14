import type { BeneficiaryUpdate, BeneficiaryReadWithDetails } from "@team-aguila/pae-cobertura-client";
import { httpPatch } from "@/lib/http-client";

interface UpdateBeneficiaryParams {
  id: string;
  data: BeneficiaryUpdate;
}

export const updateBeneficiary = async ({ id, data }: UpdateBeneficiaryParams): Promise<BeneficiaryReadWithDetails> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  return httpPatch(`${base_coverage_url}/beneficiaries/${id}`, data);
};
