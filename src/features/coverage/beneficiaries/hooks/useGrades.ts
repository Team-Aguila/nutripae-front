import { useQuery } from "@tanstack/react-query";
import { getGrades } from "../api/catalogs/getGrades";

export function useGrades() {
  const query = useQuery({
    queryKey: ["grades"],
    queryFn: getGrades,
    staleTime: Infinity,
  });
  return query;
}
