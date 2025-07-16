import { useQuery } from "@tanstack/react-query";
import { getDepartmentTowns } from "../api/getDepartmentTowns";

export function useDepartmentTowns(departmentId: string | undefined) {
  return useQuery({
    queryKey: ["departments", departmentId, "towns"],
    queryFn: () => getDepartmentTowns(departmentId!),
    enabled: !!departmentId,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: 2,
  });
}
