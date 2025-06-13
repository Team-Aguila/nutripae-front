import { useQuery } from "@tanstack/react-query";
import { getCoveragesByCampus } from "../api/getCoveragesByCampus";

export function useCoveragesByCampus(campusId: string) {
  const query = useQuery({
    queryKey: ["coverages", "campus", campusId],
    queryFn: () => getCoveragesByCampus(campusId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!campusId,
  });
  return query;
}
