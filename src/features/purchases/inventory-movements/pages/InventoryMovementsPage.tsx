import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, TrendingUp, TrendingDown, RotateCcw, ArrowRightLeft, Loader2, Package, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import {
  getInventoryMovementsByProduct,
  type InventoryMovement,
} from "@/features/purchases/inventory-movements/api/inventoryMovements";
import { getProducts, type Product } from "@/features/purchases/products/api/products";
import { CreateMovementDialog } from "../components/CreateMovementDialog";
import { MovementDetailsDialog } from "../components/MovementDetailsDialog";
import { formatDateForDisplayManual, formatDateOnlyForDisplayManual } from "../utils/dateUtils";

const InventoryMovementsPage = () => {
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<InventoryMovement | null>(null);

  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    institution: "all",
    dateFrom: "",
    dateTo: "",
  });

  const [selectedProduct, setSelectedProduct] = useState<string>("");

  // Cargar productos disponibles
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);

        const response = await getProducts({ limit: 100 });

        setProducts(response.products);
      } catch (err) {
        console.error("❌ Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // Seleccionar primer producto cuando se cargan los productos
  useEffect(() => {
    if (products.length > 0 && !selectedProduct) {
      setSelectedProduct(products[0]._id);
    }
  }, [products, selectedProduct]);

  useEffect(() => {
    const fetchMovements = async () => {
      if (!selectedProduct) {
        setMovements([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);


        const data = await getInventoryMovementsByProduct(selectedProduct);

        setMovements(data);
      } catch (err) {
        console.error("❌ Error fetching inventory movements:", err);
        setMovements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovements();
  }, [selectedProduct]);

  const getMovementIcon = (type: string) => {
    const icons = {
      receipt: <TrendingUp className="w-4 h-4 text-green-600" />,
      usage: <TrendingDown className="w-4 h-4 text-red-600" />,
      adjustment: <RotateCcw className="w-4 h-4 text-yellow-600" />,
      expired: <ArrowRightLeft className="w-4 h-4 text-gray-600" />,
      loss: <ArrowRightLeft className="w-4 h-4 text-orange-600" />,
    };
    return icons[type as keyof typeof icons] || icons["receipt"];
  };

  const getMovementBadge = (type: string) => {
    const config = {
      receipt: { variant: "default" as const, className: "bg-green-100 text-green-800", label: "Entrada" },
      usage: { variant: "secondary" as const, className: "bg-red-100 text-red-800", label: "Salida" },
      adjustment: { variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800", label: "Ajuste" },
      expired: { variant: "secondary" as const, className: "bg-gray-100 text-gray-800", label: "Vencido" },
      loss: { variant: "secondary" as const, className: "bg-orange-100 text-orange-800", label: "Pérdida" },
    };
    return config[type as keyof typeof config] || config["receipt"];
  };

  const filteredMovements = movements.filter((movement) => {
    const product = products.find((p) => p._id === movement.product_id);
    const matchesSearch =
      movement.product_id.toLowerCase().includes(filters.search.toLowerCase()) ||
      (product?.name && product.name.toLowerCase().includes(filters.search.toLowerCase())) ||
      (movement.notes && movement.notes.toLowerCase().includes(filters.search.toLowerCase())) ||
      (movement.lot && movement.lot.toLowerCase().includes(filters.search.toLowerCase()));

    const matchesType = filters.type === "all" || movement.movement_type === filters.type;
    const matchesInstitution =
      filters.institution === "all" || movement.institution_id.toString() === filters.institution;

    // Filtros de fecha - convertir las fechas a zona horaria de Colombia para comparación
    let matchesDateFrom = true;
    let matchesDateTo = true;

    if (filters.dateFrom) {
      // Convertir movement_date a fecha de Colombia (solo la parte de la fecha)
      const movementDate = new Date(movement.movement_date);
      const colombianDateString = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Bogota",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }).format(movementDate);
      matchesDateFrom = colombianDateString >= filters.dateFrom;
    }
    if (filters.dateTo) {
      // Convertir movement_date a fecha de Colombia (solo la parte de la fecha)
      const movementDate = new Date(movement.movement_date);
      const colombianDateString = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Bogota",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }).format(movementDate);
      matchesDateTo = colombianDateString <= filters.dateTo;
    }

    return matchesSearch && matchesType && matchesInstitution && matchesDateFrom && matchesDateTo;
  });

  // Cálculos para resumen
  const totalEntries = movements.filter((m) => m.movement_type === "receipt").length;
  const totalExits = movements.filter((m) => m.movement_type === "usage").length;
  const totalAdjustments = movements.filter((m) => m.movement_type === "adjustment").length;
  const totalExpired = movements.filter((m) => m.movement_type === "expired").length;

  const handleMovementCreated = () => {
    // Recargar movimientos después de crear uno nuevo
    if (selectedProduct) {
      const fetchMovements = async () => {
        try {
          const data = await getInventoryMovementsByProduct(selectedProduct);
          setMovements(data);
        } catch (err) {
          console.error("❌ Error fetching inventory movements:", err);
        }
      };
      fetchMovements();
    }
  };

  const handleViewMovement = (movement: InventoryMovement) => {
    setSelectedMovement(movement);
    setShowDetailsDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setShowDetailsDialog(false);
    setSelectedMovement(null);
  };

  if (loadingProducts) {
    return (
      <div className="p-6">
        <SiteHeader
          items={[
            { label: "Compras", href: "/purchases" },
            { label: "Movimientos de Inventario", href: "/purchases/inventory-movements", isCurrentPage: true },
          ]}
        />
        <div className="mt-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Cargando productos...</p>
          </div>
        </div>
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
            { label: "Movimientos de Inventario", href: "/purchases/inventory-movements", isCurrentPage: true },
          ]}
        />
        <div className="mt-6 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No hay productos en el sistema</h3>
          <p className="text-gray-600 mb-2">
            No se encontraron productos registrados en el sistema.
          </p>
          <p className="text-sm text-amber-600">
            Considera crear algunos productos para comenzar a gestionar movimientos de inventario.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <SiteHeader
          items={[
            { label: "Compras", href: "/purchases" },
            { label: "Movimientos de Inventario", href: "/purchases/inventory-movements", isCurrentPage: true },
          ]}
        />
        <div className="mt-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Cargando movimientos de inventario...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <SiteHeader
        items={[
          { label: "Compras", href: "/purchases" },
          { label: "Movimientos de Inventario", href: "/purchases/inventory-movements", isCurrentPage: true },
        ]}
      />

      <div className="mt-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Movimientos de Inventario</h1>
            <p className="text-gray-600">Registro de entradas, salidas y ajustes de inventario</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Movimiento
            </Button>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Seleccionar producto" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product._id} value={product._id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Entradas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalEntries}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Salidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalExits}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ajustes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{totalAdjustments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vencidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{totalExpired}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtra los movimientos por diferentes criterios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="search"
                  placeholder="Buscar por nombre de producto, ID, razón o lote..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="type">Tipo de Movimiento</Label>
              <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="receipt">Entrada</SelectItem>
                  <SelectItem value="usage">Salida</SelectItem>
                  <SelectItem value="adjustment">Ajuste</SelectItem>
                  <SelectItem value="expired">Vencido</SelectItem>
                  <SelectItem value="loss">Pérdida</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="institution">Institución</Label>
              <Select
                value={filters.institution}
                onValueChange={(value) => setFilters({ ...filters, institution: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar institución" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las instituciones</SelectItem>
                  <SelectItem value="1">Institución 1</SelectItem>
                  <SelectItem value="2">Institución 2</SelectItem>
                  <SelectItem value="3">Institución 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dateFrom">Fecha Desde</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="dateTo">Fecha Hasta</Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de movimientos */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Movimientos</CardTitle>
          <CardDescription>
            {selectedProduct ? (
              <>
                Producto: {products.find((p) => p._id === selectedProduct)?.name || selectedProduct} - Mostrando{" "}
                {filteredMovements.length} de {movements.length} movimientos
              </>
            ) : (
              "Seleccione un producto para ver sus movimientos"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredMovements.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {movements.length === 0
                  ? "No hay movimientos de inventario para este producto"
                  : "No se encontraron movimientos con los filtros aplicados"}
              </h3>
              <p className="text-gray-600">
                {movements.length === 0
                  ? "Los movimientos aparecerán aquí cuando se registren entradas, salidas o ajustes."
                  : "Intenta ajustar los filtros para encontrar lo que buscas."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Razón</TableHead>
                  <TableHead>Fecha/Hora (Colombia)</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Lote</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovements.map((movement) => (
                  <TableRow key={movement._id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getMovementIcon(movement.movement_type)}
                        <Badge {...getMovementBadge(movement.movement_type)}>
                          {getMovementBadge(movement.movement_type).label}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {products.find((p) => p._id === movement.product_id)?.name || `ID: ${movement.product_id}`}
                      </div>
                      <div className="text-sm text-gray-500">ID: {movement.product_id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {movement.quantity > 0 ? "+" : ""}
                        {movement.quantity} {movement.unit}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{movement.storage_location || "N/A"}</div>
                        <div className="text-gray-500 text-xs">Institución: {movement.institution_id}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{movement.notes || "N/A"}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{formatDateForDisplayManual(movement.movement_date)}</div>
                        <div className="text-gray-500 text-xs">Colombia (UTC-5)</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{movement.created_by}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{movement.lot || "N/A"}</div>
                        <div className="text-gray-500 text-xs">
                          Vence: {movement.expiration_date ? formatDateOnlyForDisplayManual(movement.expiration_date) : "N/A"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewMovement(movement)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog para crear movimiento */}
      <CreateMovementDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onMovementCreated={handleMovementCreated}
        products={products}
        selectedProduct={selectedProduct}
      />

      {/* Dialog para ver detalles del movimiento */}
      <MovementDetailsDialog
        open={showDetailsDialog}
        onClose={handleCloseDetailsDialog}
        movement={selectedMovement}
        products={products}
      />
    </div>
  );
};

export default InventoryMovementsPage;
