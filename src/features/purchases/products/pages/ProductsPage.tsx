import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, Weight, Clock, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { getProducts, type Product } from "@/features/purchases/products/api/products";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts({ limit: 100 });
        setProducts(response.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getWeeklyAvailabilityDisplay = (availability: string) => {
    const dayNames = {
      MONDAY: "Lunes",
      TUESDAY: "Martes",
      WEDNESDAY: "Miércoles",
      THURSDAY: "Jueves",
      FRIDAY: "Viernes",
      SATURDAY: "Sábado",
      SUNDAY: "Domingo",
    };
    return dayNames[availability as keyof typeof dayNames] || availability;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <SiteHeader
        items={[
          { label: "Compras", href: "/purchases" },
          { label: "Productos", href: "/purchases/products", isCurrentPage: true },
        ]}
      />

      <div className="mt-6">
        <h1 className="text-3xl font-bold mb-2">Productos</h1>
        <p className="text-gray-600 mb-6">Gestión de productos para el sistema de compras</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Catálogo de Productos</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <Badge variant="outline">Producto</Badge>
              </div>
              <CardDescription>ID: {product.provider_id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-500" />
                  <span>Proveedor ID</span>
                </div>
                <span className="font-medium">{product.provider_id.slice(0, 8)}...</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Weight className="h-4 w-4 text-gray-500" />
                  <span>Peso</span>
                </div>
                <span className="font-medium">{product.weight} kg</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>Vida útil</span>
                </div>
                <span className="font-medium">
                  {product.life_time.value} {product.life_time.unit}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-gray-500" />
                  <span>Merma</span>
                </div>
                <span className="font-medium">{(product.shrinkage_factor * 100).toFixed(1)}%</span>
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm text-gray-600 mb-2">Disponibilidad:</p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">
                    {getWeeklyAvailabilityDisplay(product.weekly_availability)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
