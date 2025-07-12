import { httpDelete } from "@/lib/http-client";

export const deleteTown = async (id: number): Promise<void> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  return httpDelete(`${base_coverage_url}/towns/${id}`);
};
