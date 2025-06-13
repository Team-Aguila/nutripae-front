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
import { deactivateMenuCycle } from "../api/deactivateMenuCycle";
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

  const deactivateCycleMutation = useMutation({
    mutationFn: deactivateMenuCycle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuCycles"] });
      toast.success("Ciclo de menú desactivado exitosamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al desactivar el ciclo de menú");
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

  const handleDeactivateClick = (cycle: MenuCycleResponse) => {
    deactivateCycleMutation.mutate(cycle._id);
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

  if (isLoading) return <div>Cargando ciclos de menú...</div>;
  if (error) return <div>Error al cargar los ciclos de menú</div>;

  return (
    <>
      <SiteHeader
        items={[
          { label: "Inicio", href: "/", isCurrentPage: false },
          { label: "Menús", href: "/menu", isCurrentPage: false },
          { label: "Ciclos de Menú", isCurrentPage: true },
        ]}
      />
      <div className="container mx-auto py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Ciclos de Menú</h2>
            <p className="text-gray-600">Gestiona los ciclos de menú semanales y su planificación</p>
          </div>
          <Button onClick={handleAddClick}>
            <Plus className="mr-2 h-4 w-4" /> Agregar Ciclo
          </Button>
        </div>

        <MenuCyclesDataTable data={menuCycles || []} onEdit={handleEditClick} onDeactivate={handleDeactivateClick} />
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
