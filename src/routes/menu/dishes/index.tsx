import { createFileRoute } from "@tanstack/react-router";
import DishesPage from "@/features/menus/dishes/pages/DishesPage";

export const Route = createFileRoute("/menu/dishes/")({
  component: DishesPage,
});
