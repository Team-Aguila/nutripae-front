import { buildApiUrl, HR_CONFIG } from "@/lib/config";

export const deleteEmployee = async (id: number): Promise<void> => {
  const url = buildApiUrl(
    HR_CONFIG.endpoints.employees.delete.endpoint.replace("{employee_id}", id.toString()),
    HR_CONFIG.baseUrl
  );
  const response = await fetch(url, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Failed to delete employee:", errorData);
    throw new Error("Failed to delete employee");
  }
};
