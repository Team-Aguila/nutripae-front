"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { IngredientResponse } from "@team-aguila/pae-menus-client";
import { MoreHorizontal, Pencil, Trash2, Eye, ToggleLeft, ToggleRight } from "lucide-react";

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
  onEdit: (ingredient: IngredientResponse) => void;
  onDelete: (ingredient: IngredientResponse) => void;
  onToggleStatus: (ingredient: IngredientResponse) => void;
  onViewDetails?: (ingredient: IngredientResponse) => void;
}

export const getColumns = ({
  onEdit,
  onDelete,
  onToggleStatus,
  onViewDetails,
}: GetColumnsProps): ColumnDef<IngredientResponse>[] => [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "category",
    header: "Categoría",
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      return category ? (
        <Badge variant="secondary">{category}</Badge>
      ) : (
        <span className="text-gray-400">Sin categoría</span>
      );
    },
  },
  {
    accessorKey: "base_unit_of_measure",
    header: "Unidad",
    cell: ({ row }) => <span className="text-sm">{row.getValue("base_unit_of_measure")}</span>,
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={status === "active" ? "default" : "secondary"}
          className={status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
        >
          <span
            className="ingredient-status-label"
          >
            {status === "active" ? "Activo" : "Inactivo"}
          </span>
        </Badge>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return description ? (
        <span className="text-sm text-gray-600 truncate max-w-[200px] block">{description}</span>
      ) : (
        <span className="text-gray-400">-</span>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Creado",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return <span className="text-sm">{date.toLocaleDateString()}</span>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const ingredient = row.original;
      const isActive = ingredient.status === "active";

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" id="actions-menu">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            {onViewDetails && (
              <>
                <DropdownMenuItem onClick={() => onViewDetails(ingredient)}>
                  <Eye className="mr-2 h-4 w-4" />
                    Ver detalles
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={() => onEdit(ingredient)} id="edit-ingredient">
              <Pencil className="mr-2 h-4 w-4" />
                Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleStatus(ingredient)} id="toggle-status-ingredient">
              {isActive ? (
                <>
                  <ToggleLeft className="mr-2 h-4 w-4" />
                    Desactivar
                </>
              ) : (
                <>
                  <ToggleRight className="mr-2 h-4 w-4" />
                    Activar
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(ingredient)} className="text-red-600 focus:text-red-600" id="delete-ingredient">
              <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
