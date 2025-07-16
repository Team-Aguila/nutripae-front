import { useQuery } from "@tanstack/react-query";
import { getTownInstitutions } from "../api/getTownInstitutions";

export function useTownInstitutions(townId: string | undefined) {
  return useQuery({
    queryKey: ["towns", townId, "institutions"],
    queryFn: () => getTownInstitutions(townId!),
    enabled: !!townId,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: 2,
  });
}
