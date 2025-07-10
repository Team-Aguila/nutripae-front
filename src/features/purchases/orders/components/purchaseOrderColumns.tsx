import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Truck, X } from "lucide-react";
import type { PurchaseOrderSummary } from "@team-aguila/pae-compras-client";

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

export const purchaseOrderColumns: ColumnDef<PurchaseOrderSummary>[] = [
  {
    accessorKey: "order_number",
    header: "Número de Orden",
    cell: ({ row }) => {
      const orderNumber = row.getValue("order_number") as string;
      return <div className="font-medium">{orderNumber || "N/A"}</div>;
    },
  },
  {
    accessorKey: "provider_id",
    header: "Proveedor",
    cell: ({ row }) => {
      const providerId = row.getValue("provider_id") as string;
      // En un caso real, aquí buscarías el nombre del proveedor
      return <div>{providerId}</div>;
    },
  },
  {
    accessorKey: "purchase_order_date",
    header: "Fecha de Orden",
    cell: ({ row }) => {
      const date = row.getValue("purchase_order_date") as string;
      return <div>{new Date(date).toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "required_delivery_date",
    header: "Fecha de Entrega",
    cell: ({ row }) => {
      const date = row.getValue("required_delivery_date") as string;
      return <div>{date ? new Date(date).toLocaleDateString() : "N/A"}</div>;
    },
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      const total = row.getValue("total") as string;
      return <div className="font-medium">{total || "N/A"}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return getStatusBadge(status);
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const order = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              Ver detalles
            </DropdownMenuItem>
            {order.status === "pending" && (
              <>
                <DropdownMenuItem>
                  <Truck className="mr-2 h-4 w-4" />
                  Marcar como enviado
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <X className="mr-2 h-4 w-4" />
                  Cancelar orden
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
