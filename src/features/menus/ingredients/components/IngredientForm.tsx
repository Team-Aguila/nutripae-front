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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { IngredientCreate, IngredientUpdate, IngredientResponse } from "@team-aguila/pae-menus-client";
import { IngredientStatus } from "@team-aguila/pae-menus-client";
import { useIngredientCategories } from "../hooks/useIngredientCategories";
import { useValidateIngredientName } from "../hooks/useValidateIngredientName";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const ingredientSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(255, "El nombre es muy largo"),
  base_unit_of_measure: z.string().min(1, "La unidad de medida es requerida").max(50, "La unidad es muy larga"),
  status: z.nativeEnum(IngredientStatus),
  description: z.string().max(1000, "La descripción es muy larga").optional(),
  category: z.string().max(100, "La categoría es muy larga").optional(),
});

type FormData = z.infer<typeof ingredientSchema>;

interface IngredientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: IngredientCreate | IngredientUpdate) => void;
  initialData?: IngredientResponse;
}

const STATUS_OPTIONS = [
  { value: IngredientStatus.ACTIVE, label: "Activo" },
  { value: IngredientStatus.INACTIVE, label: "Inactivo" },
];

const COMMON_UNITS = [
  "kg",
  "g",
  "mg",
  "L",
  "ml",
  "cl",
  "unidades",
  "paquetes",
  "latas",
  "tazas",
  "cucharadas",
  "cucharaditas",
];

export const IngredientForm = ({ isOpen, onClose, onSubmit, initialData }: IngredientFormProps) => {
  const isEditMode = !!initialData;
  const { data: categories } = useIngredientCategories();
  const [nameValue, setNameValue] = useState("");
  const [shouldValidateName, setShouldValidateName] = useState(false);

  // Validación de nombre en tiempo real
  const { data: isNameUnique, isLoading: isValidatingName } = useValidateIngredientName(
    nameValue,
    isEditMode ? initialData?._id : undefined,
    shouldValidateName && nameValue.length > 2
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(ingredientSchema),
  });

  const watchedName = watch("name");

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        const resetData = {
          name: initialData.name,
          base_unit_of_measure: initialData.base_unit_of_measure,
          status: initialData.status,
          description: initialData.description || "",
          category: initialData.category || "sin_categoria",
        };
        reset(resetData);
        setNameValue(initialData.name);
        setShouldValidateName(false);
      } else {
        const resetData = {
          name: "",
          base_unit_of_measure: "",
          status: IngredientStatus.ACTIVE,
          description: "",
          category: "sin_categoria",
        };
        reset(resetData);
        setNameValue("");
        setShouldValidateName(false);
      }
    }
  }, [isOpen, initialData, reset]);

  // Efecto para sincronizar el valor del nombre con la validación
  useEffect(() => {
    if (watchedName !== nameValue) {
      setNameValue(watchedName || "");
      setShouldValidateName(true);
    }
  }, [watchedName, nameValue]);

  const handleFormSubmit = (data: FormData) => {
    const submitData = {
      ...data,
      description: data.description || undefined,
      category: data.category === "sin_categoria" ? undefined : data.category || undefined,
    };
    onSubmit(submitData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Editar Ingrediente" : "Agregar Ingrediente"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Edita la información del ingrediente."
              : "Llena la información para crear un nuevo ingrediente."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <ScrollArea className="h-[60vh] pr-6">
            <div className="grid gap-4 py-4">
              {/* Nombre */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre *
                </Label>
                <div className="col-span-3">
                  <div className="relative">
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Ej: Arroz blanco"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {shouldValidateName && nameValue.length > 2 && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {isValidatingName ? (
                          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                        ) : isNameUnique === false ? (
                          <XCircle className="h-4 w-4 text-red-500" />
                        ) : isNameUnique === true ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : null}
                      </div>
                    )}
                  </div>
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  {shouldValidateName && nameValue.length > 2 && isNameUnique === false && (
                    <p className="text-red-500 text-xs mt-1">Este nombre ya está en uso</p>
                  )}
                  {shouldValidateName && nameValue.length > 2 && isNameUnique === true && (
                    <p className="text-green-600 text-xs mt-1">Nombre disponible</p>
                  )}
                </div>
              </div>

              {/* Unidad de medida */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="base_unit_of_measure" className="text-right">
                  Unidad *
                </Label>
                <div className="col-span-3">
                  <Controller
                    name="base_unit_of_measure"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar unidad de medida" />
                        </SelectTrigger>
                        <SelectContent>
                          {COMMON_UNITS.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.base_unit_of_measure && (
                    <p className="text-red-500 text-xs mt-1">{errors.base_unit_of_measure.message}</p>
                  )}
                </div>
              </div>

              {/* Categoría */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Categoría
                </Label>
                <div className="col-span-3">
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value || "sin_categoria"}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sin_categoria">Sin categoría</SelectItem>
                          {categories?.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              {/* Estado */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Estado
                </Label>
                <div className="col-span-3">
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              {/* Descripción */}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right mt-2">
                  Descripción
                </Label>
                <div className="col-span-3">
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Descripción opcional del ingrediente"
                    rows={3}
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                </div>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="pr-6 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={shouldValidateName && nameValue.length > 2 && (isValidatingName || isNameUnique === false)}
            >
              {isEditMode ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
