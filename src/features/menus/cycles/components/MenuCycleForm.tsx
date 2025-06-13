import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import type { MenuCycleCreate, MenuCycleUpdate, MenuCycleResponse } from "@team-aguila/pae-menus-client";
import { useDishes } from "../../dishes/hooks/useDishes";

const dayMenuSchema = z.object({
  day: z.number().min(1).max(7),
  breakfast_dish_ids: z.array(z.string()).optional(),
  lunch_dish_ids: z.array(z.string()).optional(),
  snack_dish_ids: z.array(z.string()).optional(),
});

const menuCycleSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().optional(),
  duration_days: z.number().min(1, "Debe tener al menos 1 día").max(56, "Máximo 56 días"),
  status: z.enum(["active", "inactive"]).optional(),
  daily_menus: z.array(dayMenuSchema).min(1, "Debe tener al menos un menú diario"),
});

type MenuCycleFormData = z.infer<typeof menuCycleSchema>;

interface MenuCycleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MenuCycleCreate | MenuCycleUpdate) => void;
  initialData?: MenuCycleResponse;
}

const DAYS_OF_WEEK = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
  { value: 7, label: "Domingo" },
];

export const MenuCycleForm = ({ isOpen, onClose, onSubmit, initialData }: MenuCycleFormProps) => {
  const { data: dishes } = useDishes();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<MenuCycleFormData>({
    resolver: zodResolver(menuCycleSchema),
    defaultValues: {
      name: "",
      description: "",
      duration_days: 7,
      status: "active",
      daily_menus: [{ day: 1, breakfast_dish_ids: [], lunch_dish_ids: [], snack_dish_ids: [] }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "daily_menus",
  });

  useEffect(() => {
    if (initialData) {
      setValue("name", initialData.name);
      setValue("description", initialData.description || "");
      setValue("duration_days", initialData.duration_days);
      setValue("status", initialData.status);
      setValue("daily_menus", initialData.daily_menus || []);
    } else {
      reset();
    }
  }, [initialData, setValue, reset]);

  const handleAddDayMenu = () => {
    append({ day: 1, breakfast_dish_ids: [], lunch_dish_ids: [], snack_dish_ids: [] });
  };

  const onFormSubmit = (data: MenuCycleFormData) => {
    onSubmit(data as any);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Ciclo de Menú" : "Crear Nuevo Ciclo de Menú"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="name"
                    placeholder="Nombre del ciclo de menú"
                    className={errors.name ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration_days">Días de duración *</Label>
              <Controller
                name="duration_days"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <Input
                    {...field}
                    id="duration_days"
                    type="number"
                    min="1"
                    max="56"
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className={errors.duration_days ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.duration_days && <p className="text-sm text-red-500">{errors.duration_days.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea {...field} id="description" placeholder="Descripción del ciclo de menú" rows={3} />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Menús diarios */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Menús Diarios</Label>
              <Button type="button" onClick={handleAddDayMenu}>
                <Plus className="mr-2 h-4 w-4" /> Agregar Día
              </Button>
            </div>

            {fields.map((field, index) => (
              <Card key={field.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>Menú del Día {index + 1}</span>
                    {fields.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Día de la semana</Label>
                      <Controller
                        name={`daily_menus.${index}.day`}
                        control={control}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar día" />
                            </SelectTrigger>
                            <SelectContent>
                              {DAYS_OF_WEEK.map((day) => (
                                <SelectItem key={day.value} value={day.value}>
                                  {day.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Desayuno</Label>
                      <Controller
                        name={`daily_menus.${index}.breakfast_dish_ids`}
                        control={control}
                        render={({ field }) => (
                          <Select value={field.value || ""} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar plato" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Sin plato</SelectItem>
                              {dishes?.map((dish) => (
                                <SelectItem key={dish._id} value={dish._id}>
                                  {dish.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Almuerzo</Label>
                      <Controller
                        name={`daily_menus.${index}.lunch_dish_ids`}
                        control={control}
                        render={({ field }) => (
                          <Select value={field.value || ""} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar plato" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Sin plato</SelectItem>
                              {dishes?.map((dish) => (
                                <SelectItem key={dish._id} value={dish._id}>
                                  {dish.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Refrigerio</Label>
                      <Controller
                        name={`daily_menus.${index}.snack_dish_ids`}
                        control={control}
                        render={({ field }) => (
                          <Select value={field.value || ""} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar plato" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Sin plato</SelectItem>
                              {dishes?.map((dish) => (
                                <SelectItem key={dish._id} value={dish._id}>
                                  {dish.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {errors.daily_menus && <p className="text-sm text-red-500">{errors.daily_menus.message}</p>}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">{initialData ? "Actualizar" : "Crear"} Ciclo</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
