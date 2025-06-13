import type { BeneficiaryReadWithDetails } from "@team-aguila/pae-cobertura-client";

export const getBeneficiaries = async (): Promise<Array<BeneficiaryReadWithDetails>> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const url = new URL(`${base_coverage_url}/beneficiaries`);
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Failed to fetch beneficiaries");
  }
  const data = await response.json();
  return data;
};
