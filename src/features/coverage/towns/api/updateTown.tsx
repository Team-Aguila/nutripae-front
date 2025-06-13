import type { TownUpdate, TownResponseWithDetails } from "@team-aguila/pae-cobertura-client";

interface UpdateTownParams {
  id: number;
  data: TownUpdate;
}

export const updateTown = async ({ id, data }: UpdateTownParams): Promise<TownResponseWithDetails> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const response = await fetch(`${base_coverage_url}/towns/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update town");
  }

  const responseData = await response.json();
  return responseData;
};
