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
import { Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Save, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { DebouncedInput } from "@/components/ui/DebouncedInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { EnrichedDailyAvailabilityDetails } from "../hooks/useEnrichedDailyAvailabilities";
import { toast } from "sonner";
import type { Column } from "@tanstack/react-table";

interface DailyAvailabilitiesDataTableProps {
  data: EnrichedDailyAvailabilityDetails[];
  onEdit?: (availability: EnrichedDailyAvailabilityDetails) => void;
  onDelete?: (availabilityId: number) => void;
}

export const DailyAvailabilitiesDataTable: React.FC<DailyAvailabilitiesDataTableProps> = ({
  data,
  onEdit = (availability) => console.log("Editar", availability),
  onDelete = (availabilityId) => {
    console.log("Eliminar disponibilidad:", availabilityId);
    toast.success("Disponibilidad eliminada exitosamente");
  },
}) => {
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [editingData, setEditingData] = React.useState<{
    status_id: number;
    notes: string;
  } | null>(null);
  const [selectOpen, setSelectOpen] = React.useState(false);

  // Estados de disponibilidad hardcodeados (podrías obtenerlos de una API)
  const availabilityStatuses = [
    { id: 1, name: "Disponible" },
    { id: 2, name: "No disponible" },
    { id: 3, name: "Parcialmente disponible" },
  ];

  const startEdit = (availability: EnrichedDailyAvailabilityDetails) => {
    setEditingId(availability.id);
    setEditingData({
      status_id: availability.status_id,
      notes: availability.notes || "",
    });
    setSelectOpen(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingData(null);
    setSelectOpen(false);
  };

  const saveEdit = (availability: EnrichedDailyAvailabilityDetails) => {
    if (editingData) {
      // Aquí harías la llamada a la API para actualizar
      console.log("Guardando cambios:", {
        id: availability.id,
        ...editingData,
      });

      // En lugar de mutar directamente, usamos el callback onEdit
      // pero no pasamos todo el objeto modificado para evitar que desaparezcan datos
      onEdit({
        ...availability,
        status_id: editingData.status_id,
        notes: editingData.notes,
        status: availabilityStatuses.find((s) => s.id === editingData.status_id) || availability.status,
      });

      setEditingId(null);
      setEditingData(null);
      setSelectOpen(false);

      toast.success("Disponibilidad actualizada exitosamente");
    }
  };

  // Componente de filtro para las columnas - copiado de EmployeesDataTable
  const Filter = ({ column }: { column: Column<any, unknown> }) => {
    const columnFilterValue = column.getFilterValue();

    return (
      <DebouncedInput
        className="w-full max-w-32 border shadow rounded text-xs"
        onChange={(value) => column.setFilterValue(value)}
        placeholder="Buscar..."
        type="text"
        value={(columnFilterValue ?? "") as string}
      />
    );
  };

  const columns: ColumnDef<EnrichedDailyAvailabilityDetails>[] = React.useMemo(
    () => [
      {
        accessorKey: "employee",
        header: "Empleado",
        size: 220,
        enableColumnFilter: true,
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
        filterFn: (row, _id, filterValue) => {
          const employee = row.original.employee;
          const searchValue = filterValue.toLowerCase();
          return (
            employee.full_name.toLowerCase().includes(searchValue) ||
            (employee.document_number && employee.document_number.toLowerCase().includes(searchValue)) ||
            employee.id.toString().includes(searchValue)
          );
        },
      },
      {
        accessorKey: "role",
        header: "Rol",
        size: 160,
        enableColumnFilter: true,
        cell: ({ row }) => {
          const availability = row.original;
          return <Badge variant="outline">{availability.employee.operational_role.name}</Badge>;
        },
        filterFn: (row, _id, filterValue) => {
          return row.original.employee.operational_role.name.toLowerCase().includes(filterValue.toLowerCase());
        },
      },
      {
        accessorKey: "date",
        header: "Fecha",
        size: 130,
        enableColumnFilter: true,
        cell: ({ row }) => {
          const date = new Date(row.getValue("date"));
          return <div className="text-sm">{date.toLocaleDateString("es-ES")}</div>;
        },
        filterFn: (row, _id, filterValue) => {
          const date = new Date(row.getValue("date"));
          const searchDate = date.toLocaleDateString("es-ES");
          return searchDate.includes(filterValue);
        },
      },
      {
        accessorKey: "status",
        header: "Disponibilidad",
        size: 180,
        enableColumnFilter: true,
        cell: ({ row }) => {
          const availability = row.original;
          const isEditing = editingId === availability.id;

          if (isEditing && editingData) {
            return (
              <Select
                value={editingData.status_id.toString()}
                onValueChange={(value) => {
                  setEditingData({
                    ...editingData,
                    status_id: parseInt(value),
                  });
                  setSelectOpen(false);
                }}
                open={selectOpen}
                onOpenChange={setSelectOpen}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-50">
                  {availabilityStatuses.map((status) => (
                    <SelectItem key={status.id} value={status.id.toString()}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          }

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
        filterFn: (row, _id, filterValue) => {
          return row.original.status.name.toLowerCase().includes(filterValue.toLowerCase());
        },
      },
      {
        accessorKey: "notes",
        header: "Notas",
        enableColumnFilter: false,
        size: 250,
        cell: ({ row }) => {
          const availability = row.original;
          const isEditing = editingId === availability.id;

          if (isEditing && editingData) {
            return (
              <div className="w-full max-w-[250px]">
                <Textarea
                  value={editingData.notes}
                  onChange={(e) =>
                    setEditingData({
                      ...editingData,
                      notes: e.target.value,
                    })
                  }
                  placeholder="Agregar notas..."
                  className="w-full min-h-[80px] resize-none text-sm"
                  rows={3}
                  autoFocus
                  onFocus={(e) => {
                    // Colocar el cursor al final del texto
                    const length = e.target.value.length;
                    e.target.setSelectionRange(length, length);
                  }}
                />
              </div>
            );
          }

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
      {
        accessorKey: "actions",
        header: "Acciones",
        enableColumnFilter: false,
        size: 140,
        cell: ({ row }) => {
          const availability = row.original;
          const isEditing = editingId === availability.id;

          if (isEditing) {
            return (
              <div className="flex gap-2 min-w-[110px]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => saveEdit(availability)}
                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                  title="Guardar"
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={cancelEdit}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  title="Cancelar"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            );
          }

          return (
            <div className="flex gap-2 min-w-[110px]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => startEdit(availability)}
                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                title="Editar"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(availability.id)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                title="Eliminar"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [editingId, editingData, selectOpen, onEdit, onDelete, availabilityStatuses]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableColumnFilters: true,
    enableFilters: true,
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
                      <div>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanFilter() ? (
                          <div className="mt-2">
                            <Filter column={header.column} />
                          </div>
                        ) : null}
                      </div>
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
