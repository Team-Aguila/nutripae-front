import { useQuery } from "@tanstack/react-query";
import { getEtnicGroups } from "../api/catalogs/getEtnicGroups";

export function useEtnicGroups() {
  const query = useQuery({
    queryKey: ["etnic-groups"],
    queryFn: getEtnicGroups,
    staleTime: Infinity,
  });
  return query;
}
