import type { CampusCreate, CampusResponseWithDetails } from "@team-aguila/pae-cobertura-client";
import { httpPost } from "@/lib/http-client";

export const createCampus = async (campusData: CampusCreate): Promise<CampusResponseWithDetails> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  return httpPost(`${base_coverage_url}/campuses`, campusData);

};
