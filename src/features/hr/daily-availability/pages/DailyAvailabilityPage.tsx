import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { Plus } from "lucide-react";
import { DailyAvailabilitiesDataTable } from "../components/DailyAvailabilitiesDataTable";
import { useDailyAvailabilities } from "../hooks/useDailyAvailabilities";

const DailyAvailabilityPage = () => {
  const today = new Date();
  const startDate = today.toISOString().split("T")[0];
  const endDate = today.toISOString().split("T")[0];
  const { data, isLoading, error } = useDailyAvailabilities(startDate, endDate);

  const handleAddClick = () => {
    console.log("Agregar disponibilidad");
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Disponibilidad Diaria</h1>
          <p className="text-muted-foreground">
            Gestión de la disponibilidad diaria del personal para planificación de turnos y asignación de tareas.
          </p>
        </div>
        <Button onClick={handleAddClick} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Agregar Disponibilidad
        </Button>
      </div>

      <DailyAvailabilitiesDataTable
        data={(data ?? []).map((item: any) => ({
          employeeName: item.employeeName ?? item.employee?.name ?? "",
          date: item.date,
          availabilityStatus: item.availabilityStatus ?? item.status ?? "",
        }))}
      />

      {/* Aquí se puede agregar un formulario para gestionar la disponibilidad */}
    </div>
  );
};

export default DailyAvailabilityPage;
