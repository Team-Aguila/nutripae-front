import type { DisabilityType } from "@team-aguila/pae-cobertura-client";

export const getDisabilityTypes = async (): Promise<Array<DisabilityType>> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const url = new URL(`${base_coverage_url}/parametrics/disability-types`);
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Failed to fetch disability types");
  }
  const data = await response.json();
  return data;
};
