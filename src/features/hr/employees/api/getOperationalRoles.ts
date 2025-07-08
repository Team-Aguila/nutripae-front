import { buildApiUrl, HR_CONFIG } from "@/lib/config";
import type { OperationalRole } from "../../types";

export const getOperationalRoles = async (): Promise<OperationalRole[]> => {
  const url = buildApiUrl(HR_CONFIG.endpoints.options.operationalRoles.endpoint, HR_CONFIG.baseUrl);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch operational roles");
  }

  const data = await response.json();
  return data;
};
