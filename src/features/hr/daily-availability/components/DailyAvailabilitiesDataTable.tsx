import * as React from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  type ColumnFiltersState,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { EnrichedDailyAvailabilityDetails } from "../hooks/useEnrichedDailyAvailabilities";

interface DailyAvailabilitiesDataTableProps {
  data: EnrichedDailyAvailabilityDetails[];
  onEdit?: (availability: EnrichedDailyAvailabilityDetails) => void;
}

export const DailyAvailabilitiesDataTable: React.FC<DailyAvailabilitiesDataTableProps> = ({
  data,
}) => {
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const columns: ColumnDef<EnrichedDailyAvailabilityDetails>[] = React.useMemo(
    () => [
      {
        accessorKey: "employee",
        header: "Empleado",
        size: 220,
        enableColumnFilter: false,
        cell: ({ row }) => {
          const availability = row.original;
          const employee = availability.employee;
          return (
            <div>
              <div className="font-medium">{employee.full_name}</div>
              <div className="text-xs text-muted-foreground">{employee.document_number || `ID: ${employee.id}`}</div>
            </div>
          );
        },
      },
      {
        accessorKey: "role",
        header: "Rol",
        size: 160,
        enableColumnFilter: false,
        cell: ({ row }) => {
          const availability = row.original;
          return <Badge variant="outline">{availability.employee.operational_role.name}</Badge>;
        },
      },
      {
        accessorKey: "date",
        header: "Fecha",
        size: 130,
        enableColumnFilter: false,
        cell: ({ row }) => {
          const date = new Date(row.getValue("date"));
          return <div className="text-sm">{date.toLocaleDateString("es-ES")}</div>;
        },
      },
      {
        accessorKey: "status",
        header: "Disponibilidad",
        size: 180,
        enableColumnFilter: false,
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
        enableColumnFilter: false,
        size: 250,
        cell: ({ row }) => {
          const notes = row.getValue("notes") as string;
          return notes ? (
            <div className="text-sm max-w-[250px] break-words overflow-hidden" title={notes}>
              <div
                className="text-sm leading-tight"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {notes.length > 80 ? `${notes.substring(0, 80)}...` : notes}
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground">-</div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableColumnFilters: false,
    enableFilters: false,
    columnResizeMode: "onChange",
    state: {
      pagination,
      sorting,
      columnFilters,
      globalFilter,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="w-full">
      <div className="rounded-md border overflow-hidden">
        <Table style={{ tableLayout: "fixed", width: "100%" }}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{
                      width: header.getSize(),
                      minWidth: header.getSize(),
                      maxWidth: header.getSize(),
                    }}
                    className="px-4 py-4"
                  >
                    {header.isPlaceholder ? null : (
                      <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                    )}
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
                    <TableCell
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                        minWidth: cell.column.getSize(),
                        maxWidth: cell.column.getSize(),
                      }}
                      className="overflow-hidden px-4 py-4"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
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
