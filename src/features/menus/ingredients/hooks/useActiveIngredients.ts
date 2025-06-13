import { useQuery } from "@tanstack/react-query";
import { getActiveIngredients } from "../api/getActiveIngredients";

export function useActiveIngredients(filters?: {
  skip?: number;
  limit?: number;
  category?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ["ingredients", "active", filters],
    queryFn: () => getActiveIngredients(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
