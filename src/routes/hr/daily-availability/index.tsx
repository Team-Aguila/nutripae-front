/**
 * Ruta para la gestión de disponibilidades diarias
 *
 * Esta ruta integra el componente DailyAvailabilityPage que permite:
 * - Listar todas las disponibilidades diarias registradas
 * - Crear nuevas disponibilidades diarias
 * - Editar información de disponibilidades existentes
 * - Eliminar disponibilidades del sistema
 */
import { createFileRoute } from "@tanstack/react-router";
import DailyAvailabilityPage from "@/features/hr/daily-availability/pages/DailyAvailabilityPage";

// Configuración de la ruta para disponibilidades diarias con TanStack Router
export const Route = createFileRoute("/hr/daily-availability/")({
  component: DailyAvailabilityPage,
});
