import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { MenuScheduleResponse } from "../api/getMenuSchedules";
import { useMenuSchedules } from "../hooks/useMenuSchedules";
import { cancelMenuSchedule } from "../api/cancelMenuSchedule";
import { deleteMenuSchedule } from "../api/deleteMenuSchedule";
import { assignMenuCycle, type MenuScheduleAssignmentRequest } from "../api/assignMenuCycle";
import { updateMenuSchedule, type MenuScheduleUpdateRequest } from "../api/updateMenuSchedule";
import { MenuSchedulesDataTable } from "../components/MenuSchedulesDataTable";
import { MenuScheduleForm } from "../components/MenuScheduleForm";

const MenuSchedulesPage = () => {
  const queryClient = useQueryClient();
  const { data: menuSchedules, isLoading, error } = useMenuSchedules();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<MenuScheduleResponse | undefined>(undefined);

  // Mutaciones
  const assignScheduleMutation = useMutation({
    mutationFn: assignMenuCycle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuSchedules"] });
      toast.success("Ciclo de menú asignado exitosamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al asignar el ciclo de menú");
    },
  });

  const updateScheduleMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: MenuScheduleUpdateRequest }) => updateMenuSchedule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuSchedules"] });
      toast.success("Horario de menú actualizado exitosamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar el horario de menú");
    },
  });

  const cancelScheduleMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => cancelMenuSchedule(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuSchedules"] });
      toast.success("Horario de menú cancelado exitosamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al cancelar el horario de menú");
    },
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: deleteMenuSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuSchedules"] });
      toast.success("Horario de menú eliminado exitosamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar el horario de menú");
    },
  });

  // Handlers
  const handleAddClick = () => {
    setEditingSchedule(undefined);
    setIsFormOpen(true);
  };

  const handleEditClick = (schedule: MenuScheduleResponse) => {
    setEditingSchedule(schedule);
    setIsFormOpen(true);
  };

  const handleCancelClick = (schedule: MenuScheduleResponse) => {
    const reason = prompt("Razón para cancelar el horario (opcional):");
    if (reason !== null) {
      cancelScheduleMutation.mutate({ id: schedule._id, reason: reason || undefined });
    }
  };

  const handleDeleteClick = (schedule: MenuScheduleResponse) => {
    if (confirm("¿Estás seguro de que quieres eliminar este horario de menú?")) {
      deleteScheduleMutation.mutate(schedule._id);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingSchedule(undefined);
  }; const handleFormSubmit = (data: MenuScheduleAssignmentRequest) => {
    if (editingSchedule) {
      // Actualizar horario existente
      const updateData: MenuScheduleUpdateRequest = {
        start_date: data.start_date,
        end_date: data.end_date,
        campus_ids: data.campus_ids,
        town_ids: data.town_ids,
      };
      updateScheduleMutation.mutate({ id: editingSchedule._id, data: updateData });
    } else {
      // Crear nueva asignación
      assignScheduleMutation.mutate(data);
    }
    setIsFormOpen(false);
  };

  if (isLoading) return <div>Cargando horarios de menú...</div>;
  if (error) return <div>Error al cargar los horarios de menú</div>;

  return (
    <>
      <SiteHeader
        items={[
          { label: "Inicio", href: "/", isCurrentPage: false },
          { label: "Menús", href: "/menu", isCurrentPage: false },
          { label: "Horarios de Menú", isCurrentPage: true },
        ]}
      />
      <div id="menu-schedules-page" className="container mx-auto px-4 py-6">
        <div id="menu-schedules-header" className="flex items-center justify-between mb-4">
          <div>
            <h2 id="menu-schedules-title" className="text-2xl font-bold mb-2"> Horarios de Menú</h2>
            <p id="menu-schedules-description" className="text-gray-600">Gestiona la asignación de ciclos de menú a ubicaciones y fechas</p>
          </div>
          <Button id="add-menu-schedule-button" onClick={handleAddClick}>
            <Plus className="mr-2 h-4 w-4" /> Asignar Ciclo
          </Button>
        </div>

        <MenuSchedulesDataTable
          data={menuSchedules || []}
          onEdit={handleEditClick}
          onCancel={handleCancelClick}
          onDelete={handleDeleteClick}
        />
      </div>

      {/* Formulario para asignar/editar horarios */}
      <MenuScheduleForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initialData={editingSchedule}
        isLoading={assignScheduleMutation.isPending || updateScheduleMutation.isPending}
      />
    </>
  );
};

export default MenuSchedulesPage;
