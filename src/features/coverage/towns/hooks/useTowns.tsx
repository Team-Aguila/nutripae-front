import { useQuery } from "@tanstack/react-query";
import { getTowns } from "../api/getTowns";

export function useTowns() {
  const query = useQuery({
    queryKey: ["towns"],
    queryFn: getTowns,
    staleTime: 1000 * 60 * 5,
  });
  return query;
}
