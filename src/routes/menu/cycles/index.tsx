import { createFileRoute } from "@tanstack/react-router";
import MenuCyclesPage from "@/features/menus/cycles/pages/MenuCyclesPage";

export const Route = createFileRoute("/menu/cycles/")({
  component: MenuCyclesPage,
});
