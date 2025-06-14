import { useQuery } from "@tanstack/react-query";
import { getIngredientsStatistics } from "../api/getIngredientsStatistics";

export function useIngredientsStatistics() {
  return useQuery({
    queryKey: ["ingredients", "statistics"],
    queryFn: getIngredientsStatistics,
    staleTime: 1000 * 60 * 10, // 10 minutes - statistics don't change frequently
  });
}
