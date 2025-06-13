import { createFileRoute } from "@tanstack/react-router";
import CoveragesPage from "@/features/coverage/coverages/pages/CoveragesPage";

export const Route = createFileRoute("/coverage/coverages/")({
  component: CoveragesPage,
});
