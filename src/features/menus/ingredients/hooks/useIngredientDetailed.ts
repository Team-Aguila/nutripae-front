import { useQuery } from "@tanstack/react-query";
import { getIngredientDetailed } from "../api/getIngredientDetailed";

export function useIngredientDetailed(id: string) {
  return useQuery({
    queryKey: ["ingredient", "detailed", id],
    queryFn: () => getIngredientDetailed(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id,
  });
}
