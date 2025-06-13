import { useQuery } from "@tanstack/react-query";
import { getInstitutions } from "../api/getInstitutions";

export function useInstitutions() {
  const query = useQuery({
    queryKey: ["institutions"],
    queryFn: getInstitutions,
    staleTime: 1000 * 60 * 5,
  });
  return query;
}
