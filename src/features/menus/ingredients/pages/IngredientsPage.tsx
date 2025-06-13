import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { SiteHeader } from "@/components/site-header";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { IngredientCreate, IngredientUpdate, IngredientResponse } from "@team-aguila/pae-menus-client";
import { useIngredients } from "../hooks/useIngredients";
import { createIngredient } from "../api/createIngredient";
import { updateIngredient } from "../api/updateIngredient";
import { deleteIngredient } from "../api/deleteIngredient";
import { activateIngredient } from "../api/activateIngredient";
import { inactivateIngredient } from "../api/inactivateIngredient";
import { IngredientForm } from "../components/IngredientForm";
import { IngredientsDataTable } from "../components/IngredientsDataTable";

const IngredientsPage = () => {
  const queryClient = useQueryClient();
  const { data: ingredients, isLoading, error } = useIngredients();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<IngredientResponse | undefined>(undefined);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingIngredient, setDeletingIngredient] = useState<IngredientResponse | undefined>(undefined);

  // Mutaciones
  const createIngredientMutation = useMutation({
    mutationFn: createIngredient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      toast.success("Ingrediente creado exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al crear el ingrediente");
    },
  });

  const updateIngredientMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: IngredientUpdate }) => updateIngredient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      toast.success("Ingrediente actualizado exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al actualizar el ingrediente");
    },
  });

  const deleteIngredientMutation = useMutation({
    mutationFn: deleteIngredient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      toast.success("Ingrediente eliminado exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al eliminar el ingrediente");
    },
  });

  const activateIngredientMutation = useMutation({
    mutationFn: activateIngredient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      toast.success("Ingrediente activado exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al activar el ingrediente");
    },
  });

  const inactivateIngredientMutation = useMutation({
    mutationFn: inactivateIngredient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      toast.success("Ingrediente desactivado exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al desactivar el ingrediente");
    },
  });

  // Handlers
  const handleAddClick = () => {
    setEditingIngredient(undefined);
    setIsFormOpen(true);
  };

  const handleEditClick = (ingredient: IngredientResponse) => {
    setEditingIngredient(ingredient);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (ingredient: IngredientResponse) => {
    setDeletingIngredient(ingredient);
    setIsConfirmOpen(true);
  };

  const handleToggleStatus = (ingredient: IngredientResponse) => {
    if (ingredient.status === "active") {
      inactivateIngredientMutation.mutate(ingredient._id);
    } else {
      activateIngredientMutation.mutate(ingredient._id);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingIngredient) {
      deleteIngredientMutation.mutate(deletingIngredient._id);
      setIsConfirmOpen(false);
      setDeletingIngredient(undefined);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingIngredient(undefined);
  };

  const handleFormSubmit = (data: IngredientCreate | IngredientUpdate) => {
    setIsFormOpen(false);
    if (editingIngredient) {
      updateIngredientMutation.mutate({
        id: editingIngredient._id,
        data: data as IngredientUpdate,
      });
    } else {
      createIngredientMutation.mutate(data as IngredientCreate);
    }
  };

  if (isLoading) return <div>Cargando ingredientes...</div>;
  if (error) return <div>Error al cargar los ingredientes</div>;

  return (
    <>
      <SiteHeader
        items={[
          { label: "Inicio", href: "/", isCurrentPage: false },
          { label: "Menús", href: "/menu", isCurrentPage: false },
          { label: "Ingredientes", isCurrentPage: true },
        ]}
      />
      <div className="container mx-auto py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Ingredientes</h2>
            <p className="text-gray-600">Gestiona los ingredientes disponibles para crear platos y menús</p>
          </div>
          <Button onClick={handleAddClick}>
            <Plus className="mr-2 h-4 w-4" /> Agregar Ingrediente
          </Button>
        </div>

        <IngredientsDataTable
          data={ingredients || []}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onToggleStatus={handleToggleStatus}
        />
      </div>

      <IngredientForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initialData={editingIngredient}
      />

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="¿Estás seguro?"
        description={`Esta acción eliminará permanentemente el ingrediente "${deletingIngredient?.name}". Esta acción no se puede deshacer.`}
      />
    </>
  );
};

export default IngredientsPage;
