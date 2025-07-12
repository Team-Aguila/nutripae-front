import type { Grade } from "@team-aguila/pae-cobertura-client";
import { httpGet } from "@/lib/http-client";

export const getGrades = async (): Promise<Array<Grade>> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  return httpGet(`${base_coverage_url}/parametrics/grades`);
};
