/**
 * Ruta para la gestión de empleados
 *
 * Esta ruta integra el componente EmployeesPage que permite:
 * - Listar todos los empleados registrados
 * - Crear nuevos empleados
 * - Editar información de empleados existentes
 * - Eliminar empleados del sistema
 */
import { createFileRoute } from "@tanstack/react-router";
import EmployeesPage from "@/features/hr/employees/pages/EmployeesPage";

// Configuración de la ruta para empleados con TanStack Router
export const Route = createFileRoute("/hr/employees/")({
  component: EmployeesPage,
});
