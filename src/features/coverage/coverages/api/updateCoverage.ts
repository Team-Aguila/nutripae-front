import type { CoverageUpdate, CoverageRead } from "@team-aguila/pae-cobertura-client";
import { httpPatch } from "@/lib/http-client";

export const updateCoverage = async (id: string, coverage: CoverageUpdate): Promise<CoverageRead> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  return httpPatch(`${base_coverage_url}/coverages/${id}`, coverage);
};
