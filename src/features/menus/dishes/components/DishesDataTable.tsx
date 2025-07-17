"use client";

import * as React from "react";
import {
  type SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from "lucide-react";
import { getDishColumns } from "./dishColumns";
import type { DishResponse } from "@team-aguila/pae-menus-client";

interface DataTableProps {
  data: DishResponse[];
  onEdit: (dish: DishResponse) => void;
  onToggleStatus: (dish: DishResponse) => void;
  onViewDetails: (dish: DishResponse) => void;
}

export function DishesDataTable({ data, onEdit, onToggleStatus, onViewDetails }: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "active">("all");

  // Filtrar datos por estado
  const filteredData = React.useMemo(() => {
    if (statusFilter === "active") {
      return data.filter((dish) => dish.status === "active");
    }
    return data;
  }, [data, statusFilter]);

  const columns = React.useMemo(
    () => getDishColumns({ onEdit, onToggleStatus, onViewDetails }),
    [onEdit, onToggleStatus, onViewDetails]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      globalFilter,
    },
  });

  return (
    <div id="dishes-data-table" className="space-y-4">
      {/* Filtros */}
      <div id="dishes-filters" className="flex items-center justify-between space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="dishes-search-input"
            placeholder="Buscar platos..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center space-x-2 text-white">
          <span className="text-xs font-medium">Estado:</span>
          <div id="dishes-status-filter" className="flex rounded-md border border-gray-300 bg-secondary p-0.5 shadow-sm">
            <Button
              id="dishes-filter-all"
              variant={statusFilter === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setStatusFilter("all")}
              className={`h-6 px-2 text-xs ${statusFilter === "all"
                ? "bg-blue-600 hover:bg-blue-700 shadow-sm"
                : "hover:text-gray-400 hover:bg-gray-100"
              }`}
            >
              Todos
            </Button>
            <Button
              id="dishes-filter-active"
              variant={statusFilter === "active" ? "default" : "ghost"}
              size="sm"
              onClick={() => setStatusFilter("active")}
              className={`h-6 px-2 text-xs ${statusFilter === "active"
                ? "bg-green-600 hover:bg-green-700 shadow-sm"
                : "hover:text-gray-400 hover:bg-gray-100"
              }`}
            >
              Solo activos
            </Button>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="rounded-md border">
        <Table id="dishes-table">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody id="dishes-table-body">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div id="dishes-pagination" className="flex items-center justify-end space-x-2 py-4">
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Filas por página</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger id="dishes-page-size-select" className="h-8 w-[70px]">
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
              id="dishes-first-page-button"
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Ir a la primera página</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              id="dishes-previous-page-button"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Ir a la página anterior</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              id="dishes-next-page-button"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Ir a la página siguiente</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              id="dishes-last-page-button"
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
    </div>
  );
}
