import { useQuery } from "@tanstack/react-query";
import { getCampuses } from "../api/getCampuses";

export const useCampuses = () => {
  return useQuery({
    queryKey: ["campuses"],
    queryFn: getCampuses,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
