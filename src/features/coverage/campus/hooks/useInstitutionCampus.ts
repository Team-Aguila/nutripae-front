import { useQuery } from "@tanstack/react-query";
import { getInstitutionCampus } from "../api/getInstitutionCampus";

export function useInstitutionCampus(institutionId: string | undefined) {
  return useQuery({
    queryKey: ["institutions", institutionId, "campus"],
    queryFn: () => getInstitutionCampus(institutionId!),
    enabled: !!institutionId,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: 2,
  });
}
