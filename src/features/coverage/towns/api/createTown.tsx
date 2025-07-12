import type { TownCreate, TownResponseWithDetails } from "@team-aguila/pae-cobertura-client";
import { httpPost } from "@/lib/http-client";

export const createTown = async (townData: TownCreate): Promise<TownResponseWithDetails> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  return httpPost(`${base_coverage_url}/towns`, townData);
};
