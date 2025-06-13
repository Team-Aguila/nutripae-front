import type { Gender } from "@team-aguila/pae-cobertura-client";

export const getGenders = async (): Promise<Array<Gender>> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const url = new URL(`${base_coverage_url}/parametrics/genders`);
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Failed to fetch genders");
  }
  const data = await response.json();
  return data;
};
