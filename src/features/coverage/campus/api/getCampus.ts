import type { CampusRead } from "@team-aguila/pae-cobertura-client";

export const getCampus = async (id: string): Promise<CampusRead> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const url = new URL(`${base_coverage_url}/campuses/${id}`);
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Failed to fetch campus");
  }
  const data = await response.json();
  return data;
};
