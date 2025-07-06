import { buildApiUrl, HR_CONFIG } from "@/lib/config";
import type { AvailabilityStatus } from "../../types";

export const getAvailabilityStatuses = async (): Promise<AvailabilityStatus[]> => {
  const url = buildApiUrl(HR_CONFIG.endpoints.options.availabilityStatuses.endpoint, HR_CONFIG.baseUrl);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch availability statuses");
  }

  const data = await response.json();
  return data;
};
