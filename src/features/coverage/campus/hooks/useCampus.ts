import { useQuery } from "@tanstack/react-query";
import { getCampus } from "../api/getCampus";

export function useCampus(id: string) {
  const query = useQuery({
    queryKey: ["campus", id],
    queryFn: () => getCampus(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id,
  });
  return query;
}
