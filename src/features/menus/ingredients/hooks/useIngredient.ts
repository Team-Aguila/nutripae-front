import { useQuery } from "@tanstack/react-query";
import { getIngredient } from "../api/getIngredient";

export function useIngredient(id: string) {
  return useQuery({
    queryKey: ["ingredient", id],
    queryFn: () => getIngredient(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id,
  });
}
