import { buildApiUrl, HR_CONFIG } from "@/lib/config";
import type { Gender } from "../../types";

export const getGenders = async (): Promise<Gender[]> => {
  const url = buildApiUrl(HR_CONFIG.endpoints.options.genders.endpoint, HR_CONFIG.baseUrl);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch genders");
  }

  const data = await response.json();
  return data;
};
