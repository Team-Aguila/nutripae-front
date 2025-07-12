import type { CampusResponseWithDetails } from "@team-aguila/pae-cobertura-client";
import { httpGet } from "@/lib/http-client";

export const getCampusesByInstitution = async (institutionId: number): Promise<Array<CampusResponseWithDetails>> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  return httpGet(`${base_coverage_url}/institutions/${institutionId}/campuses`);
};
