import { useQuery } from "@tanstack/react-query";
import { getIngredientCategories } from "../api/getIngredientCategories";

export function useIngredientCategories() {
  return useQuery({
    queryKey: ["ingredients", "categories"],
    queryFn: getIngredientCategories,
    staleTime: 1000 * 60 * 60, // 1 hour - categories don't change often
  });
}
