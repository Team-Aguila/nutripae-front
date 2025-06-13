import { useQuery } from "@tanstack/react-query";
import { getBeneficiaries } from "../api/getBeneficiaries";

export function useBeneficiaries() {
  const query = useQuery({
    queryKey: ["beneficiaries"],
    queryFn: getBeneficiaries,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  return query;
}
