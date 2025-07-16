import { createFileRoute } from "@tanstack/react-router";
import ProductsPage from "@/features/purchases/products/pages/ProductsPage";

export const Route = createFileRoute("/purchases/products/")({
  component: ProductsPage,
});
