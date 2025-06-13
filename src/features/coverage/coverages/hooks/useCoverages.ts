import { useQuery } from "@tanstack/react-query";
import { getCoverages } from "../api/getCoverages";

export function useCoverages() {
  const query = useQuery({
    queryKey: ["coverages"],
    queryFn: getCoverages,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  return query;
}
