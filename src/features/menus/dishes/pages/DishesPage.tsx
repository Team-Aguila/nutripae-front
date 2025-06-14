import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { SiteHeader } from "@/components/site-header";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { DishCreate, DishUpdate, DishResponse } from "@team-aguila/pae-menus-client";
import { useDishes } from "../hooks/useDishes";
import { createDish } from "../api/createDish";
import { updateDish } from "../api/updateDish";
import { deleteDish } from "../api/deleteDish";
import { DishForm } from "../components/DishForm";
import { DishesDataTable } from "../components/DishesDataTable";
import { DishDetailsModal } from "../components/DishDetailsModal";

const DishesPage = () => {
  const queryClient = useQueryClient();
  const { data: dishes, isLoading, error } = useDishes();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<DishResponse | undefined>(undefined);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingDish, setDeletingDish] = useState<DishResponse | undefined>(undefined);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<DishResponse | null>(null);

  // Mutaciones
  const createDishMutation = useMutation({
    mutationFn: createDish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dishes"] });
      queryClient.invalidateQueries({ queryKey: ["ingredients"] }); // Refresh ingredients for usage stats
      toast.success("Plato creado exitosamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear el plato");
    },
  });

  const updateDishMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: DishUpdate }) => updateDish(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dishes"] });
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      toast.success("Plato actualizado exitosamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar el plato");
    },
  });

  const deleteDishMutation = useMutation({
    mutationFn: deleteDish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dishes"] });
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      toast.success("Plato eliminado exitosamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar el plato");
    },
  });

  // Handlers
  const handleAddClick = () => {
    setEditingDish(undefined);
    setIsFormOpen(true);
  };

  const handleEditClick = (dish: DishResponse) => {
    setEditingDish(dish);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (dish: DishResponse) => {
    setDeletingDish(dish);
    setIsConfirmOpen(true);
  };

  const handleViewDetailsClick = (dish: DishResponse) => {
    setSelectedDish(dish);
    setIsDetailsOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingDish) {
      deleteDishMutation.mutate(deletingDish._id);
      setIsConfirmOpen(false);
      setDeletingDish(undefined);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingDish(undefined);
  };

  const handleFormSubmit = (data: DishCreate | DishUpdate) => {
    setIsFormOpen(false);
    if (editingDish) {
      updateDishMutation.mutate({
        id: editingDish._id,
        data: data as DishUpdate,
      });
    } else {
      createDishMutation.mutate(data as DishCreate);
    }
  };

  if (isLoading) return <div>Cargando platos...</div>;
  if (error) return <div>Error al cargar los platos</div>;

  return (
    <>
      <SiteHeader
        items={[
          { label: "Inicio", href: "/", isCurrentPage: false },
          { label: "Menús", href: "/menu", isCurrentPage: false },
          { label: "Platos", isCurrentPage: true },
        ]}
      />
      <div className="container mx-auto py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Platos</h2>
            <p className="text-gray-600">Gestiona las recetas y platos disponibles para los menús</p>
          </div>
          <Button onClick={handleAddClick}>
            <Plus className="mr-2 h-4 w-4" /> Agregar Plato
          </Button>
        </div>

        <DishesDataTable 
          data={dishes || []} 
          onEdit={handleEditClick} 
          onDelete={handleDeleteClick} 
          onViewDetails={handleViewDetailsClick}
        />
      </div>

      <DishForm isOpen={isFormOpen} onClose={handleFormClose} onSubmit={handleFormSubmit} initialData={editingDish} />

      <DishDetailsModal 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
        dish={selectedDish} 
      />

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="¿Estás seguro?"
        description={`Esta acción desactivará permanentemente el plato "${deletingDish?.name}". El plato no estará disponible para nuevos menús.`}
      />
    </>
  );
};

export default DishesPage;
