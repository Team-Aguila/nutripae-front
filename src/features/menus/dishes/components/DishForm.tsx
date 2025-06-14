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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2 } from "lucide-react";
import type { DishCreate, DishUpdate, DishResponse } from "@team-aguila/pae-menus-client";
import { DishStatus, MealType } from "@team-aguila/pae-menus-client";
import { useActiveIngredients } from "../../ingredients/hooks/useActiveIngredients";

const portionSchema = z.object({
  ingredient_id: z.string().min(1, "Selecciona un ingrediente"),
  quantity: z.number().min(0.01, "La cantidad debe ser mayor a 0"),
  unit: z.string().min(1, "La unidad es requerida"),
});

const dishSchema = z.object({
  status: z.nativeEnum(DishStatus), // status is now required
  name: z.string().min(1, "El nombre es requerido").max(255, "El nombre es muy largo"),
  description: z.string().max(1000, "La descripción es muy larga").optional(),
  compatible_meal_types: z.array(z.nativeEnum(MealType)).min(1, "Selecciona al menos un tipo de comida"),
  recipe: z.object({
    ingredients: z.array(portionSchema).min(1, "Agrega al menos un ingrediente"),
  }),
  nutritional_info: z
    .object({
      calories: z.number().min(0).optional(),
      protein: z.string().optional(),
      photo_url: z.string().url("URL inválida").optional().or(z.literal("")),
    })
    .optional(),
});

type FormData = z.infer<typeof dishSchema>;

interface DishFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DishCreate | DishUpdate) => void;
  initialData?: DishResponse;
}

const MEAL_TYPE_OPTIONS = [
  { value: MealType.DESAYUNO, label: "Desayuno" },
  { value: MealType.ALMUERZO, label: "Almuerzo" },
  { value: MealType.REFRIGERIO, label: "Refrigerio" },
];

const STATUS_OPTIONS = [
  { value: DishStatus.ACTIVE, label: "Activo" },
  { value: DishStatus.INACTIVE, label: "Inactivo" },
];

export const DishForm = ({ isOpen, onClose, onSubmit, initialData }: DishFormProps) => {
  const isEditMode = !!initialData;
  const { data: ingredients } = useActiveIngredients();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(dishSchema),
    defaultValues: {
      name: "",
      description: "",
      status: DishStatus.ACTIVE,
      compatible_meal_types: [],
      recipe: {
        ingredients: [{ ingredient_id: "", quantity: 0, unit: "" }],
      },
      nutritional_info: {
        calories: undefined,
        protein: "",
        photo_url: "",
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "recipe.ingredients",
  });

  const watchedIngredients = watch("recipe.ingredients");

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          name: initialData.name,
          description: initialData.description || "",
          status: initialData.status,
          compatible_meal_types: initialData.compatible_meal_types,
          recipe: {
            ingredients:
              (initialData.recipe?.ingredients ?? []).length > 0
                ? initialData.recipe?.ingredients ?? []
                : [{ ingredient_id: "", quantity: 0, unit: "" }],
          },
          nutritional_info: {
            calories: initialData.nutritional_info?.calories || undefined,
            protein: initialData.nutritional_info?.protein || "",
            photo_url: initialData.nutritional_info?.photo_url || "",
          },
        });
      } else {
        reset({
          name: "",
          description: "",
          status: "active" as DishStatus,
          compatible_meal_types: [],
          recipe: {
            ingredients: [{ ingredient_id: "", quantity: 0, unit: "" }],
          },
          nutritional_info: {
            calories: undefined,
            protein: "",
            photo_url: "",
          },
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = (data: FormData) => {
    const submitData = {
      ...data,
      description: data.description && data.description.trim() !== "" ? data.description : undefined,
      nutritional_info:
        data.nutritional_info?.calories || data.nutritional_info?.protein || data.nutritional_info?.photo_url
          ? {
            calories: data.nutritional_info.calories || undefined,
            protein: data.nutritional_info.protein || undefined,
            photo_url: data.nutritional_info.photo_url || undefined,
          }
          : undefined,
    };
    onSubmit(submitData);
  };

  const addIngredient = () => {
    append({ ingredient_id: "", quantity: 0, unit: "" });
  };

  const removeIngredient = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const getAvailableIngredients = (currentIndex: number) => {
    const selectedIds = new Set(
      watchedIngredients.map((ing, idx) => (idx !== currentIndex ? ing.ingredient_id : null)).filter(Boolean)
    );
    return ingredients?.filter((ing) => !selectedIds.has(ing._id)) || [];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Editar Plato" : "Agregar Plato"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Edita la información del plato y su receta."
              : "Crea un nuevo plato con su receta e información nutricional."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <ScrollArea className="h-[70vh] pr-6">
            <div className="grid gap-6 py-4">
              {/* Información básica */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información Básica</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Nombre */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nombre *
                    </Label>
                    <div className="col-span-3">
                      <Input id="name" {...register("name")} placeholder="Ej: Arroz con pollo" />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
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
                        placeholder="Descripción del plato"
                        rows={3}
                      />
                      {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
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

                  {/* Tipos de comida compatibles */}
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right mt-2">Tipos de comida *</Label>
                    <div className="col-span-3 space-y-2">
                      <Controller
                        name="compatible_meal_types"
                        control={control}
                        render={({ field }) => (
                          <div className="space-y-2">
                            {MEAL_TYPE_OPTIONS.map((option) => (
                              <div key={option.value} className="flex items-center space-x-2">
                                <Checkbox
                                  id={option.value}
                                  checked={field.value?.includes(option.value)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([...field.value, option.value]);
                                    } else {
                                      field.onChange(field.value.filter((v) => v !== option.value));
                                    }
                                  }}
                                />
                                <Label htmlFor={option.value}>{option.label}</Label>
                              </div>
                            ))}
                          </div>
                        )}
                      />
                      {errors.compatible_meal_types && (
                        <p className="text-red-500 text-xs">{errors.compatible_meal_types.message}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Receta */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    Receta
                    <Button type="button" onClick={addIngredient} size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Agregar ingrediente
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex items-end gap-2 p-3 border rounded-lg">
                        <div className="flex-1">
                          <Label>Ingrediente</Label>
                          <Controller
                            name={`recipe.ingredients.${index}.ingredient_id`}
                            control={control}
                            render={({ field }) => (
                              <Select 
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  // Actualizar la unidad automáticamente
                                  const selectedIngredient = ingredients?.find(ing => ing._id === value);
                                  if (selectedIngredient) {
                                    setValue(`recipe.ingredients.${index}.unit`, selectedIngredient.base_unit_of_measure);
                                  }
                                }} 
                                value={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar ingrediente" />
                                </SelectTrigger>
                                <SelectContent>
                                  {getAvailableIngredients(index).map((ingredient) => (
                                    <SelectItem key={ingredient._id} value={ingredient._id}>
                                      {ingredient.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                        <div className="w-24">
                          <Label>Cantidad</Label>
                          <Input
                            type="number"
                            step="0.01"
                            {...register(`recipe.ingredients.${index}.quantity`, { valueAsNumber: true })}
                            placeholder="0.00"
                          />
                        </div>
                        <div className="w-20">
                          <Label>Unidad</Label>
                          <Input 
                            {...register(`recipe.ingredients.${index}.unit`)} 
                            placeholder="kg"
                            readOnly
                            className="bg-gray-50 cursor-not-allowed"
                            title="La unidad se asigna automáticamente según el ingrediente seleccionado"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeIngredient(index)}
                          disabled={fields.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {errors.recipe?.ingredients && (
                      <p className="text-red-500 text-xs">{errors.recipe.ingredients.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Información nutricional */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información Nutricional (Opcional)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="calories">Calorías</Label>
                      <Input
                        id="calories"
                        type="number"
                        {...register("nutritional_info.calories", { valueAsNumber: true })}
                        placeholder="150"
                      />
                    </div>
                    <div>
                      <Label htmlFor="protein">Proteína</Label>
                      <Input id="protein" {...register("nutritional_info.protein")} placeholder="Ej: 25g" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="photo_url">URL de la foto</Label>
                    <Input
                      id="photo_url"
                      {...register("nutritional_info.photo_url")}
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                    {errors.nutritional_info?.photo_url && (
                      <p className="text-red-500 text-xs mt-1">{errors.nutritional_info.photo_url.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
          <DialogFooter className="pr-6 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">{isEditMode ? "Actualizar" : "Crear"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
