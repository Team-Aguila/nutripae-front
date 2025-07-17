// Ajuste para que siga la estructura utilizada en los hooks de Employees.
import { useQuery } from "@tanstack/react-query";
import { getDetailedAvailabilities } from "../api/getDetailedAvailabilities";

export const useDailyAvailabilities = (startDate: string, endDate: string, employeeId?: number) => {
  // Validar que las fechas estén en orden correcto
  const isValidDateRange = startDate <= endDate;

  return useQuery({
    queryKey: ["hr", "dailyAvailabilities", startDate, endDate, employeeId],
    queryFn: () => getDetailedAvailabilities(startDate, endDate, employeeId),
    enabled: isValidDateRange, // Solo ejecutar la query si las fechas son válidas
  });
};
