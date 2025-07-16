import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { SiteHeader } from "@/components/site-header";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { EmployeeCreate, EmployeeUpdate, Employee } from "../../types";
import { useEmployees } from "../hooks/useEmployees";
import { createEmployee } from "../api/createEmployee";
import { updateEmployee } from "../api/updateEmployee";
import { deleteEmployee } from "../api/deleteEmployee";
import EmployeeForm from "../components/EmployeeForm";
import { EmployeeDataTable } from "../components/EmployeesDataTable";
import { getColumns } from "../components/columns";

const EmployeesPage = () => {
  const queryClient = useQueryClient();

  const { data: employees, error: errorEmployees } = useEmployees();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>(undefined);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingEmployeeId, setDeletingEmployeeId] = useState<string | undefined>(undefined);

  const createEmployeeMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Empleado creado exitosamente");
      setIsFormOpen(false);
    },
    onError: (error) => {
      console.error("Error creating employee:", error);
      toast.error("Error al crear el empleado");
    },
  });

  const updateEmployeeMutation = useMutation({
    mutationFn: (data: { id: string; employeeData: EmployeeUpdate }) =>
      updateEmployee(Number(data.id), data.employeeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Empleado actualizado exitosamente");
      setIsFormOpen(false);
    },
    onError: (error) => {
      console.error("Error updating employee:", error);
      toast.error("Error al actualizar el empleado");
    },
  });

  const deleteEmployeeMutation = useMutation({
    mutationFn: (id: string) => deleteEmployee(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Empleado eliminado exitosamente");
    },
    onError: (error) => {
      console.error("Error deleting employee:", error);
      toast.error("Error al eliminar el empleado");
    },
  });

  const handleAddClick = () => {
    setEditingEmployee(undefined);
    setIsFormOpen(true);
  };

  const handleEditClick = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingEmployeeId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingEmployeeId) {
      deleteEmployeeMutation.mutate(deletingEmployeeId);
      setIsConfirmOpen(false);
      setDeletingEmployeeId(undefined);
    }
  };

  const handleFormSubmit = (data: EmployeeCreate | EmployeeUpdate) => {
    if (editingEmployee) {
      updateEmployeeMutation.mutate({
        id: String(editingEmployee.id),
        employeeData: data as EmployeeUpdate,
      });
    } else {
      createEmployeeMutation.mutate(data as EmployeeCreate);
    }
  };

  const columns = getColumns({
    onEdit: handleEditClick,
    onDelete: handleDeleteClick,
  });

  if (errorEmployees) {
    return (
      <div className="container mx-auto py-6">
        <SiteHeader
          items={[
            { label: "Recursos Humanos", href: "/hr" },
            { label: "Empleados", isCurrentPage: true },
          ]}
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-red-600">Error al cargar empleados</h2>
            <p className="text-muted-foreground">
              {errorEmployees instanceof Error ? errorEmployees.message : "Error desconocido"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <SiteHeader
        items={[
          { label: "Recursos Humanos", href: "/hr" },
          { label: "Empleados", isCurrentPage: true },
        ]}
      />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Empleados</h1>
          <p className="text-muted-foreground">Gestión del personal del contratista</p>
        </div>
        <Button data-testid="add-employee-btn" onClick={handleAddClick} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Agregar Empleado
        </Button>
      </div>

      <EmployeeDataTable data={Array.isArray(employees) ? employees : []} columns={columns} onEdit={handleEditClick} />

      <EmployeeForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingEmployee}
      />

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Empleado"
        description="¿Estás seguro de que quieres eliminar este empleado? Esta acción no se puede deshacer."
      />
    </div>
  );
};

export default EmployeesPage;
