import type { CampusCreate, CampusResponseWithDetails } from "@team-aguila/pae-cobertura-client";

export const createCampus = async (campusData: CampusCreate): Promise<CampusResponseWithDetails> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const response = await fetch(`${base_coverage_url}/campuses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(campusData),
  });

  if (!response.ok) {
    throw new Error("Failed to create campus");
  }

  const data = await response.json();
  return data;
};
