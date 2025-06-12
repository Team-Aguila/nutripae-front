import type { DepartmentCreate, DepartmentResponseWithDetails } from "@team-aguila/pae-cobertura-client";

export const createDepartment = async (departmentData: DepartmentCreate): Promise<DepartmentResponseWithDetails> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const response = await fetch(`${base_coverage_url}/departments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(departmentData),
  });

  if (!response.ok) {
    throw new Error('Failed to create department');
  }

  const data = await response.json();
  return data;
}; 