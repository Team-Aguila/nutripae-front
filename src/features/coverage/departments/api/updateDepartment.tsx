import type { DepartmentUpdate, DepartmentResponseWithDetails } from "@team-aguila/pae-cobertura-client";

interface UpdateDepartmentParams {
  id: number;
  data: DepartmentUpdate;
}

export const updateDepartment = async ({
  id,
  data,
}: UpdateDepartmentParams): Promise<DepartmentResponseWithDetails> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const response = await fetch(`${base_coverage_url}/departments/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update department");
  }

  const responseData = await response.json();
  return responseData;
};
