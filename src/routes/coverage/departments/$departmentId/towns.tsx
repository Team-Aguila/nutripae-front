import { createFileRoute } from "@tanstack/react-router";
import DepartmentTownsPage from "@/features/coverage/towns/pages/DepartmentTowns";

export const Route = createFileRoute("/coverage/departments/$departmentId/towns")({
  component: DepartmentTownsPage,
});
