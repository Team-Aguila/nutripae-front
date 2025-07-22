"use client";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useDepartments } from "@/features/coverage/departments/hooks/useDepartments";

export function CoverageChart() {
  const { data: departments, isLoading } = useDepartments();

  if (isLoading) {
    return <div>Cargando gráfico...</div>;
  }

  const chartData =
    departments?.map((department) => ({
      name: department.name,
      total: department.number_of_towns,
    })) ?? [];

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: number) => `${value}`}
        />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
} 