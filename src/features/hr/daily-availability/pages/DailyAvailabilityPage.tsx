import { SiteHeader } from "@/components/site-header";
import { DailyAvailabilitiesDataTable } from "../components/DailyAvailabilitiesDataTable";
import { useEnrichedDailyAvailabilities } from "../hooks/useEnrichedDailyAvailabilities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { EnrichedDailyAvailabilityDetails } from "../hooks/useEnrichedDailyAvailabilities";

const DailyAvailabilityPage = () => {
  const queryClient = useQueryClient();
  const today = new Date();
  const startDate = today.toISOString().split("T")[0];
  const endDate = today.toISOString().split("T")[0];
  const { data, isLoading, error } = useEnrichedDailyAvailabilities(startDate, endDate);

  // Simulamos mutaciones hasta que tengamos las APIs reales
  const updateAvailabilityMutation = useMutation({
    mutationFn: async (availability: EnrichedDailyAvailabilityDetails) => {
      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Actualizando disponibilidad:", availability);
      return availability;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr", "dailyAvailabilities"] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      // No mostramos toast aquí porque ya se muestra en la tabla
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar la disponibilidad");
    },
  });

  const deleteAvailabilityMutation = useMutation({
    mutationFn: async (availabilityId: number) => {
      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Eliminando disponibilidad ID:", availabilityId);
      return availabilityId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr", "dailyAvailabilities"] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      // No mostramos toast aquí porque ya se muestra en la tabla
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar la disponibilidad");
    },
  });

  const handleEdit = (availability: EnrichedDailyAvailabilityDetails) => {
    updateAvailabilityMutation.mutate(availability);
  };

  const handleDelete = (availabilityId: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta disponibilidad?")) {
      deleteAvailabilityMutation.mutate(availabilityId);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <SiteHeader
          items={[
            { label: "Recursos Humanos", href: "/hr" },
            { label: "Disponibilidad Diaria", isCurrentPage: true },
          ]}
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-lg font-semibold">Cargando...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <SiteHeader
          items={[
            { label: "Recursos Humanos", href: "/hr" },
            { label: "Disponibilidad Diaria", isCurrentPage: true },
          ]}
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-red-600">Error al cargar disponibilidades diarias</h2>
            <p className="text-muted-foreground">{error instanceof Error ? error.message : "Error desconocido"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <SiteHeader
        items={[
          { label: "Recursos Humanos", href: "/hr" },
          { label: "Disponibilidad Diaria", isCurrentPage: true },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Disponibilidad Diaria</h1>
        <p className="text-muted-foreground">
          Gestión de la disponibilidad diaria del personal para planificación de turnos y asignación de tareas.
        </p>
      </div>

      <DailyAvailabilitiesDataTable data={data ?? []} onEdit={handleEdit} onDelete={handleDelete} />

      {/* Aquí se puede agregar un formulario para gestionar la disponibilidad */}
    </div>
  );
};

export default DailyAvailabilityPage;
