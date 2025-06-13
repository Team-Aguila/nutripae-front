import type { TownCreate, TownResponseWithDetails } from "@team-aguila/pae-cobertura-client";

export const createTown = async (townData: TownCreate): Promise<TownResponseWithDetails> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const response = await fetch(`${base_coverage_url}/towns`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(townData),
  });

  if (!response.ok) {
    throw new Error("Failed to create town");
  }

  const data = await response.json();
  return data;
};
