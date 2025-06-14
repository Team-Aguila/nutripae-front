import { useQuery } from "@tanstack/react-query";
import { validateIngredientNameUniqueness } from "../api/validateIngredientNameUniqueness";

export function useValidateIngredientName(name: string, excludeId?: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ["ingredients", "validate-name", name, excludeId],
    queryFn: () => validateIngredientNameUniqueness(name, excludeId),
    staleTime: 1000 * 30, // 30 seconds
    enabled: enabled && name.length > 0,
  });
}
