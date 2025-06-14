import { useQuery } from "@tanstack/react-query";
import { getIngredients } from "../api/getIngredients";
import type { IngredientFilters } from "../../types";

export function useIngredients(filters?: IngredientFilters) {
  return useQuery({
    queryKey: ["ingredients", filters],
    queryFn: () => getIngredients(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
