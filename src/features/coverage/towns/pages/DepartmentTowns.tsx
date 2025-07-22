import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { SiteHeader } from "@/components/site-header";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { TownForm } from "../components/TownForm";
import { createTown } from "../api/createTown";
import { updateTown } from "../api/updateTown";
import { deleteTown } from "../api/deleteTown";
import { useTownsByDepartment } from "../hooks/useTownsByDepartment";
import { useDepartment } from "../hooks/useDepartment";
import type { TownCreate, TownResponseWithDetails, TownUpdate } from "@team-aguila/pae-cobertura-client";
import { useParams } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
const DepartmentTownsPage = () => {
  const params = useParams({ from: "/coverage/departments/$departmentId/towns" });
  const departmentId = parseInt(params.departmentId, 10);

  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: "/coverage/departments/$departmentId/towns" });

  const { data: department, isLoading: isLoadingDepartment } = useDepartment(departmentId);
  const { data: towns, isLoading: isLoadingTowns, error } = useTownsByDepartment(departmentId);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTown, setEditingTown] = useState<TownResponseWithDetails | undefined>(undefined);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingTownId, setDeletingTownId] = useState<number | undefined>(undefined);

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["towns", { departmentId }] });
    },
  };

  const createTownMutation = useMutation({
    ...mutationOptions,
    mutationFn: createTown,
    onSuccess: () => {
      mutationOptions.onSuccess();
      toast.success("Municipio creado exitosamente");
    },
    onError: () => toast.error("Error al crear el municipio"),
  });

  const updateTownMutation = useMutation({
    ...mutationOptions,
    mutationFn: updateTown,
    onSuccess: () => {
      mutationOptions.onSuccess();
      toast.success("Municipio actualizado exitosamente");
    },
    onError: () => toast.error("Error al actualizar el municipio"),
  });

  const deleteTownMutation = useMutation({
    ...mutationOptions,
    mutationFn: deleteTown,
    onSuccess: () => {
      mutationOptions.onSuccess();
      toast.success("Municipio eliminado exitosamente");
    },
    onError: () => toast.error("Error al eliminar el municipio"),
  });

  const handleAddClick = () => {
    setEditingTown(undefined);
    setIsFormOpen(true);
  };

  const handleEditClick = (town: TownResponseWithDetails) => {
    setEditingTown(town);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingTownId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingTownId) {
      deleteTownMutation.mutate(deletingTownId);
      setIsConfirmOpen(false);
      setDeletingTownId(undefined);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTown(undefined);
  };

  const handleFormSubmit = (data: TownCreate | TownUpdate) => {
    setIsFormOpen(false);
    if (editingTown) {
      updateTownMutation.mutate({ id: editingTown.id, data: data as TownUpdate });
    } else {
      createTownMutation.mutate({ ...(data as TownCreate), department_id: departmentId });
    }
  };

  const handleNavigateToInstitutions = (townId: number) => {
    navigate({
      to: "/coverage/towns/$townId/institutions",
      params: { townId: String(townId) },
    });
  };

  const isLoading = isLoadingDepartment || isLoadingTowns;

  return (
    <>
      <SiteHeader
        items={[
          { label: "Cobertura", href: "/coverage", isCurrentPage: false },
          { label: "Departamentos", href: "/coverage/departments", isCurrentPage: false },
          { label: department?.name || "Municipios", isCurrentPage: true },
        ]}
      />
      <div className="gap-4 p-4 pt-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Municipios de {department?.name}</h2>
          <Button onClick={handleAddClick}>
            <Plus className="mr-2 h-4 w-4" /> Agregar Municipio
          </Button>
        </div>
        {isLoading && <div>Cargando...</div>}
        {error && <div>Error: {error.message}</div>}
        {!isLoading && !error && !towns?.length && <div>No hay municipios para este departamento.</div>}
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {towns?.map((town) => (
            <div key={town.id} className="p-4 border rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold">{town.name}</h3>
              <p className="text-sm text-gray-500">Código DANE: {town.dane_code}</p>
              <p className="text-sm text-gray-500">Instituciones: {town.number_of_institutions}</p>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" size="icon" onClick={() => handleNavigateToInstitutions(town.id)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleEditClick(town)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleDeleteClick(town.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <TownForm isOpen={isFormOpen} onClose={handleFormClose} onSubmit={handleFormSubmit} initialData={editingTown} />
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. Esto eliminará permanentemente el municipio."
      />
    </>
  );
};

export default DepartmentTownsPage;
