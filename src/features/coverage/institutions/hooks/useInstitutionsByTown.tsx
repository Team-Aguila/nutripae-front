import { useQuery } from "@tanstack/react-query";
import { getInstitutionsByTown } from "../api/getInstitutionsByTown";

export function useInstitutionsByTown(townId: number) {
  const query = useQuery({
    queryKey: ["institutions", { townId }],
    queryFn: () => getInstitutionsByTown(townId),
    staleTime: 1000 * 60 * 5,
    enabled: !!townId,
  });
  return query;
}
