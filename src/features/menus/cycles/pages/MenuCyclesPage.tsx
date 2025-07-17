import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { MenuCycleCreate, MenuCycleUpdate, MenuCycleResponse } from "@team-aguila/pae-menus-client";
import { useMenuCycles } from "../hooks/useMenuCycles";
import { createMenuCycle } from "../api/createMenuCycle";
import { updateMenuCycle } from "../api/updateMenuCycle";
import { updateMenuCycleStatus } from "../api/updateMenuCycleStatus";
import { MenuCycleForm } from "../components/MenuCycleForm";
import { MenuCyclesDataTable } from "../components/MenuCyclesDataTable";

const MenuCyclesPage = () => {
  const queryClient = useQueryClient();
  const { data: menuCycles, isLoading, error } = useMenuCycles();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCycle, setEditingCycle] = useState<MenuCycleResponse | undefined>(undefined);

  // Mutaciones
  const createCycleMutation = useMutation({
    mutationFn: createMenuCycle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuCycles"] });
      toast.success("Ciclo de menú creado exitosamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear el ciclo de menú");
    },
  });

  const updateCycleMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: MenuCycleUpdate }) => updateMenuCycle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuCycles"] });
      toast.success("Ciclo de menú actualizado exitosamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar el ciclo de menú");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "active" | "inactive" }) => updateMenuCycleStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["menuCycles"] });
      const action = variables.status === "active" ? "activado" : "desactivado";
      toast.success(`Ciclo de menú ${action} exitosamente`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar el estado del ciclo de menú");
    },
  });

  // Handlers
  const handleAddClick = () => {
    setEditingCycle(undefined);
    setIsFormOpen(true);
  };

  const handleEditClick = (cycle: MenuCycleResponse) => {
    setEditingCycle(cycle);
    setIsFormOpen(true);
  };

  const handleToggleStatusClick = (cycle: MenuCycleResponse, newStatus: "active" | "inactive") => {
    updateStatusMutation.mutate({ id: cycle._id, status: newStatus });
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingCycle(undefined);
  };

  const handleFormSubmit = (data: MenuCycleCreate | MenuCycleUpdate) => {
    setIsFormOpen(false);
    if (editingCycle) {
      updateCycleMutation.mutate({
        id: editingCycle._id,
        data: data as MenuCycleUpdate,
      });
    } else {
      createCycleMutation.mutate(data as MenuCycleCreate);
    }
  };

  if (isLoading) return <div id="menu-cycles-loading">Cargando ciclos de menú...</div>;
  if (error) return <div id="menu-cycles-error">Error al cargar los ciclos de menú</div>;

  return (
    <>
      <SiteHeader
        items={[
          { label: "Inicio", href: "/", isCurrentPage: false },
          { label: "Menús", href: "/menu", isCurrentPage: false },
          { label: "Ciclos de Menú", isCurrentPage: true },
        ]}
      />
      <div className="container mx-auto px-4 py-6" id="menu-cycles-page">
        <div className="flex items-center justify-between mb-4" id="menu-cycles-header">
          <div id="menu-cycles-title-section">
            <h2 className="text-2xl font-bold mb-2" id="menu-cycles-title">
              Ciclos de Menú
            </h2>
            <p className="text-gray-600" id="menu-cycles-description">
              Gestiona los ciclos de menú semanales y su planificación
            </p>
          </div>
          <Button onClick={handleAddClick} id="add-menu-cycle-btn">
            <Plus className="mr-2 h-4 w-4" /> Agregar Ciclo
          </Button>
        </div>

        <MenuCyclesDataTable
          data={menuCycles || []}
          onEdit={handleEditClick}
          onToggleStatus={handleToggleStatusClick}
        />
      </div>

      <MenuCycleForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initialData={editingCycle}
      />
    </>
  );
};

export default MenuCyclesPage;
