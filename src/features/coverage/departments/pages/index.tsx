import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { useDepartments } from "../hooks/useDepartments";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { DepartmentForm } from "../components/DepartmentForm";
import type {
  DepartmentCreate,
  DepartmentResponseWithDetails,
  DepartmentUpdate,
} from "@team-aguila/pae-cobertura-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDepartment } from "../api/createDepartment";
import { toast } from "sonner";
import { updateDepartment } from "../api/updateDepartment";
import { deleteDepartment } from "../api/deleteDepartment";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { useNavigate } from "@tanstack/react-router";

const DepartmentsPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: "/coverage/departments" });
  const { data, isLoading, error } = useDepartments();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<DepartmentResponseWithDetails | undefined>(undefined);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingDepartmentId, setDeletingDepartmentId] = useState<number | undefined>(undefined);

  const createDepartmentMutation = useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Departamento creado exitosamente");
    },
    onError: () => {
      toast.error("Error al crear el departamento");
    },
  });

  const updateDepartmentMutation = useMutation({
    mutationFn: updateDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Departamento actualizado exitosamente");
    },
    onError: () => {
      toast.error("Error al actualizar el departamento");
    },
  });

  const deleteDepartmentMutation = useMutation({
    mutationFn: deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Departamento eliminado exitosamente");
    },
    onError: () => {
      toast.error("Error al eliminar el departamento");
    },
  });

  const handleAddDepartment = () => {
    setEditingDepartment(undefined);
    setIsFormOpen(true);
  };

  const handleEditDepartment = (department: DepartmentResponseWithDetails) => {
    setEditingDepartment(department);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingDepartmentId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingDepartmentId) {
      deleteDepartmentMutation.mutate(deletingDepartmentId);
      setIsConfirmOpen(false);
      setDeletingDepartmentId(undefined);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingDepartment(undefined);
  };

  const handleFormSubmit = (data: DepartmentCreate | DepartmentUpdate) => {
    setIsFormOpen(false);
    if (editingDepartment) {
      updateDepartmentMutation.mutate({
        id: editingDepartment.id,
        data: data as DepartmentUpdate,
      });
    } else {
      createDepartmentMutation.mutate(data as DepartmentCreate);
    }
  };

  const handleNavigateToTowns = (departmentId: number) => {
    navigate({
      to: "/coverage/departments/$departmentId/towns",
      params: { departmentId: String(departmentId) },
    });
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No hay datos</div>;

  return (
    <>
      <SiteHeader
        items={[
          { label: "Inicio", href: "/", isCurrentPage: false },
          { label: "Cobertura", href: "/coverage", isCurrentPage: false },
          { label: "Departamentos", isCurrentPage: true },
        ]}
      />
      <div className="gap-4 p-4 pt-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Departamentos</h2>
          <Button onClick={handleAddDepartment}>
            <Plus className="mr-2 h-4 w-4" /> Agregar departamento
          </Button>
        </div>
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {data.map((department) => (
            <div key={department.id} className="p-4 border rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold">{department.name}</h3>
              <p className="text-sm text-gray-500">Código DANE: {department.dane_code}</p>
              <p className="text-sm text-gray-500">Municipios: {department.number_of_towns}</p>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" size="icon" onClick={() => handleNavigateToTowns(department.id)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleEditDepartment(department)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleDeleteClick(department.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <DepartmentForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initialData={editingDepartment}
      />
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. Esto eliminará permanentemente el departamento."
      />
    </>
  );
};

export default DepartmentsPage;
