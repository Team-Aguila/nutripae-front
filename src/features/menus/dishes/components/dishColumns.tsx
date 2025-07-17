"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { DishResponse } from "@team-aguila/pae-menus-client";
import { MoreHorizontal, Pencil, PowerOff, Eye } from "lucide-react";

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
  onEdit: (dish: DishResponse) => void;
  onToggleStatus: (dish: DishResponse) => void;
  onViewDetails: (dish: DishResponse) => void;
}

const MEAL_TYPE_LABELS = {
  desayuno: "Desayuno",
  almuerzo: "Almuerzo",
  refrigerio: "Refrigerio",
};

export const getDishColumns = ({
  onEdit,
  onToggleStatus,
  onViewDetails,
}: GetColumnsProps): ColumnDef<DishResponse>[] => [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "compatible_meal_types",
    header: "Tipos de comida",
    cell: ({ row }) => {
      const mealTypes = row.getValue("compatible_meal_types") as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {mealTypes.map((type) => (
            <Badge key={type} variant="secondary" className="text-xs">
              {MEAL_TYPE_LABELS[type as keyof typeof MEAL_TYPE_LABELS] || type}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "recipe",
    header: "Ingredientes",
    cell: ({ row }) => {
      const recipe = row.getValue("recipe") as {
          ingredients: { ingredient_id: string; quantity: number; unit: string }[];
        };
      const count = recipe.ingredients.length;
      return (
        <span className="text-sm text-gray-600">
          {count} ingrediente{count !== 1 ? "s" : ""}
        </span>
      );
    },
  },
  {
    accessorKey: "nutritional_info",
    header: "Calorías",
    cell: ({ row }) => {
      const nutritionalInfo = row.getValue("nutritional_info") as { calories?: number } | null;
      return nutritionalInfo?.calories ? (
        <span className="text-sm">{nutritionalInfo.calories} cal</span>
      ) : (
        <span className="text-gray-400">-</span>
      );
    },
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
          {status === "active" ? "Activo" : "Inactivo"}
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
      const dish = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button id={`dish-actions-${dish._id}`} variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem id={`dish-view-details-${dish._id}`} onClick={() => onViewDetails(dish)}>
              <Eye className="mr-2 h-4 w-4" />
                Ver detalles
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem id={`dish-edit-${dish._id}`} onClick={() => onEdit(dish)}>
              <Pencil className="mr-2 h-4 w-4" />
                Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              id={`dish-toggle-status-${dish._id}`}
              onClick={() => onToggleStatus(dish)}
              className={
                dish.status === "active"
                  ? "text-orange-600 focus:text-orange-600"
                  : "text-green-600 focus:text-green-600"
              }
            >
              <PowerOff className="mr-2 h-4 w-4" />
              {dish.status === "active" ? "Desactivar" : "Activar"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
