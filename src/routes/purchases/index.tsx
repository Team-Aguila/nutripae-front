import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Package, BarChart3 } from "lucide-react";

function RouteComponent() {
  const modules = [
    {
      title: "Movimientos de Inventario",
      description: "Gestiona entradas, salidas y ajustes de inventario",
      icon: Package,
      href: "/purchases/inventory-movements",
      color: "text-blue-600",
    },
    {
      title: "Órdenes de Compra",
      description: "Crea y gestiona órdenes de compra para proveedores",
      icon: ShoppingCart,
      href: "/purchases/purchase-orders",
      color: "text-green-600",
    },
    {
      title: "Reportes",
      description: "Visualiza reportes y estadísticas de compras",
      icon: BarChart3,
      href: "/purchases/reports",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Módulo de Compras</h1>
        <p className="text-gray-600">Gestión integral de compras, inventario y proveedores del PAE.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Link key={module.href} to={module.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <module.icon className={`w-6 h-6 ${module.color}`} />
                  {module.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {module.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/purchases/")({
  component: RouteComponent,
});
