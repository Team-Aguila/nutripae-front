import { useQuery } from "@tanstack/react-query";
import { getCampusesByInstitution } from "../api/getCampusesByInstitution";

export function useCampusesByInstitution(institutionId: number) {
  const query = useQuery({
    queryKey: ["campuses", { institutionId }],
    queryFn: () => getCampusesByInstitution(institutionId),
    staleTime: 1000 * 60 * 5,
    enabled: !!institutionId,
  });
  return query;
}
