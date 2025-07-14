import { httpDelete } from "@/lib/http-client";

export const deleteBeneficiary = async (id: string): Promise<void> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  return httpDelete(`${base_coverage_url}/beneficiaries/${id}`);
};
