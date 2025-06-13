import { createFileRoute } from "@tanstack/react-router";
import InstitutionCampusesPage from "@/features/coverage/campus/pages/InstitutionCampuses";

export const Route = createFileRoute("/coverage/institutions/$institutionId/campuses")({
  component: InstitutionCampusesPage,
});
