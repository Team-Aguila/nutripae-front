import type { CampusResponseWithDetails } from "@team-aguila/pae-cobertura-client";

export const getCampusesByInstitution = async (institutionId: number): Promise<Array<CampusResponseWithDetails>> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const response = await fetch(`${base_coverage_url}/institutions/${institutionId}/campuses`);
  if (!response.ok) {
    throw new Error("Failed to fetch campuses for institution");
  }
  const data = await response.json();
  return data;
};
