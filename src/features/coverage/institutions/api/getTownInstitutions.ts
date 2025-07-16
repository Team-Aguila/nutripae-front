import { httpGet } from "@/lib/http-client";

export interface Institution {
  id: string;
  name: string;
  town_id: string;
  type?: string;
}

export const getTownInstitutions = async (townId: string): Promise<Institution[]> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const url = `${base_coverage_url}/towns/${townId}/institutions`;
  try {
    const result = await httpGet<Institution[]>(url);
    return result;
  } catch (error) {
    console.error("getTownInstitutions - Error:", error);
    throw error;
  }
};
