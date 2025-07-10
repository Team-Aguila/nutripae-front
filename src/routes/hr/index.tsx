/**
 * Ruta principal del módulo de Recursos Humanos
 *
 * Esta ruta define el punto de entrada principal para el módulo de HR.
 */
import { createFileRoute } from "@tanstack/react-router";

/**
 * Componente de la página principal de Recursos Humanos
 *
 * Muestra un dashboard con opciones para navegar a:
 * - Gestión de empleados
 * - Disponibilidad diaria del personal
 */
function RouteComponent() {
  return <div>Hello "/hr/"!</div>;
}

// Configuración de la ruta con TanStack Router
export const Route = createFileRoute("/hr/")({
  component: RouteComponent,
});
