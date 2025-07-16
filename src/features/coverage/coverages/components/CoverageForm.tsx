import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  CoverageCreate,
  CoverageUpdate,
  CoverageReadWithDetails,
  BeneficiaryReadWithDetails,
  CoverageRead,
} from "@team-aguila/pae-cobertura-client";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useEffect, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useBeneficiaries } from "../../beneficiaries/hooks/useBeneficiaries";
import { useCampuses } from "../../campus/hooks/useCampuses";
import { useBenefitTypes } from "../hooks/useBenefitTypes";

const coverageSchema = z.object({
  beneficiary_id: z.string({ required_error: "El beneficiario es requerido" }),
  campus_id: z.string({ required_error: "La sede es requerida" }),
  benefit_type_id: z.number({ required_error: "El tipo de beneficio es requerido" }),
});

type FormData = z.infer<typeof coverageSchema>;

interface CoverageFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CoverageCreate | CoverageUpdate) => void;
  initialData?: CoverageReadWithDetails;
  allBeneficiaries?: BeneficiaryReadWithDetails[];
  allCoverages?: CoverageRead[];
}

export const CoverageForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  allBeneficiaries,
  allCoverages,
}: CoverageFormProps) => {
  const isEditMode = !!initialData;

  const { data: fetchedBeneficiaries } = useBeneficiaries();
  const { data: campuses } = useCampuses();
  const { data: benefitTypes } = useBenefitTypes();

  const beneficiaries = allBeneficiaries || fetchedBeneficiaries;

  const availableBeneficiaries = useMemo(() => {
    if (isEditMode || !beneficiaries || !allCoverages) {
      return beneficiaries;
    }
    const assignedBeneficiaryIds = new Set(allCoverages.map((c) => c.beneficiary_id));
    return beneficiaries.filter((b) => !assignedBeneficiaryIds.has(b.id));
  }, [isEditMode, beneficiaries, allCoverages]);

  const beneficiariesForSelect = useMemo(
    () => availableBeneficiaries?.map((b) => ({ ...b, fullName: `${b.first_name} ${b.first_surname}` })),
    [availableBeneficiaries]
  );

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(coverageSchema) as any,
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          beneficiary_id: initialData.beneficiary_id,
          campus_id: String(initialData.campus_id),
          benefit_type_id: initialData.benefit_type_id,
        });
      } else {
        reset({
          beneficiary_id: undefined,
          campus_id: undefined,
          benefit_type_id: undefined,
        });
      }
    }
  }, [initialData, isOpen, reset]);

  const handleFormSubmit = (data: FormData) => {
    const dataToSubmit = {
      ...data,
      campus_id: parseInt(data.campus_id, 10),
    };
    onSubmit(dataToSubmit as CoverageCreate | CoverageUpdate);
  };

  const renderSelect = <T extends Record<string, any>>(
    name: keyof FormData,
    label: string,
    placeholder: string,
    items: T[] | undefined,
    keyProp: keyof T,
    valueProp: keyof T,
    disabled: boolean = false
  ) => (
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={name} className="text-right">
          {label}
        </Label>
        <Controller
          name={name}
          control={control}
          render={({ field }) => {
            const value = field.value;
            const item = items?.find((i) => i[keyProp] === value);

            const handleValueChange = (val: string) => {
              if (name === "benefit_type_id") {
                field.onChange(parseInt(val, 10));
              } else {
                field.onChange(val);
              }
            };

            return (
              <Select onValueChange={handleValueChange} value={String(value ?? "")} disabled={disabled}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={placeholder}>{item ? item[valueProp] : placeholder}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {items
                    ?.filter((i) => i[keyProp] != null)
                    .map((i) => (
                      <SelectItem key={i[keyProp]} value={String(i[keyProp]!)}>
                        {i[valueProp]}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            );
          }}
        />
        {errors[name] && <p className="col-span-4 text-red-500 text-xs">{(errors as any)[name].message}</p>}
      </div>
    );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Editar Cobertura" : "Agregar Cobertura"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Edita la información de la cobertura."
              : "Llena la información para crear una nueva cobertura."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <ScrollArea className="h-[60vh] pr-6">
            <div className="grid gap-4 py-4">
              {renderSelect(
                "beneficiary_id",
                "Beneficiario",
                "Seleccione un beneficiario",
                beneficiariesForSelect,
                "id",
                "fullName",
                isEditMode
              )}
              {renderSelect("campus_id", "Sede", "Seleccione una sede", campuses, "id", "name")}
              {renderSelect("benefit_type_id", "Tipo de Beneficio", "Seleccione un tipo", benefitTypes, "id", "name")}
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
