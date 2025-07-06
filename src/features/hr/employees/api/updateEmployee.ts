import { buildApiUrl, HR_CONFIG } from "@/lib/config";
import type { EmployeeUpdate, Employee } from "@team-aguila/pae-recursos-humanos-client";

export const updateEmployee = async (
  id: number,
  data: EmployeeUpdate
): Promise<Employee> => {
  const url = buildApiUrl(
    HR_CONFIG.endpoints.employees.update.endpoint.replace(
      "{employee_id}",
      encodeURIComponent(id.toString())
    ),
    HR_CONFIG.baseUrl
  );

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Failed to update employee:", errorData);
    throw new Error(
      `Failed to update employee: ${errorData.detail || "Unknown error"}`
    );
  }

  const responseData: Employee = await response.json();
  return responseData;
};
