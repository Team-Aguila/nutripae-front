import { useQuery } from "@tanstack/react-query";
import { getGenders } from "../api/catalogs/getGenders";

export function useGenders() {
  const query = useQuery({
    queryKey: ["genders"],
    queryFn: getGenders,
    staleTime: Infinity,
  });
  return query;
}
