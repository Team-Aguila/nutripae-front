import { createFileRoute } from "@tanstack/react-router";
import IngredientsPage from "@/features/menus/ingredients/pages/IngredientsPage";

export const Route = createFileRoute("/menu/ingredients/")({
  component: IngredientsPage,
});
