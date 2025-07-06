import { SiteHeader } from "@/components/site-header";
import { useCoverages } from "../hooks/useCoverages";
import { useBeneficiaries } from "../../beneficiaries/hooks/useBeneficiaries";
import { useCampuses } from "../../campus/hooks/useCampuses";
import { useBenefitTypes } from "../hooks/useBenefitTypes";
import { CoveragesSummary } from "../components/CoveragesSummary";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CoverageForm } from "../components/CoverageForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCoverage } from "../api/createCoverage";
import { toast } from "sonner";
import type { CoverageCreate, CoverageUpdate } from "@team-aguila/pae-cobertura-client";

const CoveragesPage = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: coverages, isLoading: l1, error: e1 } = useCoverages();
  const { data: beneficiaries, isLoading: l2, error: e2 } = useBeneficiaries();
  const { data: campuses, isLoading: l3, error: e3 } = useCampuses();
  const { data: benefitTypes, isLoading: l4, error: e4 } = useBenefitTypes();

  const createCoverageMutation = useMutation({
    mutationFn: createCoverage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coverages"] });
      toast.success("Cobertura creada exitosamente");
      setIsFormOpen(false);
    },
    onError: () => toast.error("Error al crear la cobertura"),
  });

  const handleFormSubmit = (data: CoverageCreate | CoverageUpdate) => {
    createCoverageMutation.mutate(data as CoverageCreate);
  };

  const isLoading = l1 || l2 || l3 || l4;
  const error = e1 || e2 || e3 || e4;

  return (
    <>
      <SiteHeader
        items={[
          { label: "Inicio", href: "/", isCurrentPage: false },
          { label: "Cobertura", isCurrentPage: true },
        ]}
      />
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Coberturas</h2>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Agregar Cobertura
          </Button>
        </div>

        {isLoading && <div>Cargando...</div>}
        {error && <div>Error: {error.message}</div>}
        {!isLoading && !error && (
          <CoveragesSummary campuses={campuses || []} coverages={coverages || []} benefitTypes={benefitTypes || []} />
        )}
      </div>
      <CoverageForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        allBeneficiaries={beneficiaries || []}
        allCoverages={coverages || []}
      />
    </>
  );
};

export default CoveragesPage;
