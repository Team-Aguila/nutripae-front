import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import type { DepartmentCreate, DepartmentUpdate } from "@team-aguila/pae-cobertura-client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";

const departmentSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  dane_code: z.string().min(1, "El código DANE es requerido"),
});

const departmentUpdateSchema = departmentSchema.omit({ dane_code: true });

type FormData = z.infer<typeof departmentSchema>;

interface DepartmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DepartmentCreate | DepartmentUpdate) => void;
  initialData?: DepartmentCreate;
}

export const DepartmentForm = ({ isOpen, onClose, onSubmit, initialData }: DepartmentFormProps) => {
  const isEditMode = !!initialData;
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(isEditMode ? departmentUpdateSchema : departmentSchema) as any,
    defaultValues: {
      name: '',
      dane_code: ''
    }
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset(initialData);
      } else {
        reset({ name: '', dane_code: '' });
      }
    }
  }, [initialData, isOpen, reset]);

  const handleFormSubmit = (data: DepartmentCreate | DepartmentUpdate) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Editar Departamento' : 'Agregar Departamento'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Edita la información del departamento.' : 'Llena la información para crear un nuevo departamento.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input id="name" {...register("name")} className="col-span-3" />
              {errors.name && <p className="col-span-4 text-red-500 text-xs">{errors.name.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dane_code" className="text-right">
                Código DANE
              </Label>
              <Input id="dane_code" {...register("dane_code")} className="col-span-3" disabled={isEditMode} />
              {errors.dane_code && <p className="col-span-4 text-red-500 text-xs">{errors.dane_code.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 