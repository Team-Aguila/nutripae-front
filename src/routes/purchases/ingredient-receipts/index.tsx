import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Search, Package, Calendar, User, Building, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  getIngredientReceiptsByInstitution,
  type IngredientReceiptResponse,
  type ReceivedItem,
} from "@/features/purchases/ingredient-receipts/api/ingredientReceipts";
import { getInstitutions } from "@/features/coverage/institutions/api/getInstitutions";
import { getInstitutionsByTown } from "@/features/coverage/institutions/api/getInstitutionsByTown";
import { getTowns } from "@/features/coverage/towns/api/getTowns";
import type { InstitutionResponseWithDetails, TownResponseWithDetails } from "@team-aguila/pae-cobertura-client";

function RouteComponent() {
  const [receipts, setReceipts] = useState<IngredientReceiptResponse[]>([]);
  const [institutions, setInstitutions] = useState<InstitutionResponseWithDetails[]>([]);
  const [towns, setTowns] = useState<TownResponseWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingInstitutions, setLoadingInstitutions] = useState(true);
  const [loadingTowns, setLoadingTowns] = useState(true);
  const [institutionsError, setInstitutionsError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    town: "all",
  });

  const [selectedInstitution, setSelectedInstitution] = useState<number | null>(null);

  // Cargar towns disponibles
  useEffect(() => {
    async function fetchTowns() {
      try {
        setLoadingTowns(true);
        console.log("🏘️ Cargando towns disponibles...");

        const townsData = await getTowns();
        console.log("📋 Towns recibidos:", townsData);

        setTowns(townsData);
      } catch (err) {
        console.error("❌ Error fetching towns:", err);
        setTowns([]);
      } finally {
        setLoadingTowns(false);
      }
    }

    fetchTowns();
  }, []);

  // Cargar instituciones disponibles usando la estrategia recomendada
  useEffect(() => {
    async function fetchInstitutions() {
      try {
        setLoadingInstitutions(true);
        setInstitutionsError(null);
        console.log("🏢 Cargando instituciones disponibles...");

        let institutionsData: InstitutionResponseWithDetails[] = [];

        // Estrategia 1: Intentar obtener todas las instituciones
        try {
          console.log("📋 Intentando obtener todas las instituciones...");
          institutionsData = await getInstitutions();
          console.log("✅ Instituciones obtenidas exitosamente:", institutionsData.length);
        } catch (generalError) {
          console.log("⚠️ Error al obtener todas las instituciones, probando con towns...");
          
          // Estrategia 2: Si falla, obtener por towns
          if (towns.length > 0) {
            console.log("📋 Obteniendo instituciones por towns...");
            for (const town of towns) {
              try {
                const townInstitutions = await getInstitutionsByTown(town.id);
                institutionsData.push(...townInstitutions);
                console.log(`✅ Instituciones de ${town.name}:`, townInstitutions.length);
              } catch (townError) {
                console.log(`⚠️ Error al obtener instituciones de ${town.name}:`, townError);
              }
            }
          } else {
            throw generalError;
          }
        }

        setInstitutions(institutionsData);
        console.log("📊 Total de instituciones cargadas:", institutionsData.length);

        // Seleccionar la primera institución automáticamente si hay instituciones disponibles
        if (institutionsData.length > 0 && !selectedInstitution) {
          setSelectedInstitution(institutionsData[0].id);
        }
      } catch (err) {
        console.error("❌ Error fetching institutions:", err);
        setInstitutionsError(err instanceof Error ? err.message : "Error al cargar instituciones");
        setInstitutions([]);
      } finally {
        setLoadingInstitutions(false);
      }
    }

    // Solo ejecutar si los towns ya se han cargado (o si falla la carga de towns)
    if (!loadingTowns) {
      fetchInstitutions();
    }
  }, [loadingTowns, towns, selectedInstitution]);

  // Cargar recepciones de ingredientes
  useEffect(() => {
    async function fetchReceipts() {
      if (!selectedInstitution) {
        setReceipts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log("🔍 Iniciando carga de recepciones de ingredientes...");
        console.log("📋 Consultando recepciones para institución:", selectedInstitution);

        const data = await getIngredientReceiptsByInstitution(selectedInstitution, { limit: 100 });
        console.log("📦 Datos recibidos de la API:", data);
        console.log("📊 Cantidad de recepciones:", data.length);

        setReceipts(data);
      } catch (err) {
        console.error("❌ Error fetching ingredient receipts:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
        setShowErrorDialog(true);
      } finally {
        setLoading(false);
      }
    }

    fetchReceipts();
  }, [selectedInstitution]);

  // Filtrar instituciones por town seleccionado
  const filteredInstitutions = institutions.filter(institution => {
    if (filters.town === "all") return true;
    return institution.town_id === parseInt(filters.town);
  });

  // Actualizar institución seleccionada cuando cambia el filtro de town
  useEffect(() => {
    if (filters.town !== "all" && filteredInstitutions.length > 0) {
      const firstInstitution = filteredInstitutions[0];
      if (selectedInstitution !== firstInstitution.id) {
        setSelectedInstitution(firstInstitution.id);
      }
    } else if (filters.town === "all" && institutions.length > 0) {
      if (!selectedInstitution || !institutions.find(inst => inst.id === selectedInstitution)) {
        setSelectedInstitution(institutions[0].id);
      }
    }
  }, [filters.town, filteredInstitutions, institutions, selectedInstitution]);

  const getStatusBadge = () => {
    // Como no tenemos status en la API, asumimos que todos están completados
    return { variant: "default" as const, className: "bg-green-100 text-green-800", label: "Completado" };
  };

  const getTotalQuantity = (items: ReceivedItem[]) => {
    if (!items || items.length === 0) return "0 kg";
    const total = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    return `${total} ${items[0]?.unit || "kg"}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES");
  };

  const filteredReceipts =
    receipts?.filter((receipt) => {
      const matchesSearch =
        receipt._id.toLowerCase().includes(filters.search.toLowerCase()) ||
        receipt.delivery_person_name.toLowerCase().includes(filters.search.toLowerCase());
      // Como no tenemos status en la API, todos los filtros de status pasan
      const matchesStatus = filters.status === "all" || filters.status === "completed";

      return matchesSearch && matchesStatus;
    }) || [];

  if (loadingInstitutions || loadingTowns) {
    return (
      <div className="p-6">
        <SiteHeader
          items={[
            { label: "Compras", href: "/purchases" },
            { label: "Recepciones de Ingredientes", isCurrentPage: true },
          ]}
        />
        <div className="mt-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>
              {loadingTowns && loadingInstitutions 
                ? "Cargando towns e instituciones..." 
                : loadingTowns 
                  ? "Cargando towns..." 
                  : "Cargando instituciones..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (institutionsError) {
    return (
      <div className="p-6">
        <SiteHeader
          items={[
            { label: "Compras", href: "/purchases" },
            { label: "Recepciones de Ingredientes", isCurrentPage: true },
          ]}
        />
        <div className="mt-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Building className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Servicio de Instituciones No Disponible</h3>
            <p className="text-gray-500 mb-6">
              No se pudo conectar con el servicio de cobertura para cargar las instituciones.
              <br />
              Verifique que el servicio esté en funcionamiento y que haya instituciones configuradas.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-red-600">Error: {institutionsError}</p>
              <p className="text-sm text-gray-500">
                Se intentó cargar desde: {towns.length > 0 ? `${towns.length} towns` : "servicio general"}
              </p>
              <Button onClick={() => window.location.reload()}>Reintentar</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (institutions.length === 0) {
    return (
      <div className="p-6">
        <SiteHeader
          items={[
            { label: "Compras", href: "/purchases" },
            { label: "Recepciones de Ingredientes", isCurrentPage: true },
          ]}
        />
        <div className="mt-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No hay instituciones disponibles</h3>
            <p className="text-gray-500 mb-6">
              Para usar la vista de recepciones de ingredientes, primero necesitas crear instituciones en el sistema de
              cobertura.
            </p>
            <Button onClick={() => window.location.reload()}>Recargar</Button>
          </div>
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
            { label: "Recepciones de Ingredientes", isCurrentPage: true },
          ]}
        />
        <div className="mt-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Cargando recepciones de ingredientes...</p>
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
          { label: "Recepciones de Ingredientes", isCurrentPage: true },
        ]}
      />

      <div className="mt-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Recepciones de Ingredientes</h1>
            <p className="text-gray-600">
              {selectedInstitution ? (
                <>
                  Institución: {institutions.find((inst) => inst.id === selectedInstitution)?.name || "Seleccione una institución"}
                  {filters.town !== "all" && (
                    <> | Municipio: {towns.find((town) => town.id === parseInt(filters.town))?.name}</>
                  )}
                </>
              ) : (
                "Seleccione una institución para ver las recepciones"
              )}
              <br />
              Registro y gestión de recepciones de ingredientes desde proveedores
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nueva Recepción
          </Button>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Recepciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{receipts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{receipts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {receipts.reduce((sum, receipt) => sum + (receipt.items?.length || 0), 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Última Recepción</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium text-gray-600">
              {receipts.length > 0 ? formatDate(receipts[0].receipt_date) : "N/A"}
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Buscar recepción o persona</Label>
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
              <Label htmlFor="town">Municipio</Label>
              <Select
                value={filters.town}
                onValueChange={(value) => setFilters({ ...filters, town: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar municipio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los municipios</SelectItem>
                  {towns.map((town) => (
                    <SelectItem key={town.id} value={town.id.toString()}>
                      {town.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="institution">Institución</Label>
              <Select
                value={selectedInstitution?.toString() || ""}
                onValueChange={(value) => setSelectedInstitution(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar institución" />
                </SelectTrigger>
                <SelectContent>
                  {filteredInstitutions.map((institution) => (
                    <SelectItem key={institution.id} value={institution.id.toString()}>
                      {institution.name}
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
                  <SelectItem value="Completado">Completado</SelectItem>
                  <SelectItem value="Verificando">Verificando</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de recepciones */}
      <Card>
        <CardHeader>
          <CardTitle>Recepciones de Ingredientes</CardTitle>
          <CardDescription>
            {selectedInstitution ? (
              <>
                {institutions.find((inst) => inst.id === selectedInstitution)?.name || selectedInstitution}
                {filters.town !== "all" && (
                  <> - {towns.find((town) => town.id === parseInt(filters.town))?.name}</>
                )}
                - Mostrando {filteredReceipts.length} de {receipts.length} recepciones
              </>
            ) : (
              "Seleccione una institución para ver las recepciones"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredReceipts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay recepciones de ingredientes</h3>
              <p className="text-gray-500 mb-4">
                {receipts.length === 0
                  ? "Aún no se han registrado recepciones de ingredientes."
                  : "No hay recepciones que coincidan con los filtros aplicados."}
              </p>
              <Button className="flex items-center gap-2 mx-auto">
                <Plus className="h-4 w-4" />
                Registrar Primera Recepción
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Recepción</TableHead>
                  <TableHead>Institución</TableHead>
                  <TableHead>Orden de Compra</TableHead>
                  <TableHead>Persona de Entrega</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReceipts.map((receipt) => {
                  const statusBadge = getStatusBadge();
                  return (
                    <TableRow key={receipt._id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-gray-500" />
                          {receipt._id.slice(-8)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-500" />
                          {institutions.find((inst) => inst.id === receipt.institution_id)?.name ||
                            `Institución ${receipt.institution_id}`}
                        </div>
                      </TableCell>
                      <TableCell>
                        {receipt.purchase_order_id ? (
                          <span className="text-blue-600">{receipt.purchase_order_id}</span>
                        ) : (
                          <span className="text-gray-400">Sin orden</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          {receipt.delivery_person_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          {formatDate(receipt.receipt_date)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="font-medium">{receipt.items?.length || 0}</div>
                          <div className="text-sm text-gray-500">{getTotalQuantity(receipt.items || [])}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            Ver Detalles
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
            <AlertDialogTitle>Error al cargar las recepciones</AlertDialogTitle>
            <AlertDialogDescription>
              {error || "Ha ocurrido un error desconocido al cargar las recepciones de ingredientes."}
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

export const Route = createFileRoute("/purchases/ingredient-receipts/")({
  component: RouteComponent,
});
