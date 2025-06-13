import { useQuery } from "@tanstack/react-query";
import { getMenuCycles } from "../api/getMenuCycles";

export const useMenuCycles = () => {
  return useQuery({
    queryKey: ["menuCycles"],
    queryFn: getMenuCycles,
  });
};
