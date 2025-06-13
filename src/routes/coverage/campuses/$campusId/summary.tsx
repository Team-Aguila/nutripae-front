import { createFileRoute } from "@tanstack/react-router";
import CampusCoverageSummaryPage from "@/features/coverage/coverages/pages/CampusCoverageSummaryPage";

export const Route = createFileRoute("/coverage/campuses/$campusId/summary")({
  component: CampusCoverageSummaryPage,
});
