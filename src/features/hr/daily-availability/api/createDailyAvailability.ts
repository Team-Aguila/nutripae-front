import { buildApiUrl, HR_CONFIG } from "@/lib/config";
import type { DailyAvailability } from "../../types";

export const createDailyAvailability = async (availability: DailyAvailability): Promise<DailyAvailability> => {
  const url = buildApiUrl(HR_CONFIG.endpoints.availabilities.create.endpoint, HR_CONFIG.baseUrl);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(availability),
  });

  if (!response.ok) {
    throw new Error("Failed to create daily availability");
  }

  const data: DailyAvailability = await response.json();
  return data;
};
