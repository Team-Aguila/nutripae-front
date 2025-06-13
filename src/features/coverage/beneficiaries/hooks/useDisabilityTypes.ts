import { useQuery } from "@tanstack/react-query";
import { getDisabilityTypes } from "../api/catalogs/getDisabilityTypes";

export function useDisabilityTypes() {
  const query = useQuery({
    queryKey: ["disability-types"],
    queryFn: getDisabilityTypes,
    staleTime: Infinity,
  });
  return query;
}
