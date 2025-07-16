"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { MenuScheduleResponse } from "../api/getMenuSchedules";
import { MoreHorizontal, Pencil, Trash2, XCircle, Calendar, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface GetColumnsProps {
  onEdit: (schedule: MenuScheduleResponse) => void;
  onCancel: (schedule: MenuScheduleResponse) => void;
  onDelete: (schedule: MenuScheduleResponse) => void;
}

const STATUS_LABELS = {
  active: "Activo",
  future: "Futuro",
  completed: "Completado",
  cancelled: "Cancelado",
};

export const getMenuScheduleColumns = ({
  onEdit,
  onCancel,
  onDelete,
}: GetColumnsProps): ColumnDef<MenuScheduleResponse>[] => [
    {
      accessorKey: "menu_cycle_id",
      header: "Ciclo de Menú",
      cell: ({ row }) => {
        const menuCycleId = row.getValue("menu_cycle_id") as string;
        return <div className="font-medium">{menuCycleId.slice(-8)}</div>;
      },
    },
    {
      accessorKey: "coverage",
      header: "Cobertura",
      cell: ({ row }) => {
        const coverage = row.getValue("coverage") as Array<{ location_name: string; location_type: string }>;
        const count = coverage.length;
        return (
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {count} ubicación{count !== 1 ? "es" : ""}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "start_date",
      header: "Fecha Inicio",
      cell: ({ row }) => {
        const date = new Date(row.getValue("start_date"));
        return (
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{date.toLocaleDateString("es-ES")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "end_date",
      header: "Fecha Fin",
      cell: ({ row }) => {
        const date = new Date(row.getValue("end_date"));
        return (
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{date.toLocaleDateString("es-ES")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.getValue("status") as keyof typeof STATUS_LABELS;
        const getVariant = () => {
          switch (status) {
            case "active":
              return "default";
            case "future":
              return "secondary";
            case "completed":
              return "outline";
            case "cancelled":
              return "destructive";
            default:
              return "secondary";
          }
        };

        return (
          <Badge variant={getVariant()} className="text-xs">
            {STATUS_LABELS[status] || status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Creado",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return <span className="text-sm">{date.toLocaleDateString("es-ES")}</span>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const schedule = row.original;
        const canCancel = schedule.status === "active" || schedule.status === "future";
        const canEdit = schedule.status !== "completed" && schedule.status !== "cancelled";

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button id={`menu-schedule-actions-${schedule._id}`} variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              {canEdit && (
                <>
                  <DropdownMenuItem id={`menu-schedule-edit-${schedule._id}`} onClick={() => onEdit(schedule)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              {canCancel && (
                <>
                  <DropdownMenuItem id={`menu-schedule-cancel-${schedule._id}`} onClick={() => onCancel(schedule)} className="text-orange-600">
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancelar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem id={`menu-schedule-delete-${schedule._id}`} onClick={() => onDelete(schedule)} className="text-red-600 focus:text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
