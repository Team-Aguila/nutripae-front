import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Plus, Search, Filter, FileText, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { getPurchaseOrders, type PurchaseOrder, type GetPurchaseOrdersParams } from "../api/purchaseOrders";
import { CreatePurchaseOrderDialog } from "../components/CreatePurchaseOrderDialog";

const statusConfig = {
  pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  confirmed: { label: "Confirmada", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  shipped: { label: "Enviada", color: "bg-purple-100 text-purple-800", icon: Truck },
  delivered: { label: "Entregada", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "Cancelada", color: "bg-red-100 text-red-800", icon: XCircle },
};

export function PurchaseOrdersPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [institutionFilter, setInstitutionFilter] = useState<string>("all");

  // Estado para el diálogo de crear orden
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Ref para controlar la carga inicial y evitar duplicados
  const initialLoadRef = useRef(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const limit = 10;

  const loadOrders = async (page = 0, filters: Partial<GetPurchaseOrdersParams> = {}) => {
    try {
      setLoading(true);
      const params: GetPurchaseOrdersParams = {
        limit,
        offset: page * limit,
        ...filters,
      };
      const response = await getPurchaseOrders(params);
      setOrders(response.orders);
      setTotalCount(response.total_count);
      setHasNext(response.page_info.has_next);
      setHasPrevious(response.page_info.has_previous);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error loading purchase orders:", error);
      toast.error("Error al cargar las órdenes de compra");
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos iniciales solo una vez
  useEffect(() => {
    // Verificar si ya se hizo la carga inicial para evitar llamadas duplicadas en StrictMode
    if (initialLoadRef.current) {
      return;
    }
    initialLoadRef.current = true;
    loadOrders(0);
  }, []); // Sin dependencias para evitar cargas duplicadas

  // Debug para el estado del diálogo
  useEffect(() => {}, [showCreateDialog]);

  const handleSearch = () => {
    const filters: Partial<GetPurchaseOrdersParams> = {};

    if (statusFilter && statusFilter !== "all") {
      filters.status = statusFilter as PurchaseOrder["status"];
    }

    if (institutionFilter && institutionFilter !== "all") {
      filters.institution_id = Number(institutionFilter);
    }

    loadOrders(0, filters);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setInstitutionFilter("all");

    loadOrders(0);
  };

  const handleOrderCreated = () => {
    // Recargar la primera página para mostrar la nueva orden
    loadOrders(0);
  };

  const handleCreateOrderClick = () => {
    setShowCreateDialog(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: PurchaseOrder["status"]) => {
    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Órdenes de Compra</h1>
          <p className="text-gray-600 mt-1">Gestiona y monitorea las órdenes de compra del sistema PAE</p>
        </div>
        <Button className="flex items-center gap-2" type="button" onClick={handleCreateOrderClick}>
          <Plus className="w-4 h-4" />
          Nueva Orden
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros de Búsqueda
          </CardTitle>
          <CardDescription>Filtra las órdenes por estado, institución o número de orden</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Buscar por número</Label>
              <Input
                id="search"
                placeholder="Número de orden..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="status">Estado</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="confirmed">Confirmada</SelectItem>
                  <SelectItem value="shipped">Enviada</SelectItem>
                  <SelectItem value="delivered">Entregada</SelectItem>
                  <SelectItem value="cancelled">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="institution">Institución</Label>
              <Select value={institutionFilter} onValueChange={setInstitutionFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Todas las instituciones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las instituciones</SelectItem>
                  <SelectItem value="1">Institución 1</SelectItem>
                  <SelectItem value="2">Institución 2</SelectItem>
                  <SelectItem value="3">Institución 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 items-end">
              <Button onClick={handleSearch} className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Buscar
              </Button>
              <Button variant="outline" onClick={handleClearFilters}>
                Limpiar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de órdenes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Lista de Órdenes
            </div>
            <div className="text-sm text-gray-500">{totalCount} órdenes encontradas</div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Cargando órdenes...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No se encontraron órdenes</h3>
              <p>No hay órdenes de compra que coincidan con los filtros aplicados.</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Institución</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Entrega Esperada</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Monto Total</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">{order.order_number}</TableCell>
                      <TableCell>{order.provider_name}</TableCell>
                      <TableCell>{order.institution_name}</TableCell>
                      <TableCell>{formatDate(order.order_date)}</TableCell>
                      <TableCell>{formatDate(order.expected_delivery_date)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(order.total_amount)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Ver
                          </Button>
                          {order.status === "pending" && (
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Paginación */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">
                  Mostrando {currentPage * limit + 1} a {Math.min((currentPage + 1) * limit, totalCount)} de{" "}
                  {totalCount} órdenes
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadOrders(currentPage - 1)}
                    disabled={!hasPrevious || loading}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadOrders(currentPage + 1)}
                    disabled={!hasNext || loading}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Diálogo para crear nueva orden */}
      <CreatePurchaseOrderDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onOrderCreated={handleOrderCreated}
      />
    </div>
  );
}
