import { useParams } from "@tanstack/react-router";
import { useCoveragesByCampus } from "../hooks/useCoveragesByCampus";
import { useBenefitTypes } from "../hooks/useBenefitTypes";
import { useCampus } from "../../campus/hooks/useCampus";
import { useGrades } from "../../beneficiaries/hooks/useGrades";
import { useBeneficiaries } from "../../beneficiaries/hooks/useBeneficiaries";
import { SiteHeader } from "@/components/site-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Summary {
  grade: string;
  totalStudents: number;
  benefits: {
    [key: string]: number;
  };
}

const CampusCoverageSummaryPage = () => {
  const { campusId } = useParams({ from: "/coverage/campuses/$campusId/summary" });
  const { data: coverages, isLoading, error } = useCoveragesByCampus(campusId);
  const { data: benefitTypes } = useBenefitTypes();
  const { data: campus } = useCampus(campusId);
  const { data: grades } = useGrades();
  const { data: beneficiaries } = useBeneficiaries();

  const calculateSummary = (): Summary[] => {
    if (!coverages || !benefitTypes || !grades || !beneficiaries) return [];

    const summaryMap = new Map<string, Summary>();

    coverages.forEach((coverage) => {
      const beneficiary = beneficiaries.find((b) => b.id === coverage.beneficiary_id);
      const grade = grades.find((g) => g.id === beneficiary?.grade_id);
      const gradeName = grade?.name || "Sin grado";
      const benefitType = benefitTypes.find((bt) => bt.id === coverage.benefit_type_id);
      const benefitName = benefitType?.name || "Sin beneficio";

      if (!summaryMap.has(gradeName)) {
        summaryMap.set(gradeName, {
          grade: gradeName,
          totalStudents: 0,
          benefits: {},
        });
      }

      const summary = summaryMap.get(gradeName)!;
      summary.totalStudents++;
      summary.benefits[benefitName] = (summary.benefits[benefitName] || 0) + 1;
    });

    return Array.from(summaryMap.values());
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar los datos</div>;

  const summary = calculateSummary();
  const campusName = campus?.name || "Sede";

  return (
    <div className="container mx-auto py-6">
      <SiteHeader
        items={[
          { label: "Inicio", href: "/", isCurrentPage: false },
          { label: "Cobertura", href: "/coverage", isCurrentPage: false },
          { label: "Sedes", href: "/coverage/campuses", isCurrentPage: false },
          { label: campusName, isCurrentPage: true },
        ]}
      />
      <h1 className="text-2xl font-bold mb-4">Resumen de Cobertura - {campusName}</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Grado</TableHead>
            <TableHead>Total Estudiantes</TableHead>
            {benefitTypes?.map((type) => <TableHead key={type.id}>{type.name}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {summary.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.grade}</TableCell>
              <TableCell>{item.totalStudents}</TableCell>
              {benefitTypes?.map((type) => <TableCell key={type.id}>{item.benefits[type.name] || 0}</TableCell>)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CampusCoverageSummaryPage;
