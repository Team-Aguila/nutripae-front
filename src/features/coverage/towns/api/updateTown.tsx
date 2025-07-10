import type { TownUpdate, TownResponseWithDetails } from "@team-aguila/pae-cobertura-client";
import { httpPatch } from "@/lib/http-client";

interface UpdateTownParams {
  id: number;
  data: TownUpdate;
}

export const updateTown = async ({ id, data }: UpdateTownParams): Promise<TownResponseWithDetails> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  return httpPatch(`${base_coverage_url}/towns/${id}`, data);


};
