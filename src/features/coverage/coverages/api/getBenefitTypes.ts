import type { BenefitType } from "@team-aguila/pae-cobertura-client";
import { httpGet } from "@/lib/http-client";

export const getBenefitTypes = async (): Promise<Array<BenefitType>> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  return httpGet(`${base_coverage_url}/parametrics/benefit-types`);
};
