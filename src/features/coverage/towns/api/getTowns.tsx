import type { TownResponseWithDetails } from "@team-aguila/pae-cobertura-client";

export const getTowns = async (): Promise<Array<TownResponseWithDetails>> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const url = new URL(`${base_coverage_url}/towns`);
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Failed to fetch towns");
  }
  const data = await response.json();
  return data;
};
