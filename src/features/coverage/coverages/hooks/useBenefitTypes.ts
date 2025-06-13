import { useQuery } from "@tanstack/react-query";
import { getBenefitTypes } from "../api/getBenefitTypes";

export function useBenefitTypes() {
  const query = useQuery({
    queryKey: ["benefitTypes"],
    queryFn: getBenefitTypes,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
  return query;
}
