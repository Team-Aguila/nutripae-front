import { useQuery } from "@tanstack/react-query";
import { getTownsByDepartment } from "../api/getTownsByDepartment";

export function useTownsByDepartment(departmentId: number) {
  const query = useQuery({
    queryKey: ["towns", { departmentId }],
    queryFn: () => getTownsByDepartment(departmentId),
    staleTime: 1000 * 60 * 5,
    enabled: !!departmentId,
  });
  return query;
}
