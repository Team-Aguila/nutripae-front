import type { CoverageUpdate, CoverageRead } from "@team-aguila/pae-cobertura-client";

export const updateCoverage = async (id: string, coverage: CoverageUpdate): Promise<CoverageRead> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const url = new URL(`${base_coverage_url}/coverages/${id}`);
  const response = await fetch(url.toString(), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(coverage),
  });
  if (!response.ok) {
    throw new Error("Failed to update coverage");
  }
  const data = await response.json();
  return data;
};
