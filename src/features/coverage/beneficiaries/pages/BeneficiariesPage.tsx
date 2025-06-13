import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { SiteHeader } from "@/components/site-header";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type {
  BeneficiaryCreate,
  BeneficiaryUpdate,
  BeneficiaryReadWithDetails,
  DocumentType,
  Gender,
  Grade,
} from "@team-aguila/pae-cobertura-client";
import { useBeneficiaries } from "../hooks/useBeneficiaries";
import { createBeneficiary } from "../api/createBeneficiary";
import { updateBeneficiary } from "../api/updateBeneficiary";
import { deleteBeneficiary } from "../api/deleteBeneficiary";
import { BeneficiaryForm } from "../components/BeneficiaryForm";
import { BeneficiariesDataTable } from "../components/BeneficiariesDataTable";
import { getColumns } from "../components/columns";
import { getDocumentTypes } from "../api/catalogs/getDocumentTypes";
import { getGenders } from "../api/catalogs/getGenders";
import { getGrades } from "../api/catalogs/getGrades";

const BeneficiariesPage = () => {
  const queryClient = useQueryClient();

  const { data: beneficiaries, isLoading: isLoadingBeneficiaries, error: errorBeneficiaries } = useBeneficiaries();
  const { data: documentTypes, isLoading: isLoadingDocumentTypes } = useQuery<DocumentType[]>({
    queryKey: ["documentTypes"],
    queryFn: getDocumentTypes,
  });
  const { data: genders, isLoading: isLoadingGenders } = useQuery<Gender[]>({
    queryKey: ["genders"],
    queryFn: getGenders,
  });
  const { data: grades, isLoading: isLoadingGrades } = useQuery<Grade[]>({ queryKey: ["grades"], queryFn: getGrades });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBeneficiary, setEditingBeneficiary] = useState<BeneficiaryReadWithDetails | undefined>(undefined);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingBeneficiaryId, setDeletingBeneficiaryId] = useState<string | undefined>(undefined);

  const createBeneficiaryMutation = useMutation({
    mutationFn: createBeneficiary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beneficiaries"] });
      toast.success("Beneficiario creado exitosamente");
    },
    onError: () => toast.error("Error al crear el beneficiario"),
  });

  const updateBeneficiaryMutation = useMutation({
    mutationFn: updateBeneficiary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beneficiaries"] });
      toast.success("Beneficiario actualizado exitosamente");
    },
    onError: () => toast.error("Error al actualizar el beneficiario"),
  });

  const deleteBeneficiaryMutation = useMutation({
    mutationFn: deleteBeneficiary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beneficiaries"] });
      toast.success("Beneficiario eliminado exitosamente");
    },
    onError: () => toast.error("Error al eliminar el beneficiario"),
  });

  const handleAddClick = () => {
    setEditingBeneficiary(undefined);
    setIsFormOpen(true);
  };

  const handleEditClick = (beneficiary: BeneficiaryReadWithDetails) => {
    setEditingBeneficiary(beneficiary);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingBeneficiaryId(id);
    setIsConfirmOpen(true);
  };

  const handleDetailsClick = (id: string) => {
    // TODO: Implement details navigation
    console.log("Details for:", id);
  };

  const handleConfirmDelete = () => {
    if (deletingBeneficiaryId) {
      deleteBeneficiaryMutation.mutate(deletingBeneficiaryId);
      setIsConfirmOpen(false);
      setDeletingBeneficiaryId(undefined);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingBeneficiary(undefined);
  };

  const handleFormSubmit = (data: BeneficiaryCreate | BeneficiaryUpdate) => {
    setIsFormOpen(false);
    if (editingBeneficiary) {
      updateBeneficiaryMutation.mutate({ id: editingBeneficiary.id, data: data as BeneficiaryUpdate });
    } else {
      createBeneficiaryMutation.mutate(data as BeneficiaryCreate);
    }
  };

  const columns = getColumns({
    handleEdit: handleEditClick,
    handleDelete: handleDeleteClick,
    handleDetails: handleDetailsClick,
    documentTypes: documentTypes || [],
    genders: genders || [],
    grades: grades || [],
  });

  const isLoading = isLoadingBeneficiaries || isLoadingDocumentTypes || isLoadingGenders || isLoadingGrades;
  const error = errorBeneficiaries;

  return (
    <>
      <SiteHeader
        items={[
          { label: "Inicio", href: "/", isCurrentPage: false },
          { label: "Cobertura", href: "/coverage", isCurrentPage: false },
          { label: "Beneficiarios", isCurrentPage: true },
        ]}
      />
      <div className="container mx-auto py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Beneficiarios</h2>
          <Button onClick={handleAddClick}>
            <Plus className="mr-2 h-4 w-4" /> Agregar Beneficiario
          </Button>
        </div>
        {isLoading && <div>Cargando...</div>}
        {error && <div>Error: {error.message}</div>}
        {!isLoading && !error && <BeneficiariesDataTable columns={columns} data={beneficiaries || []} />}
      </div>
      <BeneficiaryForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initialData={editingBeneficiary}
      />
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. Esto eliminará permanentemente el beneficiario."
      />
    </>
  );
};

export default BeneficiariesPage;
