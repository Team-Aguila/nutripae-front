import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { Input } from "@/components/ui/input";
import { SiteHeader } from "@/components/site-header";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { TownForm } from "../components/TownForm";
import { createTown } from "../api/createTown";
import { updateTown } from "../api/updateTown";
import { deleteTown } from "../api/deleteTown";
import { useTowns } from "../hooks/useTowns";
import type { TownCreate, TownResponseWithDetails, TownUpdate } from "@team-aguila/pae-cobertura-client";
import { useNavigate } from "@tanstack/react-router";

const TownsPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: "/coverage/towns" });
  const [nameFilter, setNameFilter] = useState("");

  const { data: towns, isLoading, error } = useTowns();

  const filteredTowns = useMemo(() => {
    if (!towns) return [];
    return towns.filter((town) => town.name.toLowerCase().includes(nameFilter.toLowerCase()));
  }, [towns, nameFilter]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTown, setEditingTown] = useState<TownResponseWithDetails | undefined>(undefined);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingTownId, setDeletingTownId] = useState<number | undefined>(undefined);

  const createTownMutation = useMutation({
    mutationFn: createTown,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["towns"] });
      toast.success("Municipio creado exitosamente");
    },
    onError: () => toast.error("Error al crear el municipio"),
  });

  const updateTownMutation = useMutation({
    mutationFn: updateTown,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["towns"] });
      toast.success("Municipio actualizado exitosamente");
    },
    onError: () => toast.error("Error al actualizar el municipio"),
  });

  const deleteTownMutation = useMutation({
    mutationFn: deleteTown,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["towns"] });
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
      createTownMutation.mutate(data as TownCreate);
    }
  };

  const handleNavigateToInstitutions = (townId: number) => {
    navigate({
      to: "/coverage/towns/$townId/institutions",
      params: { townId: String(townId) },
    });
  };

  return (
    <>
      <SiteHeader
        items={[
          { label: "Inicio", href: "/", isCurrentPage: false },
          { label: "Cobertura", href: "/coverage", isCurrentPage: false },
          { label: "Municipios", isCurrentPage: true },
        ]}
      />
      <div className="gap-4 p-4 pt-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Municipios</h2>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Filtrar por nombre..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="w-64"
            />
            <Button onClick={handleAddClick}>
              <Plus className="mr-2 h-4 w-4" /> Agregar Municipio
            </Button>
          </div>
        </div>
        {isLoading && <div>Cargando...</div>}
        {error && <div>Error: {error.message}</div>}
        {!isLoading && !error && !filteredTowns.length && <div>No hay datos</div>}
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {filteredTowns.map((town) => (
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

export default TownsPage;
