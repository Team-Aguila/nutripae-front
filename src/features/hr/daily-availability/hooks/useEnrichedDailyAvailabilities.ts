import { useQuery } from "@tanstack/react-query";
import { useDailyAvailabilities } from "./useDailyAvailabilities";
import { getEmployees } from "../api/getEmployees";
import type { DailyAvailabilityDetails, Employee } from "../../types";

// Tipo mejorado que incluye información completa del empleado
export interface EnrichedDailyAvailabilityDetails extends Omit<DailyAvailabilityDetails, "employee"> {
  employee: Employee;
}

export const useEnrichedDailyAvailabilities = (startDate: string, endDate: string, employeeId?: number) => {
  // Primero obtenemos las disponibilidades básicas
  const { data: basicData, isLoading: basicLoading, error } = useDailyAvailabilities(startDate, endDate, employeeId);

  // Obtenemos los IDs únicos de empleados
  const employeeIds = basicData ? [...new Set(basicData.map((item) => item.employee_id))] : [];

  // Obtenemos la información completa de cada empleado
  const employeeQueries = useQuery({
    queryKey: ["employees", employeeIds],
    queryFn: async (): Promise<Record<number, Employee>> => {
      if (employeeIds.length === 0) return {};

      // Obtener todos los empleados activos
      const employees = await getEmployees(undefined, undefined, true);

      // Crear un objeto para búsqueda rápida
      const employeeRecord: Record<number, Employee> = {};
      employees.forEach((emp) => {
        employeeRecord[emp.id] = emp;
      });

      return employeeRecord;
    },
    enabled: employeeIds.length > 0,
  });

  // Combinar los datos
  const enrichedData: EnrichedDailyAvailabilityDetails[] | undefined =
    basicData && employeeQueries.data
      ? basicData.map((availability) => {
        const fullEmployee = employeeQueries.data![availability.employee_id];
        return {
          ...availability,
          employee: fullEmployee || {
            id: availability.employee_id,
            full_name: availability.employee.full_name,
            document_number: availability.employee.document_number || "",
            operational_role: availability.employee.operational_role,
            // Valores por defecto para campos requeridos
            birth_date: "",
            hire_date: "",
            document_type_id: 1,
            gender_id: 1,
            operational_role_id: availability.employee.operational_role.id,
            is_active: true,
            created_at: "",
            updated_at: "",
            document_type: { id: 1, name: "Desconocido" },
            gender: { id: 1, name: "Desconocido" },
          },
        };
      })
      : undefined;

  return {
    data: enrichedData,
    isLoading: basicLoading || employeeQueries.isLoading,
    error: error || employeeQueries.error,
  };
};
