import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2 } from "lucide-react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import type { MenuCycleCreate, MenuCycleUpdate, MenuCycleResponse } from "@team-aguila/pae-menus-client";
import { useDishes } from "../../dishes/hooks/useDishes";

const dayMenuSchema = z
  .object({
    day: z.number().min(1).max(7),
    breakfast_dish_ids: z.array(z.string()).optional(),
    lunch_dish_ids: z.array(z.string()).optional(),
    snack_dish_ids: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      const hasBreakfast = data.breakfast_dish_ids && data.breakfast_dish_ids.length > 0;
      const hasLunch = data.lunch_dish_ids && data.lunch_dish_ids.length > 0;
      const hasSnack = data.snack_dish_ids && data.snack_dish_ids.length > 0;

      return hasBreakfast || hasLunch || hasSnack;
    },
    {
      message: "Cada día debe tener al menos un plato asignado (desayuno, almuerzo o refrigerio)",
    }
  );

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
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
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

  // Observar los menús diarios para validación en tiempo real
  const watchedDailyMenus = watch("daily_menus");

  // Función para verificar si un día tiene al menos un plato asignado
  const hasDishAssigned = (dayMenu: (typeof watchedDailyMenus)[0]) => {
    return (
      (dayMenu.breakfast_dish_ids && dayMenu.breakfast_dish_ids.length > 0) ||
      (dayMenu.lunch_dish_ids && dayMenu.lunch_dish_ids.length > 0) ||
      (dayMenu.snack_dish_ids && dayMenu.snack_dish_ids.length > 0)
    );
  };

  // Resetear errores de validación cuando se abra/cierre el modal
  useEffect(() => {
    if (isOpen) {
      setShowValidationErrors(false);
    }
  }, [isOpen]);

  // Resetear errores cuando se corrigen (cuando todos los días tienen platos)
  useEffect(() => {
    if (showValidationErrors) {
      const allDaysHaveShips = watchedDailyMenus.every((menu) => {
        return (
          (menu.breakfast_dish_ids && menu.breakfast_dish_ids.length > 0) ||
          (menu.lunch_dish_ids && menu.lunch_dish_ids.length > 0) ||
          (menu.snack_dish_ids && menu.snack_dish_ids.length > 0)
        );
      });
      if (allDaysHaveShips) {
        setShowValidationErrors(false);
      }
    }
  }, [watchedDailyMenus, showValidationErrors]);

  useEffect(() => {
    if (initialData) {
      setValue("name", initialData.name);
      setValue("description", initialData.description || "");
      setValue("duration_days", initialData.duration_days);
      setValue("status", initialData.status);
      // Asegurar que los daily_menus tengan el formato correcto con arrays
      const formattedDailyMenus =
        initialData.daily_menus?.map((menu) => ({
          day: menu.day,
          breakfast_dish_ids: menu.breakfast_dish_ids || [],
          lunch_dish_ids: menu.lunch_dish_ids || [],
          snack_dish_ids: menu.snack_dish_ids || [],
        })) || [];
      setValue("daily_menus", formattedDailyMenus);
    } else {
      reset();
    }
  }, [initialData, setValue, reset]);

  const handleAddDayMenu = () => {
    append({ day: 1, breakfast_dish_ids: [], lunch_dish_ids: [], snack_dish_ids: [] });
  };

  const onFormSubmit = (data: MenuCycleFormData) => {
    // Validar que todos los días tengan al menos un plato asignado
    const hasInvalidDays = data.daily_menus.some((menu) => !hasDishAssigned(menu));

    if (hasInvalidDays) {
      setShowValidationErrors(true);
      return; // No enviar el formulario si hay días sin platos
    }

    // Si todo está válido, enviar los datos
    const transformedData = {
      ...data,
      daily_menus: data.daily_menus.map((menu) => ({
        ...menu,
        breakfast_dish_ids: menu.breakfast_dish_ids || [],
        lunch_dish_ids: menu.lunch_dish_ids || [],
        snack_dish_ids: menu.snack_dish_ids || [],
      })),
    };

    setShowValidationErrors(false);
    onSubmit(transformedData as MenuCycleCreate | MenuCycleUpdate);
    reset();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Obtener los datos actuales del formulario
    const currentData = watch();

    // Validar manualmente antes de ejecutar handleSubmit
    const hasInvalidDays = currentData.daily_menus.some((menu) => !hasDishAssigned(menu));

    if (hasInvalidDays) {
      setShowValidationErrors(true);
      return;
    }

    // Si la validación pasa, proceder con el handleSubmit normal
    handleSubmit(onFormSubmit)(e);
  };

  const handleClose = () => {
    reset();
    setShowValidationErrors(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] w-[95vw] min-w-[1200px] max-h-[90vh] p-0 flex flex-col" id="menu-cycle-form-dialog">
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0" id="menu-cycle-form-header">
          <DialogTitle className="text-xl font-semibold" id="menu-cycle-form-title">
            {initialData ? "Editar Ciclo de Menú" : "Crear Nuevo Ciclo de Menú"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="flex flex-col flex-1" id="menu-cycle-form">
          <div className="flex-1 px-6 py-6 space-y-6" id="menu-cycle-form-content">
            {/* Información básica */}
            <Card className="shadow-sm" id="menu-cycle-basic-info-card">
              <CardHeader className="pb-4" id="menu-cycle-basic-info-header">
                <CardTitle className="text-lg flex items-center gap-2" id="menu-cycle-basic-info-title">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Información Básica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4" id="menu-cycle-basic-info-content">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2" id="menu-cycle-name-field">
                    <Label htmlFor="name">Nombre *</Label>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="menu-cycle-name-input"
                          placeholder="Nombre del ciclo de menú"
                          className={errors.name ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.name && <p className="text-sm text-red-500" id="menu-cycle-name-error">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-2" id="menu-cycle-duration-field">
                    <Label htmlFor="duration_days">Días de duración *</Label>
                    <Controller
                      name="duration_days"
                      control={control}
                      render={({ field: { onChange, value, ...field } }) => (
                        <Input
                          {...field}
                          id="menu-cycle-duration-input"
                          type="number"
                          min="1"
                          max="56"
                          value={value}
                          onChange={(e) => onChange(Number(e.target.value))}
                          placeholder="Número de días"
                          className={errors.duration_days ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.duration_days && <p className="text-sm text-red-500" id="menu-cycle-duration-error">{errors.duration_days.message}</p>}
                  </div>
                </div>

                <div className="space-y-2" id="menu-cycle-description-field">
                  <Label htmlFor="description">Descripción</Label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        id="menu-cycle-description-input"
                        placeholder="Descripción del ciclo de menú (opcional)"
                        rows={3}
                      />
                    )}
                  />
                </div>

                <div className="space-y-2" id="menu-cycle-status-field">
                  <Label htmlFor="status">Estado</Label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value || "active"}>
                        <SelectTrigger id="menu-cycle-status-select">
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent id="menu-cycle-status-options">
                          <SelectItem value="active" id="menu-cycle-status-active">Activo</SelectItem>
                          <SelectItem value="inactive" id="menu-cycle-status-inactive">Inactivo</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Menús diarios */}
            <Card className="shadow-sm" id="menu-cycle-daily-menus-card">
              <CardHeader className="pb-4" id="menu-cycle-daily-menus-header">
                <CardTitle className="text-lg flex items-center justify-between" id="menu-cycle-daily-menus-title">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Menús Diarios
                  </div>
                  <Button type="button" onClick={handleAddDayMenu} size="sm" className="gap-2" id="add-daily-menu-btn">
                    <Plus className="h-4 w-4" /> Agregar Día
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4" id="menu-cycle-daily-menus-content">
                <ScrollArea className="h-[250px] p-4" id="daily-menus-scroll-area">
                  <div className="space-y-4" id="daily-menus-list">
                    {fields.map((field, index) => (
                      <Card
                        key={field.id}
                        className="border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors"
                        id={`daily-menu-card-${index}`}
                      >
                        <CardHeader className="pb-3" id={`daily-menu-header-${index}`}>
                          <CardTitle className="text-base flex items-center justify-between" id={`daily-menu-title-${index}`}>
                            <span className="font-medium">Menú del Día {index + 1}</span>
                            {fields.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => remove(index)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                id={`remove-daily-menu-btn-${index}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4" id={`daily-menu-content-${index}`}>
                          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            <div className="space-y-2" id={`daily-menu-day-field-${index}`}>
                              <Label className="text-center block">Día de la semana</Label>
                              <Controller
                                name={`daily_menus.${index}.day`}
                                control={control}
                                render={({ field }) => (
                                  <Select
                                    value={field.value?.toString() ?? ""}
                                    onValueChange={(val) => field.onChange(Number(val))}
                                  >
                                    <SelectTrigger className="text-center" id={`daily-menu-day-select-${index}`}>
                                      <SelectValue placeholder="Seleccionar día" />
                                    </SelectTrigger>
                                    <SelectContent id={`daily-menu-day-options-${index}`}>
                                      {DAYS_OF_WEEK.map((day) => (
                                        <SelectItem key={day.value} value={day.value.toString()} id={`daily-menu-day-${day.value}-${index}`}>
                                          {day.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                            </div>

                            <div className="space-y-2" id={`daily-menu-breakfast-field-${index}`}>
                              <Label className="text-center block">Desayuno</Label>
                              <Controller
                                name={`daily_menus.${index}.breakfast_dish_ids`}
                                control={control}
                                render={({ field }) => (
                                  <Select
                                    value={
                                      Array.isArray(field.value) && field.value.length > 0 ? field.value[0] : "no-dish"
                                    }
                                    onValueChange={(value) => field.onChange(value === "no-dish" ? [] : [value])}
                                  >
                                    <SelectTrigger className="text-center" id={`daily-menu-breakfast-select-${index}`}>
                                      <SelectValue placeholder="Seleccionar plato" />
                                    </SelectTrigger>
                                    <SelectContent id={`daily-menu-breakfast-options-${index}`}>
                                      <SelectItem value="no-dish" id={`daily-menu-breakfast-no-dish-${index}`}>Sin plato</SelectItem>
                                      {dishes?.map((dish) => (
                                        <SelectItem key={dish._id} value={dish._id} id={`daily-menu-breakfast-dish-${dish._id}-${index}`}>
                                          {dish.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                            </div>

                            <div className="space-y-2" id={`daily-menu-lunch-field-${index}`}>
                              <Label className="text-center block">Almuerzo</Label>
                              <Controller
                                name={`daily_menus.${index}.lunch_dish_ids`}
                                control={control}
                                render={({ field }) => (
                                  <Select
                                    value={
                                      Array.isArray(field.value) && field.value.length > 0 ? field.value[0] : "no-dish"
                                    }
                                    onValueChange={(value) => field.onChange(value === "no-dish" ? [] : [value])}
                                  >
                                    <SelectTrigger className="text-center" id={`daily-menu-lunch-select-${index}`}>
                                      <SelectValue placeholder="Seleccionar plato" />
                                    </SelectTrigger>
                                    <SelectContent id={`daily-menu-lunch-options-${index}`}>
                                      <SelectItem value="no-dish" id={`daily-menu-lunch-no-dish-${index}`}>Sin plato</SelectItem>
                                      {dishes?.map((dish) => (
                                        <SelectItem key={dish._id} value={dish._id} id={`daily-menu-lunch-dish-${dish._id}-${index}`}>
                                          {dish.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                            </div>

                            <div className="space-y-2" id={`daily-menu-snack-field-${index}`}>
                              <Label className="text-center block">Refrigerio</Label>
                              <Controller
                                name={`daily_menus.${index}.snack_dish_ids`}
                                control={control}
                                render={({ field }) => (
                                  <Select
                                    value={
                                      Array.isArray(field.value) && field.value.length > 0 ? field.value[0] : "no-dish"
                                    }
                                    onValueChange={(value) => field.onChange(value === "no-dish" ? [] : [value])}
                                  >
                                    <SelectTrigger className="text-center" id={`daily-menu-snack-select-${index}`}>
                                      <SelectValue placeholder="Seleccionar plato" />
                                    </SelectTrigger>
                                    <SelectContent id={`daily-menu-snack-options-${index}`}>
                                      <SelectItem value="no-dish" id={`daily-menu-snack-no-dish-${index}`}>Sin plato</SelectItem>
                                      {dishes?.map((dish) => (
                                        <SelectItem key={dish._id} value={dish._id} id={`daily-menu-snack-dish-${dish._id}-${index}`}>
                                          {dish.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                            </div>
                          </div>

                          {/* Mostrar error de validación para este día específico */}
                          {showValidationErrors && !hasDishAssigned(watchedDailyMenus[index]) && (
                            <div className="mt-2" id={`daily-menu-validation-error-${index}`}>
                              <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded p-2">
                                <strong>Día {index + 1}:</strong> Este día debe tener al menos un plato asignado
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
                {showValidationErrors && watchedDailyMenus.some((menu) => !hasDishAssigned(menu)) && (
                  <div className="mt-4">
                    <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded p-3">
                      <strong>️Error de validación:</strong> Todos los días deben tener al menos un plato asignado para
                      poder crear el ciclo de menú.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Botones de acción - Siempre visibles al fondo */}
          <div className="flex justify-end space-x-3 px-6 py-4 border-t bg-background flex-shrink-0" id="menu-cycle-form-actions">
            <Button type="button" variant="outline" onClick={handleClose} className="min-w-[100px]" id="menu-cycle-form-cancel-btn">
              Cancelar
            </Button>
            <Button type="submit" className="min-w-[120px]" id="menu-cycle-form-submit-btn">
              {initialData ? "Actualizar" : "Crear"} Ciclo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
