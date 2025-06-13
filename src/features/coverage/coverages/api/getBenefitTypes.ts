import type { BenefitType } from "@team-aguila/pae-cobertura-client";

export const getBenefitTypes = async (): Promise<Array<BenefitType>> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const url = new URL(`${base_coverage_url}/parametrics/benefit-types`);
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Failed to fetch benefit types");
  }
  const data = await response.json();
  return data;
};
