import { createFileRoute } from "@tanstack/react-router";
import DepartmentsPage from "@/features/coverage/departments/pages/index";

export const Route = createFileRoute("/coverage/departments/")({
  component: DepartmentsPage,
});
