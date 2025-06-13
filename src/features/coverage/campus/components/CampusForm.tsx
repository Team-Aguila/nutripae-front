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
import type { CampusCreate, CampusUpdate } from "@team-aguila/pae-cobertura-client";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { useInstitutions } from "../../institutions/hooks/useInstitutions";

const campusSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  dane_code: z.string().min(1, "El código DANE es requerido"),
  address: z.string().min(1, "La dirección es requerida"),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  institution_id: z.number({ required_error: "Debe seleccionar una institución" }),
});

const campusUpdateSchema = campusSchema.omit({ dane_code: true });

type FormData = z.infer<typeof campusSchema>;

interface CampusFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CampusCreate | CampusUpdate) => void;
  initialData?: CampusCreate & { id: number };
}

export const CampusForm = ({ isOpen, onClose, onSubmit, initialData }: CampusFormProps) => {
  const isEditMode = !!initialData;
  const { data: institutions } = useInstitutions();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(isEditMode ? campusUpdateSchema : campusSchema) as any,
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset(initialData);
      } else {
        reset({
          name: "",
          dane_code: "",
          address: "",
          latitude: 0,
          longitude: 0,
          institution_id: undefined,
        });
      }
    }
  }, [initialData, isOpen, reset]);

  const handleFormSubmit = (data: CampusCreate | CampusUpdate) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Editar Sede" : "Agregar Sede"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Edita la información de la sede." : "Llena la información para crear una nueva sede."}
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
              <Label htmlFor="address" className="text-right">
                Dirección
              </Label>
              <Input id="address" {...register("address")} className="col-span-3" />
              {errors.address && <p className="col-span-4 text-red-500 text-xs">{errors.address.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="latitude" className="text-right">
                Latitud
              </Label>
              <Input id="latitude" type="number" step="any" {...register("latitude")} className="col-span-3" />
              {errors.latitude && <p className="col-span-4 text-red-500 text-xs">{errors.latitude.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="longitude" className="text-right">
                Longitud
              </Label>
              <Input id="longitude" type="number" step="any" {...register("longitude")} className="col-span-3" />
              {errors.longitude && <p className="col-span-4 text-red-500 text-xs">{errors.longitude.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="institution_id" className="text-right">
                Institución
              </Label>
              <Controller
                name="institution_id"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value, 10))}
                    defaultValue={String(field.value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccione una institución" />
                    </SelectTrigger>
                    <SelectContent>
                      {institutions?.map((i) => (
                        <SelectItem key={i.id} value={String(i.id)}>
                          {i.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.institution_id && (
                <p className="col-span-4 text-red-500 text-xs">{errors.institution_id.message}</p>
              )}
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
