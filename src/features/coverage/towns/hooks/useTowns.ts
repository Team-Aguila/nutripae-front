import { useQuery } from "@tanstack/react-query";
import { getTowns } from "../api/getTowns";

export const useTowns = () => {
  return useQuery({
    queryKey: ["towns"],
    queryFn: getTowns,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
