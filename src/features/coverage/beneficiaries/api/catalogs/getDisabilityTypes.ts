import { httpGet } from "@/lib/http-client";
import type { DisabilityType } from "@team-aguila/pae-cobertura-client";

export const getDisabilityTypes = async (): Promise<Array<DisabilityType>> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  return httpGet(`${base_coverage_url}/parametrics/disability-types`);
};
