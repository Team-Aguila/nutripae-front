import { useQuery } from "@tanstack/react-query";
import { getTown } from "../api/getTown";

export function useTown(townId: number) {
  const query = useQuery({
    queryKey: ["town", townId],
    queryFn: () => getTown(townId),
    staleTime: 1000 * 60 * 5,
    enabled: !!townId,
  });
  return query;
}
