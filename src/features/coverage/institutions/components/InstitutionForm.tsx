import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import type { InstitutionCreate, InstitutionUpdate } from "@team-aguila/pae-cobertura-client";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { useTowns } from "../../towns/hooks/useTowns";

const institutionSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  dane_code: z.string().min(1, "El código DANE es requerido"),
  town_id: z.number({ required_error: "Debe seleccionar un municipio" }),
});

const institutionUpdateSchema = institutionSchema.omit({ dane_code: true });

type FormData = z.infer<typeof institutionSchema>;

interface InstitutionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InstitutionCreate | InstitutionUpdate) => void;
  initialData?: InstitutionCreate & { id: number };
}

export const InstitutionForm = ({ isOpen, onClose, onSubmit, initialData }: InstitutionFormProps) => {
  const isEditMode = !!initialData;
  const { data: towns } = useTowns();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(isEditMode ? institutionUpdateSchema : institutionSchema) as any,
    defaultValues: { name: "", dane_code: "", town_id: undefined },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset(initialData);
      } else {
        reset({ name: "", dane_code: "", town_id: undefined });
      }
    }
  }, [initialData, isOpen, reset]);

  const handleFormSubmit = (data: InstitutionCreate | InstitutionUpdate) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Editar Institución" : "Agregar Institución"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Edita la información de la institución."
              : "Llena la información para crear una nueva institución."}
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="town_id" className="text-right">
                Municipio
              </Label>
              <Controller
                name="town_id"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value, 10))}
                    defaultValue={String(field.value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccione un municipio" />
                    </SelectTrigger>
                    <SelectContent>
                      {towns?.map((t) => (
                        <SelectItem key={t.id} value={String(t.id)}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.town_id && <p className="col-span-4 text-red-500 text-xs">{errors.town_id.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
