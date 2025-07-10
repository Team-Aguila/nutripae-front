import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, FileText, Truck, X, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import {
  getPurchaseOrders,
  markPurchaseOrderAsShipped,
  cancelPurchaseOrder,
  type PurchaseOrder,
} from "@/features/purchases/purchase-orders/api/purchaseOrders";

function RouteComponent() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    provider: "all",
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getPurchaseOrders({
          limit: 100,
          offset: 0,
        });
        setOrders(response?.orders || []);
      } catch (err) {
        setError("Error al cargar las órdenes de compra");
        console.error("Error fetching purchase orders:", err);
        setOrders([]); // Asegurar que orders sea un array vacío en caso de error
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleMarkAsShipped = async (orderId: string) => {
    try {
      await markPurchaseOrderAsShipped(orderId);
      // Refresh orders after marking as shipped
      const response = await getPurchaseOrders({ limit: 100, offset: 0 });
      setOrders(response?.orders || []);
    } catch (err) {
      console.error("Error marking order as shipped:", err);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelPurchaseOrder(orderId);
      // Refresh orders after cancelling
      const response = await getPurchaseOrders({ limit: 100, offset: 0 });
      setOrders(response?.orders || []);
    } catch (err) {
      console.error("Error cancelling order:", err);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800", label: "Pendiente" },
      confirmed: { variant: "default" as const, className: "bg-blue-100 text-blue-800", label: "Confirmado" },
      shipped: { variant: "default" as const, className: "bg-blue-100 text-blue-800", label: "Enviado" },
      delivered: { variant: "default" as const, className: "bg-green-100 text-green-800", label: "Entregado" },
      cancelled: { variant: "destructive" as const, className: "bg-red-100 text-red-800", label: "Cancelado" },
    };
    return config[status as keyof typeof config] || config["pending"];
  };

  const filteredOrders = (orders || []).filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(filters.search.toLowerCase()) ||
      order.provider_name.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = filters.status === "all" || order.status === filters.status;
    const matchesProvider = filters.provider === "all" || order.provider_name === filters.provider;

    return matchesSearch && matchesStatus && matchesProvider;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <SiteHeader
        items={[
          { label: "Compras", href: "/purchases" },
          { label: "Órdenes de Compra", isCurrentPage: true },
        ]}
      />

      <div className="mt-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Órdenes de Compra</h1>
            <p className="text-gray-600">Gestión de órdenes de compra para proveedores</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nueva Orden
          </Button>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Órdenes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(orders || []).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {(orders || []).filter((order) => order.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Enviadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {(orders || []).filter((order) => order.status === "shipped").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Entregadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {(orders || []).filter((order) => order.status === "delivered").length}
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
              <Label htmlFor="search">Buscar orden o proveedor</Label>
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
              <Label htmlFor="status">Estado</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="confirmed">Confirmado</SelectItem>
                  <SelectItem value="shipped">Enviado</SelectItem>
                  <SelectItem value="delivered">Entregado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="provider">Proveedor</Label>
              <Select value={filters.provider} onValueChange={(value) => setFilters({ ...filters, provider: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los proveedores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {[...new Set((orders || []).map((order) => order.provider_name))].map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de órdenes */}
      <Card>
        <CardHeader>
          <CardTitle>Órdenes de Compra</CardTitle>
          <CardDescription>
            Mostrando {filteredOrders.length} de {orders.length} órdenes
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número de Orden</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Fecha Orden</TableHead>
                <TableHead>Fecha Entrega</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      {order.order_number}
                    </div>
                  </TableCell>
                  <TableCell>{order.provider_name}</TableCell>
                  <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(order.expected_delivery_date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">${order.total_amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(order.status).className}>
                      {getStatusBadge(order.status).label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {order.status === "pending" && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleMarkAsShipped(order._id)}>
                            <Truck className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleCancelOrder(order._id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/purchases/orders/")({
  component: RouteComponent,
});
