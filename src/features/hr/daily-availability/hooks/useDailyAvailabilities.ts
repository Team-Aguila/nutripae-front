// Ajuste para que siga la estructura utilizada en los hooks de Employees.
import { useQuery } from "@tanstack/react-query";
import { getDailyAvailabilities } from "../api/getDailyAvailabilities";

export const useDailyAvailabilities = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ["hr", "dailyAvailabilities", startDate, endDate],
    queryFn: () => getDailyAvailabilities(startDate, endDate),
  });
};