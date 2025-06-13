import { useQuery } from "@tanstack/react-query";
import { getDepartment } from "../api/getDepartment";

export function useDepartment(departmentId: number) {
  const query = useQuery({
    queryKey: ["department", departmentId],
    queryFn: () => getDepartment(departmentId),
    staleTime: 1000 * 60 * 5,
    enabled: !!departmentId,
  });
  return query;
}
