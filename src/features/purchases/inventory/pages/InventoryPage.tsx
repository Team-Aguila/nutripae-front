import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Package, Calendar, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { getInventory, type InventoryItem } from "@/features/purchases/inventory/api/getInventory";
import { getProducts, type Product } from "@/features/purchases/products/api/products";

const InventoryPage = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    institution: "all",
    status: "all",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener productos primero para verificar si existen
        const productsResponse = await getProducts({ limit: 100 });
        setProducts(productsResponse.products);
        setLoadingProducts(false);

        // Luego obtener inventario
        const inventoryResponse = await getInventory({ limit: 100 });
        setInventory(inventoryResponse.items);
      } catch (error) {
        console.error("Error fetching data:", error);
        setProducts([]);
        setInventory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadge = (isBelow: boolean) => {
    if (isBelow) {
      return { variant: "destructive" as const, className: "bg-red-100 text-red-800" };
    }
    return { variant: "default" as const, className: "bg-green-100 text-green-800" };
  };

  const getStatusText = (isBelow: boolean) => {
    return isBelow ? "Bajo" : "Normal";
  };

  const uniqueInstitutions = [...new Set(inventory.map((item) => item.institution_name))];

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.product_name.toLowerCase().includes(filters.search.toLowerCase()) ||
      (item.lot && item.lot.toLowerCase().includes(filters.search.toLowerCase()));
    const matchesInstitution = filters.institution === "all" || item.institution_name === filters.institution;
    const matchesStatus =
      filters.status === "all" ||
      (filters.status === "Bajo" && item.is_below_threshold) ||
      (filters.status === "Normal" && !item.is_below_threshold);

    return matchesSearch && matchesInstitution && matchesStatus;
  });

  if (loading || loadingProducts) {
    return (
      <div className="p-6">
        <div className="text-center">Cargando inventario...</div>
      </div>
    );
  }

  // Si no hay productos, mostrar mensaje sobre productos
  if (products.length === 0) {
    return (
      <div className="p-6">
        <SiteHeader
          items={[
            { label: "Compras", href: "/purchases" },
            { label: "Inventario", href: "/purchases/inventory", isCurrentPage: true },
          ]}
        />
        <div className="mt-6 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No hay productos en el inventario</h3>
          <p className="text-gray-600 mb-2">No se encontraron productos registrados en el sistema.</p>
          <p className="text-sm text-amber-600">
            Considera crear algunos productos para comenzar a gestionar el inventario.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <SiteHeader
        items={[
          { label: "Compras", href: "/purchases" },
          { label: "Inventario", href: "/purchases/inventory", isCurrentPage: true },
        ]}
      />

      <div className="mt-6">
        <h1 className="text-3xl font-bold mb-2">Inventario</h1>
        <p className="text-gray-600 mb-6">Consulta y gestión de niveles de inventario</p>
      </div>

      {/* Resumen de inventario */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Stock Normal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {inventory.filter((item) => !item.is_below_threshold).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {inventory.filter((item) => item.is_below_threshold).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Stock Crítico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {
                inventory.filter((item) => item.is_below_threshold && item.quantity < item.minimum_threshold * 0.5)
                  .length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Buscar producto o lote</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Buscar..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="institution">Institución</Label>
              <Select
                value={filters.institution}
                onValueChange={(value) => setFilters({ ...filters, institution: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las instituciones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {uniqueInstitutions.map((institution) => (
                    <SelectItem key={institution} value={institution}>
                      {institution}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Estado</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Bajo">Bajo</SelectItem>
                  <SelectItem value="Crítico">Crítico</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de inventario */}
      <Card>
        <CardHeader>
          <CardTitle>Inventario Actual</CardTitle>
          <CardDescription>
            Mostrando {filteredInventory.length} de {inventory.length} productos
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Institución</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Lote</TableHead>
                <TableHead>Vencimiento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Última Entrada</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item, index) => (
                <TableRow key={`${item.product_name}-${index}`}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-500" />
                      {item.product_name}
                    </div>
                  </TableCell>
                  <TableCell>{item.institution_name}</TableCell>
                  <TableCell>
                    <div className="font-medium">{item.quantity} unidad</div>
                    <div className="text-sm text-gray-500">Min: {item.minimum_threshold} unidad</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      {item.storage_location}
                    </div>
                  </TableCell>
                  <TableCell>{item.lot}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      {new Date(item.expiration_date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge {...getStatusBadge(item.is_below_threshold)}>{getStatusText(item.is_below_threshold)}</Badge>
                  </TableCell>
                  <TableCell>N/A</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryPage;
