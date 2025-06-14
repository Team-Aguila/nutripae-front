import { createFileRoute } from "@tanstack/react-router";
import MenuSchedulesPage from "@/features/menus/schedules/pages/MenuSchedulesPage";

export const Route = createFileRoute("/menu/schedules/")({
  component: MenuSchedulesPage,
});
