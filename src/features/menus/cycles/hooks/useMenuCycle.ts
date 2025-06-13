import { useQuery } from "@tanstack/react-query";
import { getMenuCycle } from "../api/getMenuCycle";

export const useMenuCycle = (id: string) => {
  return useQuery({
    queryKey: ["menuCycle", id],
    queryFn: () => getMenuCycle(id),
    enabled: !!id,
  });
};
