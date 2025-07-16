import { httpGet } from "@/lib/http-client";

export interface Campus {
  id: string;
  name: string;
  institution_id: string;
  address?: string;
}

export const getInstitutionCampus = async (institutionId: string): Promise<Campus[]> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const url = `${base_coverage_url}/institutions/${institutionId}/campus`;

  try {
    const result = await httpGet<Campus[]>(url);
    return result;
  } catch (error) {
    console.error("getInstitutionCampus - Error:", error);
    throw error;
  }
};
