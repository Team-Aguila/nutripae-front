import type { TownResponseWithDetails } from "@team-aguila/pae-cobertura-client";

export const getTown = async (id: number): Promise<TownResponseWithDetails> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const response = await fetch(`${base_coverage_url}/towns/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch town");
  }
  const data = await response.json();
  return data;
};
