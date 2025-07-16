import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { SiteHeader } from "@/components/site-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, BarChart3, List } from "lucide-react";
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
import { IngredientsStatistics } from "../components/IngredientsStatistics";

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
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear el ingrediente");
    },
  });

  const updateIngredientMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: IngredientUpdate }) => updateIngredient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      toast.success("Ingrediente actualizado exitosamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar el ingrediente");
    },
  });

  const deleteIngredientMutation = useMutation({
    mutationFn: deleteIngredient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      toast.success("Ingrediente eliminado exitosamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar el ingrediente");
    },
  });

  const activateIngredientMutation = useMutation({
    mutationFn: activateIngredient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      toast.success("Ingrediente activado exitosamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al activar el ingrediente");
    },
  });

  const inactivateIngredientMutation = useMutation({
    mutationFn: inactivateIngredient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      toast.success("Ingrediente desactivado exitosamente");
    },
    onError: (error: Error) => {
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

  if (isLoading) return <div id="ingredients-loading">Cargando ingredientes...</div>;
  if (error) return <div id="ingredients-error">Error al cargar los ingredientes</div>;

  return (
    <>
      <SiteHeader
        items={[
          { label: "Inicio", href: "/", isCurrentPage: false },
          { label: "Menús", href: "/menu", isCurrentPage: false },
          { label: "Ingredientes", isCurrentPage: true },
        ]}
      />
      <div className="container mx-auto px-4 py-6" id="ingredients-page">
        <div className="flex items-center justify-between mb-6" id="ingredients-header">
          <div id="ingredients-title-section">
            <h2 className="text-2xl font-bold mb-2" id="ingredients-title">Ingredientes</h2>
            <p className="text-gray-600" id="ingredients-description">Gestiona los ingredientes disponibles para crear platos y menús</p>
          </div>
          <Button onClick={handleAddClick} id="add-ingredient-btn">
            <Plus className="mr-2 h-4 w-4" /> Agregar Ingrediente
          </Button>
        </div>

        <Tabs defaultValue="list" className="space-y-4" id="ingredients-tabs">
          <TabsList id="ingredients-tabs-list">
            <TabsTrigger value="list" className="flex items-center gap-2" id="ingredients-list-tab">
              <List className="h-4 w-4" />
              Lista de Ingredientes
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-2" id="ingredients-statistics-tab">
              <BarChart3 className="h-4 w-4" />
              Estadísticas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4" id="ingredients-list-content">
            <IngredientsDataTable
              data={ingredients || []}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onToggleStatus={handleToggleStatus}
            />
          </TabsContent>

          <TabsContent value="statistics" className="space-y-4" id="ingredients-statistics-content">
            <IngredientsStatistics />
          </TabsContent>
        </Tabs>
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
