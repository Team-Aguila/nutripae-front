import type { CoverageReadWithDetails } from "@team-aguila/pae-cobertura-client";

export const getCoverages = async (): Promise<Array<CoverageReadWithDetails>> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const url = new URL(`${base_coverage_url}/coverages`);
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Failed to fetch coverages");
  }
  const data = await response.json();
  return data;
};
