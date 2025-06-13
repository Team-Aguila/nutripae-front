import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { SiteHeader } from "@/components/site-header";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CampusForm } from "../components/CampusForm";
import { createCampus } from "../api/createCampus";
import { updateCampus } from "../api/updateCampus";
import { deleteCampus } from "../api/deleteCampus";
import { useCampusesByInstitution } from "../hooks/useCampusesByInstitution";
import { useInstitution } from "../hooks/useInstitution";
import type { CampusCreate, CampusResponseWithDetails, CampusUpdate } from "@team-aguila/pae-cobertura-client";
import { useParams } from "@tanstack/react-router";

const InstitutionCampusesPage = () => {
  const params = useParams({ from: "/coverage/institutions/$institutionId/campuses" });
  const institutionId = parseInt(params.institutionId, 10);

  const queryClient = useQueryClient();

  const { data: institution, isLoading: isLoadingInstitution } = useInstitution(institutionId);
  const { data: campuses, isLoading: isLoadingCampuses, error } = useCampusesByInstitution(institutionId);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCampus, setEditingCampus] = useState<CampusResponseWithDetails | undefined>(undefined);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingCampusId, setDeletingCampusId] = useState<number | undefined>(undefined);

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campuses", { institutionId }] });
    },
  };

  const createCampusMutation = useMutation({
    ...mutationOptions,
    mutationFn: createCampus,
    onSuccess: () => {
      mutationOptions.onSuccess();
      toast.success("Sede creada exitosamente");
    },
    onError: () => toast.error("Error al crear la sede"),
  });

  const updateCampusMutation = useMutation({
    ...mutationOptions,
    mutationFn: updateCampus,
    onSuccess: () => {
      mutationOptions.onSuccess();
      toast.success("Sede actualizada exitosamente");
    },
    onError: () => toast.error("Error al actualizar la sede"),
  });

  const deleteCampusMutation = useMutation({
    ...mutationOptions,
    mutationFn: deleteCampus,
    onSuccess: () => {
      mutationOptions.onSuccess();
      toast.success("Sede eliminada exitosamente");
    },
    onError: () => toast.error("Error al eliminar la sede"),
  });

  const handleAddClick = () => {
    setEditingCampus(undefined);
    setIsFormOpen(true);
  };

  const handleEditClick = (campus: CampusResponseWithDetails) => {
    setEditingCampus(campus);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingCampusId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingCampusId) {
      deleteCampusMutation.mutate(deletingCampusId);
      setIsConfirmOpen(false);
      setDeletingCampusId(undefined);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingCampus(undefined);
  };

  const handleFormSubmit = (data: CampusCreate | CampusUpdate) => {
    setIsFormOpen(false);
    if (editingCampus) {
      updateCampusMutation.mutate({ id: editingCampus.id, data: data as CampusUpdate });
    } else {
      createCampusMutation.mutate({ ...(data as CampusCreate), institution_id: institutionId });
    }
  };

  const handleNavigateToCoverages = (campusId: number) => {
    // TODO: Implement navigation
    console.log("Navigating to coverages for campus:", campusId);
  };

  const isLoading = isLoadingInstitution || isLoadingCampuses;

  return (
    <>
      <SiteHeader
        items={[
          { label: "Inicio", href: "/", isCurrentPage: false },
          { label: "Cobertura", href: "/coverage", isCurrentPage: false },
          { label: "Instituciones", href: "/coverage/institutions", isCurrentPage: false },
          { label: institution?.name || "Sedes", isCurrentPage: true },
        ]}
      />
      <div className="gap-4 p-4 pt-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Sedes de {institution?.name}</h2>
          <Button onClick={handleAddClick}>
            <Plus className="mr-2 h-4 w-4" /> Agregar Sede
          </Button>
        </div>
        {isLoading && <div>Cargando...</div>}
        {error && <div>Error: {error.message}</div>}
        {!isLoading && !error && !campuses?.length && <div>No hay sedes para esta institución.</div>}
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {campuses?.map((campus) => (
            <div key={campus.id} className="p-4 border rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold">{campus.name}</h3>
              <p className="text-sm text-gray-500">Código DANE: {campus.dane_code}</p>
              <p className="text-sm text-gray-500">Dirección: {campus.address}</p>
              <p className="text-sm text-gray-500">Latitud: {campus.latitude}</p>
              <p className="text-sm text-gray-500">Longitud: {campus.longitude}</p>
              <p className="text-sm text-gray-500">Coberturas: {campus.number_of_coverages}</p>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" size="icon" onClick={() => handleNavigateToCoverages(campus.id)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleEditClick(campus)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleDeleteClick(campus.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <CampusForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initialData={editingCampus}
      />
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. Esto eliminará permanentemente la sede."
      />
    </>
  );
};

export default InstitutionCampusesPage;
