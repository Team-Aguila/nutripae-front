import type { CoverageCreate, CoverageRead } from "@team-aguila/pae-cobertura-client";

export const createCoverage = async (coverage: CoverageCreate): Promise<CoverageRead> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const url = new URL(`${base_coverage_url}/coverages`);
  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(coverage),
  });
  if (!response.ok) {
    throw new Error("Failed to create coverage");
  }
  const data = await response.json();
  return data;
};
