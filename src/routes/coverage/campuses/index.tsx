import { createFileRoute } from "@tanstack/react-router";
import CampusesPage from "@/features/coverage/campus/pages/campuses";

export const Route = createFileRoute("/coverage/campuses/")({
  component: CampusesPage,
});
