import { useQuery } from "@tanstack/react-query";
import { getDepartments } from "../api/departments";
import type { DepartmentCreate } from "@team-aguila/pae-cobertura-client";

export function useDepartments() {
  const query = useQuery<Array<DepartmentCreate>>({
    queryKey: ["departments"],
    queryFn: getDepartments,
    staleTime: 1000 * 60 * 5,
  });
  return query;
}
