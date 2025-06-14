import { useQuery } from "@tanstack/react-query";
import { getDish } from "../api/getDish";

export function useDish(id: string) {
  return useQuery({
    queryKey: ["dish", id],
    queryFn: () => getDish(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id,
  });
}
