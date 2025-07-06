import { useQuery } from "@tanstack/react-query";
import { getOperationalRoles } from "../api/getOperationalRoles";

export const useOperationalRoles = () => {
  return useQuery({
    queryKey: ["hr", "operationalRoles"],
    queryFn: getOperationalRoles,
  });
};
