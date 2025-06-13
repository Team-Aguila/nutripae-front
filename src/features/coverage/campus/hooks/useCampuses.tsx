import { useQuery } from "@tanstack/react-query";
import { getCampuses } from "../api/getCampuses";

export function useCampuses() {
  const query = useQuery({
    queryKey: ["campuses"],
    queryFn: getCampuses,
    staleTime: 1000 * 60 * 5,
  });
  return query;
}
