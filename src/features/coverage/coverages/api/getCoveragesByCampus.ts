import type { CoverageReadWithDetails } from "@team-aguila/pae-cobertura-client";
import { httpGet } from "@/lib/http-client";

export const getCoveragesByCampus = async (campusId: string): Promise<Array<CoverageReadWithDetails>> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  return httpGet(`${base_coverage_url}/coverages/campus/${campusId}`);
};
