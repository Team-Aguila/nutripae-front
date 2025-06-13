import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { SiteHeader } from "@/components/site-header";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { InstitutionForm } from "../components/InstitutionForm";
import { createInstitution } from "../api/createInstitution";
import { updateInstitution } from "../api/updateInstitution";
import { deleteInstitution } from "../api/deleteInstitution";
import { useInstitutionsByTown } from "../hooks/useInstitutionsByTown";
import { useTown } from "../hooks/useTown";
import type {
  InstitutionCreate,
  InstitutionResponseWithDetails,
  InstitutionUpdate,
} from "@team-aguila/pae-cobertura-client";
import { useParams } from "@tanstack/react-router";

const TownInstitutionsPage = () => {
  const params = useParams({ from: "/coverage/towns/$townId/institutions" });
  const townId = parseInt(params.townId, 10);

  const queryClient = useQueryClient();

  const { data: town, isLoading: isLoadingTown } = useTown(townId);
  const { data: institutions, isLoading: isLoadingInstitutions, error } = useInstitutionsByTown(townId);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInstitution, setEditingInstitution] = useState<InstitutionResponseWithDetails | undefined>(undefined);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingInstitutionId, setDeletingInstitutionId] = useState<number | undefined>(undefined);

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institutions", { townId }] });
    },
  };

  const createInstitutionMutation = useMutation({
    ...mutationOptions,
    mutationFn: createInstitution,
    onSuccess: () => {
      mutationOptions.onSuccess();
      toast.success("Institución creada exitosamente");
    },
    onError: () => toast.error("Error al crear la institución"),
  });

  const updateInstitutionMutation = useMutation({
    ...mutationOptions,
    mutationFn: updateInstitution,
    onSuccess: () => {
      mutationOptions.onSuccess();
      toast.success("Institución actualizada exitosamente");
    },
    onError: () => toast.error("Error al actualizar la institución"),
  });

  const deleteInstitutionMutation = useMutation({
    ...mutationOptions,
    mutationFn: deleteInstitution,
    onSuccess: () => {
      mutationOptions.onSuccess();
      toast.success("Institución eliminada exitosamente");
    },
    onError: () => toast.error("Error al eliminar la institución"),
  });

  const handleAddClick = () => {
    setEditingInstitution(undefined);
    setIsFormOpen(true);
  };

  const handleEditClick = (institution: InstitutionResponseWithDetails) => {
    setEditingInstitution(institution);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingInstitutionId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingInstitutionId) {
      deleteInstitutionMutation.mutate(deletingInstitutionId);
      setIsConfirmOpen(false);
      setDeletingInstitutionId(undefined);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingInstitution(undefined);
  };

  const handleFormSubmit = (data: InstitutionCreate | InstitutionUpdate) => {
    setIsFormOpen(false);
    if (editingInstitution) {
      updateInstitutionMutation.mutate({ id: editingInstitution.id, data: data as InstitutionUpdate });
    } else {
      createInstitutionMutation.mutate({ ...(data as InstitutionCreate), town_id: townId });
    }
  };

  const isLoading = isLoadingTown || isLoadingInstitutions;

  return (
    <>
      <SiteHeader
        items={[
          { label: "Inicio", href: "/", isCurrentPage: false },
          { label: "Cobertura", href: "/coverage", isCurrentPage: false },
          { label: "Departamentos", href: "/coverage/departments", isCurrentPage: false },
          { label: "Municipios", href: "/coverage/towns", isCurrentPage: false },
          { label: town?.name || "Instituciones", isCurrentPage: true },
        ]}
      />
      <div className="gap-4 p-4 pt-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Instituciones en {town?.name}</h2>
          <Button onClick={handleAddClick}>
            <Plus className="mr-2 h-4 w-4" /> Agregar Institución
          </Button>
        </div>
        {isLoading && <div>Cargando...</div>}
        {error && <div>Error: {error.message}</div>}
        {!isLoading && !error && !institutions?.length && <div>No hay instituciones para este municipio.</div>}
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {institutions?.map((institution) => (
            <div key={institution.id} className="p-4 border rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold">{institution.name}</h3>
              <p className="text-sm text-gray-500">Código DANE: {institution.dane_code}</p>
              <p className="text-sm text-gray-500">Sedes: {institution.number_of_campuses}</p>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleEditClick(institution)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleDeleteClick(institution.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <InstitutionForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initialData={editingInstitution}
      />
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. Esto eliminará permanentemente la institución."
      />
    </>
  );
};

export default TownInstitutionsPage;
