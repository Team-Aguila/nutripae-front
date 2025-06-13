import type { Grade } from "@team-aguila/pae-cobertura-client";

export const getGrades = async (): Promise<Array<Grade>> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const url = new URL(`${base_coverage_url}/parametrics/grades`);
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Failed to fetch grades");
  }
  const data = await response.json();
  return data;
};
