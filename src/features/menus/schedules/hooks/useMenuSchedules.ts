import { useQuery } from "@tanstack/react-query";
import { getMenuSchedules } from "../api/getMenuSchedules";
import type { MenuScheduleFilters } from "../../types";

export function useMenuSchedules(filters?: MenuScheduleFilters) {
  return useQuery({
    queryKey: ["menuSchedules", filters],
    queryFn: () => getMenuSchedules(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
