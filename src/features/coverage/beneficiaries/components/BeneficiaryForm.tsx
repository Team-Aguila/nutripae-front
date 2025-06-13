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
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  BeneficiaryCreate,
  BeneficiaryUpdate,
  BeneficiaryReadWithDetails,
} from "@team-aguila/pae-cobertura-client";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { useDocumentTypes } from "../hooks/useDocumentTypes";
import { useGenders } from "../hooks/useGenders";
import { useGrades } from "../hooks/useGrades";
import { useEtnicGroups } from "../hooks/useEtnicGroups";
import { useDisabilityTypes } from "../hooks/useDisabilityTypes";
import { ScrollArea } from "@/components/ui/scroll-area";

const beneficiarySchema = z.object({
  document_type_id: z.number({ required_error: "El tipo de documento es requerido" }),
  number_document: z.string().min(1, "El número de documento es requerido"),
  first_name: z.string().min(1, "El primer nombre es requerido"),
  second_name: z.string().optional(),
  first_surname: z.string().min(1, "El primer apellido es requerido"),
  second_surname: z.string().optional(),
  birth_date: z.string().min(1, "La fecha de nacimiento es requerida"),
  gender_id: z.number({ required_error: "El género es requerido" }),
  grade_id: z.number({ required_error: "El grado es requerido" }),
  etnic_group_id: z.number().optional(),
  victim_conflict: z.boolean().optional().default(false),
  disability_type_id: z.number().optional(),
  attendant_name: z.string().optional(),
  attendant_phone: z.string().optional(),
});

const beneficiaryUpdateSchema = beneficiarySchema.omit({ number_document: true });

type FormData = z.infer<typeof beneficiarySchema>;

interface BeneficiaryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BeneficiaryCreate | BeneficiaryUpdate) => void;
  initialData?: BeneficiaryReadWithDetails;
}

export const BeneficiaryForm = ({ isOpen, onClose, onSubmit, initialData }: BeneficiaryFormProps) => {
  const isEditMode = !!initialData;

  const { data: documentTypes } = useDocumentTypes();
  const { data: genders } = useGenders();
  const { data: grades } = useGrades();
  const { data: etnicGroups } = useEtnicGroups();
  const { data: disabilityTypes } = useDisabilityTypes();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(isEditMode ? beneficiaryUpdateSchema : beneficiarySchema) as any,
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          ...initialData,
          victim_conflict: initialData.victim_conflict ?? false,
          etnic_group_id: initialData.etnic_group_id ?? undefined,
          disability_type_id: initialData.disability_type_id ?? undefined,
          second_name: initialData.second_name ?? undefined,
          second_surname: initialData.second_surname ?? undefined,
          attendant_name: initialData.attendant_name ?? undefined,
          attendant_phone: initialData.attendant_phone ?? undefined,
          birth_date: initialData.birth_date ? new Date(initialData.birth_date).toISOString().split("T")[0] : "",
        });
      } else {
        reset({
          number_document: "",
          first_name: "",
          second_name: "",
          first_surname: "",
          second_surname: "",
          birth_date: "",
          victim_conflict: false,
          attendant_name: "",
          attendant_phone: "",
        });
      }
    }
  }, [initialData, isOpen, reset]);

  const handleFormSubmit = (data: Omit<FormData, "birth_date"> & { birth_date: string }) => {
    const dataToSubmit = {
      ...data,
      birth_date: new Date(data.birth_date).toISOString(),
    };
    onSubmit(dataToSubmit as BeneficiaryCreate | BeneficiaryUpdate);
  };

  const renderSelect = (
    name: keyof FormData,
    label: string,
    placeholder: string,
    items: Array<{ id?: number | null; name: string | null }> | undefined
  ) => (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={name} className="text-right">
        {label}
      </Label>
      <Controller
        name={name as any}
        control={control}
        render={({ field }) => (
          <Select onValueChange={(value) => field.onChange(parseInt(value, 10))} value={String(field.value ?? "")}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {items
                ?.filter((i) => i.id != null)
                .map((i) => (
                  <SelectItem key={i.id} value={String(i.id!)}>
                    {i.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )}
      />
      {errors[name] && <p className="col-span-4 text-red-500 text-xs">{(errors as any)[name].message}</p>}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Editar Beneficiario" : "Agregar Beneficiario"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Edita la información del beneficiario."
              : "Llena la información para crear un nuevo beneficiario."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit as any)}>
          <ScrollArea className="h-[60vh] pr-6">
            <div className="grid gap-4 py-4">
              {renderSelect("document_type_id", "Tipo de Documento", "Seleccione un tipo", documentTypes)}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="number_document" className="text-right">
                  Nº Documento
                </Label>
                <Input
                  id="number_document"
                  {...register("number_document")}
                  className="col-span-3"
                  disabled={isEditMode}
                />
                {errors.number_document && (
                  <p className="col-span-4 text-red-500 text-xs">{errors.number_document.message}</p>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="first_name" className="text-right">
                  Primer Nombre
                </Label>
                <Input id="first_name" {...register("first_name")} className="col-span-3" />
                {errors.first_name && <p className="col-span-4 text-red-500 text-xs">{errors.first_name.message}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="second_name" className="text-right">
                  Segundo Nombre
                </Label>
                <Input id="second_name" {...register("second_name")} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="first_surname" className="text-right">
                  Primer Apellido
                </Label>
                <Input id="first_surname" {...register("first_surname")} className="col-span-3" />
                {errors.first_surname && (
                  <p className="col-span-4 text-red-500 text-xs">{errors.first_surname.message}</p>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="second_surname" className="text-right">
                  Segundo Apellido
                </Label>
                <Input id="second_surname" {...register("second_surname")} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="birth_date" className="text-right">
                  Fecha Nacimiento
                </Label>
                <Input id="birth_date" type="date" {...register("birth_date")} className="col-span-3" />
                {errors.birth_date && <p className="col-span-4 text-red-500 text-xs">{errors.birth_date.message}</p>}
              </div>
              {renderSelect("gender_id", "Género", "Seleccione un género", genders)}
              {renderSelect("grade_id", "Grado", "Seleccione un grado", grades)}
              {renderSelect("etnic_group_id", "Grupo Étnico", "Seleccione un grupo", etnicGroups)}
              {renderSelect("disability_type_id", "Discapacidad", "Seleccione un tipo", disabilityTypes)}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="victim_conflict" className="text-right">
                  Víctima del Conflicto
                </Label>
                <Controller
                  name="victim_conflict"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="victim_conflict"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="col-span-3"
                    />
                  )}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="attendant_name" className="text-right">
                  Nombre Acudiente
                </Label>
                <Input id="attendant_name" {...register("attendant_name")} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="attendant_phone" className="text-right">
                  Teléfono Acudiente
                </Label>
                <Input id="attendant_phone" {...register("attendant_phone")} className="col-span-3" />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="pr-6 pt-4">
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
