import { buildApiUrl, HR_CONFIG } from "@/lib/config";
import type { EmployeeCreate, Employee } from "@team-aguila/pae-recursos-humanos-client";

export const createEmployee = async (data: EmployeeCreate): Promise<Employee> => {
  const url = buildApiUrl(HR_CONFIG.endpoints.employees.create.endpoint, HR_CONFIG.baseUrl);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Failed to create employee:", errorData);
    throw new Error("Failed to create employee");
  }

  const responseData = await response.json();
  return responseData;
};
