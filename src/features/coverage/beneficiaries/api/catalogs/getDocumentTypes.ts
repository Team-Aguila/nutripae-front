import type { DocumentType } from "@team-aguila/pae-cobertura-client";
import { httpGet } from "@/lib/http-client";

export const getDocumentTypes = async (): Promise<Array<DocumentType>> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  return httpGet(`${base_coverage_url}/parametrics/document-types`);
};
