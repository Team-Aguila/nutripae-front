import { useQuery } from "@tanstack/react-query";
import { getIngredientsDetailed } from "../api/getIngredientsDetailed";
import type { IngredientFilters } from "../../types";

export function useIngredientsDetailed(filters?: IngredientFilters) {
  return useQuery({
    queryKey: ["ingredients", "detailed", filters],
    queryFn: () => getIngredientsDetailed(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
