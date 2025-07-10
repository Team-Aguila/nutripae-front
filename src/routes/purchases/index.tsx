import { createFileRoute } from "@tanstack/react-router";

function RouteComponent() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Módulo de Compras</h1>
      <p className="text-gray-600">Gestión integral de compras, inventario y proveedores del PAE.</p>
    </div>
  );
}

export const Route = createFileRoute("/purchases/")({
  component: RouteComponent,
});
