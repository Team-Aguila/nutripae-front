import { useQuery } from "@tanstack/react-query";
import { getInstitution } from "../api/getInstitution";

export function useInstitution(id: number) {
  const query = useQuery({
    queryKey: ["institutions", id],
    queryFn: () => getInstitution(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
  return query;
}
