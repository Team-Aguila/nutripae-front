import { buildApiUrl, HR_CONFIG } from "@/lib/config";
import type { Employee } from "@team-aguila/pae-recursos-humanos-client";

export const getEmployees = async (params?: {
  skip?: number;
  limit?: number;
  search?: string;
  role_id?: number;
  is_active?: boolean;
}): Promise<Employee[]> => {
  const queryParams = params
    ? Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, typeof value === "boolean" ? Number(value) : value])
    )
    : undefined;

  let url = buildApiUrl(HR_CONFIG.endpoints.employees.list.endpoint, HR_CONFIG.baseUrl);
  if (queryParams) {
    const searchParams = new URLSearchParams(queryParams as Record<string, string>).toString();
    url += `?${searchParams}`;
  }

  const response = await fetch(url, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch employees");
  }

  const data = await response.json();
  return data;
};
