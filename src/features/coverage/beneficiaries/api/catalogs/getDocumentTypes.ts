import type { DocumentType } from "@team-aguila/pae-cobertura-client";

export const getDocumentTypes = async (): Promise<Array<DocumentType>> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const url = new URL(`${base_coverage_url}/parametrics/document-types`);
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Failed to fetch document types");
  }
  const data = await response.json();
  return data;
};
