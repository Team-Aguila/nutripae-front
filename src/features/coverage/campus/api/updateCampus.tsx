import type { CampusUpdate, CampusResponseWithDetails } from "@team-aguila/pae-cobertura-client";
import { httpPatch } from "@/lib/http-client";

interface UpdateCampusParams {
  id: number;
  data: CampusUpdate;
}

export const updateCampus = async ({ id, data }: UpdateCampusParams): Promise<CampusResponseWithDetails> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  return httpPatch(`${base_coverage_url}/campuses/${id}`, data);
};
