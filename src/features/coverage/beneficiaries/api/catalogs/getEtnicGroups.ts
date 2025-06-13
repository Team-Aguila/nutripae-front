import type { EtnicGroup } from "@team-aguila/pae-cobertura-client";

export const getEtnicGroups = async (): Promise<Array<EtnicGroup>> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const url = new URL(`${base_coverage_url}/parametrics/etnic-groups`);
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Failed to fetch etnic groups");
  }
  const data = await response.json();
  return data;
};
