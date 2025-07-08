import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "../api/getEmployees";

export const useEmployees = () => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });
};
