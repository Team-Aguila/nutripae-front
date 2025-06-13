import { useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  CampusResponseWithDetails,
  CoverageReadWithDetails,
  BenefitType,
} from "@team-aguila/pae-cobertura-client";
import { Link } from "@tanstack/react-router";

interface CoveragesSummaryProps {
  campuses: CampusResponseWithDetails[];
  coverages: CoverageReadWithDetails[];
  benefitTypes: BenefitType[];
}

export const CoveragesSummary = ({ campuses, coverages, benefitTypes }: CoveragesSummaryProps) => {
  const validBenefitTypes = useMemo(() => benefitTypes?.filter((bt) => bt.id != null) || [], [benefitTypes]);

  const summaryData = useMemo(() => {
    if (!campuses || !coverages) {
      return [];
    }

    const coveragesByCampus = new Map<number, { total: number; benefitCounts: Map<number, number> }>();

    for (const coverage of coverages) {
      if (!coverage.campus_id) continue;

      if (!coveragesByCampus.has(coverage.campus_id)) {
        coveragesByCampus.set(coverage.campus_id, {
          total: 0,
          benefitCounts: new Map(validBenefitTypes.map((bt) => [bt.id!, 0])),
        });
      }

      const campusData = coveragesByCampus.get(coverage.campus_id)!;
      campusData.total += 1;

      const benefitTypeId = coverage.benefit_type_id;
      if (campusData.benefitCounts.has(benefitTypeId)) {
        const currentCount = campusData.benefitCounts.get(benefitTypeId) || 0;
        campusData.benefitCounts.set(benefitTypeId, currentCount + 1);
      }
    }

    return campuses.map((campus) => {
      const summary = coveragesByCampus.get(campus.id);
      return {
        campusId: campus.id,
        campusName: campus.name,
        totalBeneficiaries: summary?.total || 0,
        benefitCounts: summary?.benefitCounts || new Map(validBenefitTypes.map((bt) => [bt.id!, 0])),
      };
    });
  }, [campuses, coverages, validBenefitTypes]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen de Cobertura por Sede</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sede</TableHead>
              <TableHead className="text-right">Total Beneficiarios</TableHead>
              {validBenefitTypes.map((bt) => (
                <TableHead key={bt.id} className="text-right">
                  {bt.name}
                </TableHead>
              ))}
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {summaryData.map((row) => (
              <TableRow key={row.campusId}>
                <TableCell>
                  <Link
                    to="/coverage/coverages/$campusId"
                    params={{ campusId: String(row.campusId) }}
                    className="hover:underline"
                  >
                    {row.campusName}
                  </Link>
                </TableCell>
                <TableCell className="text-right">{row.totalBeneficiaries}</TableCell>
                {validBenefitTypes.map((bt) => (
                  <TableCell key={bt.id} className="text-right">
                    {row.benefitCounts.get(bt.id!) || 0}
                  </TableCell>
                ))}
                <TableCell className="text-right">
                  {row.totalBeneficiaries > 0 && (
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/coverage/coverages/$campusId" params={{ campusId: String(row.campusId) }}>
                        Detalles
                      </Link>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
