import { buildApiUrl, HR_CONFIG } from "@/lib/config";
import type { DocumentType } from "../../types";

export const getDocumentTypes = async (): Promise<DocumentType[]> => {
  const url = buildApiUrl(HR_CONFIG.endpoints.options.documentTypes.endpoint, HR_CONFIG.baseUrl);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch document types");
  }

  const data = await response.json();
  return data;
};
