import { useQuery } from "@tanstack/react-query";
import { getDishes } from "../api/getDishes";
import type { DishFilters } from "../../types";

export function useDishes(filters?: DishFilters) {
  return useQuery({
    queryKey: ["dishes", filters],
    queryFn: () => getDishes(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
