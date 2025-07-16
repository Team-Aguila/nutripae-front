import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import type { DailyAvailabilityDetails } from "../../types";

interface GetColumnsProps {
  onEdit: (availability: DailyAvailabilityDetails) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

export const columns = ({ onEdit, onDelete, isLoading }: GetColumnsProps): ColumnDef<DailyAvailabilityDetails>[] => [
  {
    accessorKey: "employee.full_name",
    header: "Empleado",
    enableColumnFilter: true,
    cell: ({ row }) => {
      const availability = row.original;
      return (
        <div>
          <div className="font-medium">{availability.employee.full_name}</div>
          <div className="text-xs text-muted-foreground">ID: {availability.employee_id}</div>
        </div>
      );
    },
    filterFn: (row, id, filterValue) => {
      const value = row.original.employee?.full_name ?? "";
      return value.toLowerCase().includes((filterValue ?? "").toLowerCase());
    },
  },
  {
    accessorKey: "date",
    header: "Fecha",
    enableColumnFilter: true,
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return <div className="text-sm">{date.toLocaleDateString("es-ES")}</div>;
    },
    filterFn: (row, id, filterValue) => {
      const value = row.getValue(id) as string;
      return value?.toLowerCase().includes((filterValue ?? "").toLowerCase());
    },
  },
  {
    accessorKey: "status.name",
    header: "Disponibilidad",
    enableColumnFilter: true,
    cell: ({ row }) => {
      const availability = row.original;
      const status = availability.status.name;
      const getStatusVariant = (status: string) => {
        switch (status.toLowerCase()) {
        case "disponible":
        case "available":
          return "default";
        case "no disponible":
        case "unavailable":
          return "destructive";
        case "parcialmente disponible":
        case "partially available":
          return "secondary";
        case "ausente por enfermedad":
        case "sick leave":
          return "destructive";
        default:
          return "outline";
        }
      };
      return <Badge variant={getStatusVariant(status)}>{status}</Badge>;
    },
    filterFn: (row, id, filterValue) => {
      const value = row.getValue(id) as string;
      return value?.toLowerCase().includes((filterValue ?? "").toLowerCase());
    },
  },
  {
    accessorKey: "notes",
    header: "Notas",
    enableColumnFilter: true,
    cell: ({ row }) => {
      const notes = row.getValue("notes") as string;
      return notes ? (
        <div className="text-sm max-w-[200px] truncate" title={notes}>
          {notes}
        </div>
      ) : (
        <div className="text-muted-foreground">-</div>
      );
    },
    filterFn: (row, id, filterValue) => {
      const value = row.getValue(id) as string;
      return value?.toLowerCase().includes((filterValue ?? "").toLowerCase());
    },
  },
  {
    id: "actions",
    header: "Acciones",
    enableColumnFilter: false,
    cell: ({ row }) => {
      const availability = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading}>
              <span className="sr-only">Abrir menú</span>
              ...
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(availability)} disabled={isLoading}>
              Editar Disponibilidad
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(availability.id)} className="text-red-600" disabled={isLoading}>
              Eliminar Disponibilidad
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
