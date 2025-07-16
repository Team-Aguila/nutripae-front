import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { PaginatedPurchaseOrderResponse } from "@team-aguila/pae-compras-client";

interface PurchaseOrdersDataTableProps {
  data: PaginatedPurchaseOrderResponse | undefined;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onFiltersChange: (filters: { order_number: string; status: string; provider_id: string }) => void;
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    pending: { label: "Pendiente", variant: "secondary" as const },
    shipped: { label: "Enviado", variant: "default" as const },
    completed: { label: "Completado", variant: "default" as const },
    cancelled: { label: "Cancelado", variant: "destructive" as const },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export const PurchaseOrdersDataTable = ({
  data,
  isLoading,
  onPageChange,
  onFiltersChange,
}: PurchaseOrdersDataTableProps) => {
  const [filters, setFilters] = useState({
    order_number: "",
    status: "all",
    provider_id: "all",
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const orders = data?.items || [];

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="order_number">Número de Orden</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="order_number"
                  placeholder="Buscar por número..."
                  value={filters.order_number}
                  onChange={(e) => handleFilterChange("order_number", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status">Estado</Label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="shipped">Enviado</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="provider">Proveedor</Label>
              <Select value={filters.provider_id} onValueChange={(value) => handleFilterChange("provider_id", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los proveedores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="provider1">Proveedor 1</SelectItem>
                  <SelectItem value="provider2">Proveedor 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número de Orden</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Fecha de Orden</TableHead>
                <TableHead>Fecha de Entrega</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Cargando órdenes de compra...
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No se encontraron órdenes de compra.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">{order.order_number || "N/A"}</TableCell>
                    <TableCell>{order.provider_id}</TableCell>
                    <TableCell>{new Date(order.purchase_order_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {order.required_delivery_date
                        ? new Date(order.required_delivery_date).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell className="font-medium">{order.total || "N/A"}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                          {order.status === "pending" && (
                            <>
                              <DropdownMenuItem>Marcar como enviado</DropdownMenuItem>
                              <DropdownMenuItem>Cancelar orden</DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Paginación */}
      {data && data.total > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Mostrando {(data.page - 1) * data.limit + 1} a {Math.min(data.page * data.limit, data.total)} de{" "}
            {data.total} órdenes
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(data.page - 1)}
              disabled={!data.has_previous}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-500">
                Página {data.page} de {data.total_pages}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={() => onPageChange(data.page + 1)} disabled={!data.has_next}>
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
