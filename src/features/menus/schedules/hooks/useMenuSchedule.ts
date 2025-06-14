import { useQuery } from "@tanstack/react-query";
import { getMenuSchedule } from "../api/getMenuSchedule";

export function useMenuSchedule(id: string) {
  return useQuery({
    queryKey: ["menuSchedule", id],
    queryFn: () => getMenuSchedule(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id,
  });
}
