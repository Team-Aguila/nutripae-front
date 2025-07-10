import { httpGet } from "@/lib/http-client";
import type { DocumentType } from "../../types";

export const getDocumentTypes = async (): Promise<DocumentType[]> => {
  const base_hr_url = import.meta.env.VITE_PUBLIC_BASE_HR_URL;
  return httpGet<DocumentType[]>(`${base_hr_url}/options/document-types`);
};
