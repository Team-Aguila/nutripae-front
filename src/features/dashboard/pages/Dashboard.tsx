import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDepartments } from "@/features/coverage/departments/hooks/useDepartments";
import { useTowns } from "@/features/coverage/towns/hooks/useTowns";
import { useInstitutions } from "@/features/coverage/institutions/hooks/useInstitutions";
import { useCampuses } from "@/features/coverage/campus/hooks/useCampuses";
import React, { Suspense } from "react";

const CoverageChart = React.lazy(() =>
  import("../components/CoverageChart").then((mod) => ({ default: mod.CoverageChart }))
);

export function Dashboard() {
  const { data: departments } = useDepartments();
  const { data: towns } = useTowns();
  const { data: institutions } = useInstitutions();
  const { data: campuses } = useCampuses();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Departamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{departments?.length ?? "0"}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Municipios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{towns?.length ?? "0"}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Instituciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{institutions?.length ?? "0"}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sedes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{campuses?.length ?? "0"}</div>
        </CardContent>
      </Card>
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Cobertura por Departamento</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <Suspense fallback={<div>Cargando gráfico...</div>}>
            <CoverageChart />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
} 