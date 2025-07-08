import { useQuery } from "@tanstack/react-query";
// Update the import path below if the file is located elsewhere, for example:
import { getGenders } from "../api/getGenders";
// Or correct the path as needed to match the actual file location.

export const useGenders = () => {
  return useQuery({
    queryKey: ["hr", "genders"],
    queryFn: getGenders,
  });
};
