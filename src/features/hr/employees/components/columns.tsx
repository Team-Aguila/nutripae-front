import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import type { ColumnDef } from "@tanstack/react-table";
import type { Employee } from "../../types";

interface GetColumnsProps {
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

export const getColumns = ({ onEdit, onDelete }: GetColumnsProps): ColumnDef<Employee>[] => [
  {
    accessorKey: "document_number",
    header: "Nº Documento",
    cell: ({ row }) => {
      const employee = row.original;
      return (
        <div className="font-mono text-sm">
          <div className="font-medium">{employee.document_number}</div>
          <div className="text-xs text-muted-foreground">{employee.document_type.name}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "full_name",
    header: "Nombre Completo",
    cell: ({ row }) => {
      const employee = row.original;
      return (
        <div>
          <div className="font-medium">{employee.full_name}</div>
          <div className="text-xs text-muted-foreground">{employee.operational_role.name}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "hire_date",
    header: "Fecha Contratación",
    cell: ({ row }) => {
      const date = new Date(row.getValue("hire_date"));
      return <div className="text-sm">{date.toLocaleDateString("es-ES")}</div>;
    },
  },
  {
    accessorKey: "phone_number",
    header: "Teléfono",
    cell: ({ row }) => {
      const phone = row.getValue("phone_number") as string;
      return phone ? <div className="text-sm">{phone}</div> : <div className="text-muted-foreground">-</div>;
    },
  },
  {
    accessorKey: "is_active",
    header: "Estado",
    cell: ({ row }) => {
      const isActive = row.getValue("is_active") as boolean;
      return <Badge variant={isActive ? "default" : "destructive"}>{isActive ? "Activo" : "Inactivo"}</Badge>;
    },
    filterFn: (row, columnId, filterValue) => {
      const isActive = row.getValue(columnId) as boolean;
      return filterValue === "Activo" ? isActive : !isActive;
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "actions",
    header: "Acciones",
    enableColumnFilter: false, // Deshabilitar el filtro para esta columna
    cell: ({ row }) => {
      const employee = row.original;
      return (
        <div className="flex gap-2">
          {/* El botón de editar siempre visible */}
          <Button
            data-testid="edit-employee-btn"
            variant="outline"
            size="sm"
            style={{ display: "inline-flex" }}
            onClick={() => onEdit(employee)}
          >
            Editar
          </Button>
          <Button
            data-testid="delete-employee-btn"
            variant="destructive"
            size="sm"
            style={{ display: "inline-flex" }}
            onClick={() => onDelete(String(employee.id))}
          >
            Eliminar
          </Button>
        </div>
      );
    },
  },
];
