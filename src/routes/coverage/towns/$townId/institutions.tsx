import { createFileRoute } from "@tanstack/react-router";
import TownInstitutionsPage from "@/features/coverage/institutions/pages/TownInstitutions";

export const Route = createFileRoute("/coverage/towns/$townId/institutions")({
  component: TownInstitutionsPage,
});
