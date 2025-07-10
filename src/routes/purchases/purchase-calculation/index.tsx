import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Calculator, ShoppingCart, Download, RefreshCw, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  calculatePurchaseNeeds,
  type PurchaseCalculationRequest,
  type PurchaseCalculationResponse,
} from "@/features/purchases/purchase-calculation/api/purchaseCalculation";

function RouteComponent() {
  const [calculationResults, setCalculationResults] = useState<PurchaseCalculationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const [filters, setFilters] = useState({
    category: "all",
    priority: "all",
  });

  const [calculationParams, setCalculationParams] = useState({
    startDate: "",
    endDate: "",
    coverageType: "municipality" as "municipality" | "campus",
    coverageIds: [] as (number | string)[],
  });

  const handleCalculate = async () => {
    if (!calculationParams.startDate || !calculationParams.endDate) {
      setError("Por favor seleccione las fechas de inicio y fin");
      setShowErrorDialog(true);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("🧮 Iniciando cálculo de compras...");

      const request: PurchaseCalculationRequest = {
        start_date: calculationParams.startDate,
        end_date: calculationParams.endDate,
        coverage: {
          type: calculationParams.coverageType,
          ids: calculationParams.coverageIds.length > 0 ? calculationParams.coverageIds : [1], // Default para testing
        },
      };

      console.log("📋 Parámetros de cálculo:", request);

      const response = await calculatePurchaseNeeds(request);
      console.log("📊 Resultado del cálculo:", response);

      setCalculationResults(response);
    } catch (err) {
      console.error("❌ Error calculating purchase needs:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadge = (netQuantity: number) => {
    // Determinamos prioridad basada en la cantidad neta a comprar
    if (netQuantity <= 0) {
      return { variant: "default" as const, className: "bg-green-100 text-green-800", label: "Suficiente" };
    } else if (netQuantity < 50) {
      return { variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800", label: "Media" };
    } else if (netQuantity < 100) {
      return { variant: "secondary" as const, className: "bg-orange-100 text-orange-800", label: "Alta" };
    } else {
      return { variant: "destructive" as const, className: "bg-red-100 text-red-800", label: "Crítica" };
    }
  };

  const purchaseList = calculationResults?.purchase_list || [];
  const filteredResults = purchaseList.filter((item) => {
    // Filtro por categoría - como no tenemos categoría en la API, lo omitimos por ahora
    const matchesCategory = filters.category === "all";

    // Filtro por prioridad
    const priority = getPriorityBadge(item.net_quantity_to_purchase);
    const matchesPriority = filters.priority === "all" || priority.label === filters.priority;

    return matchesCategory && matchesPriority;
  });

  // Cálculos para resumen
  const totalItems = purchaseList.filter((item) => item.net_quantity_to_purchase > 0).length;
  const criticalItems = purchaseList.filter((item) => item.net_quantity_to_purchase >= 100).length;
  const stockSufficient = purchaseList.filter((item) => item.net_quantity_to_purchase <= 0).length;

  return (
    <div className="p-6">
      <SiteHeader
        items={[
          { label: "Compras", href: "/purchases" },
          { label: "Cálculo de Compras", href: "/purchases/purchase-calculation", isCurrentPage: true },
        ]}
      />

      <div className="mt-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Cálculo de Compras</h1>
            <p className="text-gray-600">Cálculo automático de necesidades de compra basado en menús y cobertura</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button>
              <RefreshCw className="w-4 h-4 mr-2" />
              Recalcular
            </Button>
          </div>
        </div>
      </div>

      {/* Parámetros de cálculo */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Parámetros de Cálculo</CardTitle>
          <CardDescription>Configure los parámetros para el cálculo de necesidades de compra</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="startDate">Fecha Inicio</Label>
              <Input
                id="startDate"
                type="date"
                value={calculationParams.startDate}
                onChange={(e) => setCalculationParams({ ...calculationParams, startDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="endDate">Fecha Fin</Label>
              <Input
                id="endDate"
                type="date"
                value={calculationParams.endDate}
                onChange={(e) => setCalculationParams({ ...calculationParams, endDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="coverageType">Tipo de Cobertura</Label>
              <Select
                value={calculationParams.coverageType}
                onValueChange={(value: "municipality" | "campus") =>
                  setCalculationParams({ ...calculationParams, coverageType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="municipality">Municipio</SelectItem>
                  <SelectItem value="campus">Campus</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleCalculate} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Calculando...
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4 mr-2" />
                Calcular Necesidades
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Resumen del cálculo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ingredientes</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculationResults?.total_ingredients || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Necesarios</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{totalItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Críticos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Suficiente</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stockSufficient}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtra los resultados del cálculo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Categoría</Label>
              <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  <SelectItem value="Cereales">Cereales</SelectItem>
                  <SelectItem value="Legumbres">Legumbres</SelectItem>
                  <SelectItem value="Aceites">Aceites</SelectItem>
                  <SelectItem value="Carnes">Carnes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Prioridad</Label>
              <Select value={filters.priority} onValueChange={(value) => setFilters({ ...filters, priority: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las prioridades</SelectItem>
                  <SelectItem value="Crítica">Crítica</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Media">Media</SelectItem>
                  <SelectItem value="Suficiente">Suficiente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de resultados */}
      <Card>
        <CardHeader>
          <CardTitle>Resultados del Cálculo</CardTitle>
          <CardDescription>
            {calculationResults
              ? `Mostrando ${filteredResults.length} de ${calculationResults.total_ingredients} ingredientes`
              : "Configure los parámetros y calcule las necesidades de compra"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!calculationResults ? (
            <div className="text-center py-8">
              <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay resultados de cálculo</h3>
              <p className="text-gray-500 mb-4">
                Configure los parámetros y presione "Calcular Necesidades" para obtener los resultados.
              </p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos que coincidan con los filtros</h3>
              <p className="text-gray-500 mb-4">Ajuste los filtros para ver más resultados.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ingrediente</TableHead>
                  <TableHead>Cantidad Bruta</TableHead>
                  <TableHead>Inventario Actual</TableHead>
                  <TableHead>Stock Seguridad</TableHead>
                  <TableHead>Cantidad Neta</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((item, index) => {
                  const priorityBadge = getPriorityBadge(item.net_quantity_to_purchase);
                  return (
                    <TableRow key={item.ingredient_id || index}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.ingredient_name}</div>
                          <div className="text-sm text-gray-500">ID: {item.ingredient_id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {item.total_gross_quantity} {item.unit}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {item.current_inventory} {item.unit}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {item.safety_stock} {item.unit}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`font-medium ${item.net_quantity_to_purchase > 0 ? "text-red-600" : "text-green-600"}`}
                        >
                          {item.net_quantity_to_purchase} {item.unit}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={priorityBadge.className}>{priorityBadge.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {item.net_quantity_to_purchase > 0 && (
                            <Button variant="outline" size="sm">
                              Crear Orden
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            Ver Detalle
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Diálogo de Error */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error en el cálculo</AlertDialogTitle>
            <AlertDialogDescription>
              {error || "Ha ocurrido un error desconocido al calcular las necesidades de compra."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowErrorDialog(false)}>Entendido</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export const Route = createFileRoute("/purchases/purchase-calculation/")({
  component: RouteComponent,
});
