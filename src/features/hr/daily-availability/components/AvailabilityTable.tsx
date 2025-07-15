import React, { useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal, Edit, Trash2, ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DailyAvailabilityDetails } from "../../types";

interface AvailabilityTableProps {
  data: DailyAvailabilityDetails[];
  onAssignTask: (employeeId: number) => void;
  onEdit?: (availability: DailyAvailabilityDetails) => void;
  onDelete?: (availabilityId: number) => void;
}

const AvailabilityTable: React.FC<AvailabilityTableProps> = ({ 
  data, 
  onAssignTask, 
  onEdit = () => console.log("Editar no implementado"),
  onDelete = () => console.log("Eliminar no implementado")
}) => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const columns: ColumnDef<DailyAvailabilityDetails>[] = [
    {
      accessorKey: "employee.full_name",
      header: "Empleado",
      cell: ({ row }) => {
        const availability = row.original;
        return (
          <div>
            <div className="font-medium">{availability.employee.full_name}</div>
            <div className="text-xs text-muted-foreground">ID: {availability.employee_id}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "date",
      header: "Fecha",
      cell: ({ row }) => {
        const date = new Date(row.getValue("date"));
        return <div className="text-sm">{date.toLocaleDateString("es-ES")}</div>;
      },
    },
    {
      accessorKey: "status.name",
      header: "Disponibilidad",
      cell: ({ row }) => {
        const availability = row.original;
        const status = availability.status.name;
        // Mapear estados a variantes de badge
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
            default:
              return "outline";
          }
        };
        return <Badge variant={getStatusVariant(status)}>{status}</Badge>;
      },
    },
    {
      accessorKey: "notes",
      header: "Notas",
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
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const availability = row.original;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(availability)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAssignTask(availability.employee_id)}>
                <ClipboardList className="mr-2 h-4 w-4" />
                Asignar Tarea
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(availability.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination },
    onPaginationChange: setPagination,
  });

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No hay disponibilidades registradas para estas fechas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Filas por página</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Ir a la primera página</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Ir a la página anterior</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Ir a la página siguiente</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Ir a la última página</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityTable;
