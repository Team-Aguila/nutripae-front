import type { CoverageCreate, CoverageRead } from "@team-aguila/pae-cobertura-client";
import { httpPost } from "@/lib/http-client";

export const createCoverage = async (coverage: CoverageCreate): Promise<CoverageRead> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  return httpPost(`${base_coverage_url}/coverages`, coverage);
};
