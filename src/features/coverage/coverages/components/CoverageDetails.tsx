import { useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  BeneficiaryReadWithDetails,
  CampusResponseWithDetails,
  CoverageReadWithDetails,
  Grade,
  BenefitType,
} from "@team-aguila/pae-cobertura-client";

interface CoverageDetailsProps {
  campusId: number;
  campuses: CampusResponseWithDetails[];
  coverages: CoverageReadWithDetails[];
  benefitTypes: BenefitType[];
  beneficiaries: BeneficiaryReadWithDetails[];
  grades: Grade[];
}

export const CoverageDetails = ({
  campusId,
  campuses,
  coverages,
  benefitTypes,
  beneficiaries,
  grades,
}: CoverageDetailsProps) => {
  const validBenefitTypes = useMemo(() => benefitTypes?.filter((bt) => bt.id != null) || [], [benefitTypes]);
  const validGrades = useMemo(() => grades?.filter((g) => g.id != null) || [], [grades]);

  const detailsData = useMemo(() => {
    if (!coverages || !beneficiaries) {
      return { details: [], totalBeneficiaries: 0 };
    }

    const campusCoverages = coverages.filter((c) => c.campus_id === campusId);
    const beneficiaryIdsInCampus = new Set(campusCoverages.map((c) => c.beneficiary_id));
    const beneficiariesInCampus = beneficiaries.filter((b) => beneficiaryIdsInCampus.has(b.id));

    const coverageMap = new Map(campusCoverages.map((c) => [c.beneficiary_id, c]));
    const gradeMap = new Map<number, { gradeName: string; benefitCounts: Map<number, number> }>();

    for (const grade of validGrades) {
      gradeMap.set(grade.id!, {
        gradeName: grade.name,
        benefitCounts: new Map(validBenefitTypes.map((bt) => [bt.id!, 0])),
      });
    }

    for (const beneficiary of beneficiariesInCampus) {
      const gradeId = beneficiary.grade_id;
      const coverage = coverageMap.get(beneficiary.id);
      if (!gradeId || !coverage) continue;

      const gradeData = gradeMap.get(gradeId);
      if (gradeData) {
        const currentCount = gradeData.benefitCounts.get(coverage.benefit_type_id) || 0;
        gradeData.benefitCounts.set(coverage.benefit_type_id, currentCount + 1);
      }
    }

    return {
      details: Array.from(gradeMap.values()),
      totalBeneficiaries: beneficiariesInCampus.length,
    };
  }, [campusId, coverages, beneficiaries, validBenefitTypes, validGrades]);

  const campus = useMemo(() => campuses?.find((c) => c.id === campusId), [campuses, campusId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{campus?.name}</CardTitle>
        <CardDescription>Desglose de beneficiarios por grado. Total: {detailsData.totalBeneficiaries}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Grado</TableHead>
              {validBenefitTypes.map((bt) => (
                <TableHead key={bt.id} className="text-right">
                  {bt.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {detailsData.details.map((row) => (
              <TableRow key={row.gradeName}>
                <TableCell>{row.gradeName}</TableCell>
                {validBenefitTypes.map((bt) => (
                  <TableCell key={bt.id} className="text-right">
                    {row.benefitCounts.get(bt.id!) || 0}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
