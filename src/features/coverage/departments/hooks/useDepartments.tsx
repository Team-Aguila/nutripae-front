import { useQuery } from "@tanstack/react-query";
import { getDepartments } from "../api/departments";
import type { DepartmentResponseWithDetails } from "@team-aguila/pae-cobertura-client";

export function useDepartments() {
  const query = useQuery<Array<DepartmentResponseWithDetails>>({
    queryKey: ["departments"],
    queryFn: getDepartments,
    staleTime: 1000 * 60 * 5,
  });
  return query;
}
