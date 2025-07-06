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
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { getEmployees } from "@/features/hr/employees/api/getEmployees";

interface Employee {
  id: string;
  name: string;
  // Add other fields if needed
}

interface Availability {
  id: string;
  employee_id: string;
  employee_name: string;
  date: string;
  shift: string;
  task_description: string;
}

interface AvailabilityTableProps {
  data: Availability[];
  onAssignTask: (employeeId: string) => void;
}

const AvailabilityTable: React.FC<AvailabilityTableProps> = ({ data, onAssignTask }) => {
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = React.useState(true);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  React.useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const fetchedEmployees = await getEmployees();
        setEmployees(
          fetchedEmployees.map((emp: any) => ({
            id: emp.id,
            name: emp.name ?? emp.fullName ?? "Desconocido",
          }))
        );
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setIsLoadingEmployees(false);
      }
    };

    fetchEmployees();
  }, []);

  const columns: ColumnDef<Availability>[] = [
    {
      accessorKey: "employee_id",
      header: "ID del Empleado",
    },
    {
      accessorKey: "employee_name",
      header: "Nombre del Empleado",
    },
    {
      accessorKey: "date",
      header: "Fecha",
    },
    {
      accessorKey: "shift",
      header: "Turno",
    },
    {
      accessorKey: "task_description",
      header: "Descripción de la Tarea",
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <Button
          variant="outline"
          onClick={() => onAssignTask(row.original.employee_id)}
        >
          Asignar Tarea
        </Button>
      ),
    },
  ];

  const enrichedData = data.map((availability) => {
    const employee = employees.find((emp) => emp.id === availability.employee_id);
    return {
      ...availability,
      employee_name: employee ? employee.name : "Desconocido",
    };
  });

  const table = useReactTable({
    data: enrichedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination },
    onPaginationChange: setPagination,
  });

  return (
    <div>
      {isLoadingEmployees && <p>Cargando empleados...</p>}
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
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
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
