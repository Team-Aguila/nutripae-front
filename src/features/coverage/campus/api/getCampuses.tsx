import type { CampusResponseWithDetails } from "@team-aguila/pae-cobertura-client";

export const getCampuses = async (): Promise<Array<CampusResponseWithDetails>> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const url = new URL(`${base_coverage_url}/campuses`);
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Failed to fetch campuses");
  }
  const data = await response.json();
  return data;
};
