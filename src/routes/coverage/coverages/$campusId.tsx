import { createFileRoute } from "@tanstack/react-router";
import { useCampuses } from "@/features/coverage/campus/hooks/useCampuses";
import { useCoverages } from "@/features/coverage/coverages/hooks/useCoverages";
import { useBenefitTypes } from "@/features/coverage/coverages/hooks/useBenefitTypes";
import { useBeneficiaries } from "@/features/coverage/beneficiaries/hooks/useBeneficiaries";
import { useGrades } from "@/features/coverage/beneficiaries/hooks/useGrades";
import { CoverageDetails } from "@/features/coverage/coverages/components/CoverageDetails";
import { SiteHeader } from "@/components/site-header";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import type { CoverageCreate, CoverageReadWithDetails, CoverageUpdate } from "@team-aguila/pae-cobertura-client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CoveragesDataTable } from "@/features/coverage/coverages/components/CoveragesDataTable";
import { CoverageForm } from "@/features/coverage/coverages/components/CoverageForm";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { deleteCoverage } from "@/features/coverage/coverages/api/deleteCoverage";
import { updateCoverage } from "@/features/coverage/coverages/api/updateCoverage";

export const Route = createFileRoute("/coverage/coverages/$campusId")({
  component: CoverageDetailsPage,
});

function CoverageDetailsPage() {
  const { campusId } = Route.useParams();
  const queryClient = useQueryClient();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCoverage, setEditingCoverage] = useState<CoverageReadWithDetails | undefined>(undefined);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingCoverage, setDeletingCoverage] = useState<CoverageReadWithDetails | undefined>(undefined);

  const { data: campuses, isLoading: l1, isError: e1 } = useCampuses();
  const { data: coverages, isLoading: l2, isError: e2 } = useCoverages();
  const { data: benefitTypes, isLoading: l3, isError: e3 } = useBenefitTypes();
  const { data: beneficiaries, isLoading: l4, isError: e4 } = useBeneficiaries();
  const { data: grades, isLoading: l5, isError: e5 } = useGrades();

  const campus = useMemo(() => campuses?.find((c) => c.id === Number(campusId)), [campuses, campusId]);

  const campusCoverages = useMemo(() => {
    return coverages?.filter((c) => c.campus_id === Number(campusId)) || [];
  }, [coverages, campusId]);

  const updateCoverageMutation = useMutation({
    mutationFn: (data: { id: string; data: CoverageUpdate }) => updateCoverage(data.id, data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coverages"] });
      toast.success("Cobertura actualizada exitosamente");
    },
    onError: () => toast.error("Error al actualizar la cobertura"),
  });

  const deleteCoverageMutation = useMutation({
    mutationFn: deleteCoverage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coverages"] });
      toast.success("Cobertura eliminada exitosamente");
    },
    onError: () => toast.error("Error al eliminar la cobertura"),
  });

  const handleEditClick = (coverage: CoverageReadWithDetails) => {
    setEditingCoverage(coverage);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (coverage: CoverageReadWithDetails) => {
    setDeletingCoverage(coverage);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingCoverage) {
      deleteCoverageMutation.mutate(deletingCoverage.id);
      setIsConfirmOpen(false);
      setDeletingCoverage(undefined);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingCoverage(undefined);
  };

  const handleFormSubmit = (data: CoverageCreate | CoverageUpdate) => {
    setIsFormOpen(false);
    if (editingCoverage) {
      updateCoverageMutation.mutate({ id: editingCoverage.id, data: data as CoverageUpdate });
    }
  };

  const isLoading = l1 || l2 || l3 || l4 || l5;
  const isError = e1 || e2 || e3 || e4 || e5;

  if (isLoading) return <div>Cargando datos...</div>;
  if (isError) return <div>Error al cargar los datos. Por favor, intente de nuevo más tarde.</div>;

  return (
    <>
      <SiteHeader
        items={[
          { label: "Inicio", href: "/", isCurrentPage: false },
          { label: "Cobertura", href: "/coverage/coverages", isCurrentPage: false },
          { label: campus?.name || "Detalles de Sede", isCurrentPage: true },
        ]}
      />
      <div className="container mx-auto py-4">
        <Tabs defaultValue="summary">
          <TabsList>
            <TabsTrigger value="summary">Resumen</TabsTrigger>
            <TabsTrigger value="manage">Gestionar Beneficiarios</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="mt-4">
            <CoverageDetails
              campusId={Number(campusId)}
              campuses={campuses || []}
              coverages={coverages || []}
              benefitTypes={benefitTypes || []}
              beneficiaries={beneficiaries || []}
              grades={grades || []}
            />
          </TabsContent>
          <TabsContent value="manage" className="mt-4">
            <CoveragesDataTable
              data={campusCoverages}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              beneficiaries={beneficiaries || []}
              campuses={campuses || []}
              benefitTypes={benefitTypes || []}
            />
          </TabsContent>
        </Tabs>
      </div>
      <CoverageForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initialData={editingCoverage}
      />
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. Esto eliminará permanentemente la cobertura."
      />
    </>
  );
}
