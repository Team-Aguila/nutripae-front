import { createFileRoute } from "@tanstack/react-router";
import InstitutionsPage from "@/features/coverage/institutions/pages/institutions";

export const Route = createFileRoute("/coverage/institutions/")({
  component: InstitutionsPage,
});
