import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock } from "lucide-react";
import { useMenuCycles } from "../../cycles/hooks/useMenuCycles";
import { useCampuses } from "@/features/coverage/campus/hooks/useCampuses";
import { useTowns } from "@/features/coverage/towns/hooks/useTowns";
import type { MenuScheduleAssignmentRequest } from "../api/assignMenuCycle";
import type { MenuScheduleResponse } from "../api/getMenuSchedules";

const menuScheduleSchema = z
  .object({
    menu_cycle_id: z.string().min(1, "Debe seleccionar un ciclo de menú"),
    campus_ids: z.array(z.string()).optional(),
    town_ids: z.array(z.string()).optional(),
    start_date: z.string().min(1, "La fecha de inicio es obligatoria"),
    end_date: z.string().min(1, "La fecha de fin es obligatoria"),
  })
  .refine(
    (data) => {
      const hasCampuses = data.campus_ids && data.campus_ids.length > 0;
      const hasTowns = data.town_ids && data.town_ids.length > 0;
      return hasCampuses || hasTowns;
    },
    {
      message: "Debe seleccionar al menos una ubicación (campus o municipio)",
      path: ["campus_ids"],
    }
  )
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        return new Date(data.start_date) <= new Date(data.end_date);
      }
      return true;
    },
    {
      message: "La fecha de inicio debe ser menor o igual a la fecha de fin",
      path: ["end_date"],
    }
  );

type MenuScheduleFormData = z.infer<typeof menuScheduleSchema>;

interface MenuScheduleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MenuScheduleAssignmentRequest) => void;
  initialData?: MenuScheduleResponse;
  isLoading?: boolean;
}

export const MenuScheduleForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: MenuScheduleFormProps) => {
  const { data: campuses = [], isLoading: loadingCampuses } = useCampuses();
  const { data: towns = [], isLoading: loadingTowns } = useTowns();
  const loadingLocations = loadingCampuses || loadingTowns;

  const { data: menuCycles } = useMenuCycles();
  const activeCycles = menuCycles?.filter((cycle) => cycle.status === "active") || [];

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<MenuScheduleFormData>({
    resolver: zodResolver(menuScheduleSchema),
    defaultValues: {
      menu_cycle_id: "",
      campus_ids: [],
      town_ids: [],
      start_date: "",
      end_date: "",
    },
  });

  const watchedMenuCycleId = watch("menu_cycle_id");
  const watchedCampusIds = watch("campus_ids");
  const watchedTownIds = watch("town_ids");

  // Resetear formulario cuando se abre/cierra
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setValue("menu_cycle_id", initialData.menu_cycle_id);
        setValue("start_date", initialData.start_date.split("T")[0]);
        setValue("end_date", initialData.end_date.split("T")[0]);

        const campusIds = initialData.coverage.filter((c) => c.location_type === "campus").map((c) => c.location_id);
        const townIds = initialData.coverage.filter((c) => c.location_type === "town").map((c) => c.location_id);

        setValue("campus_ids", campusIds);
        setValue("town_ids", townIds);
      } else {
        reset();
      }
    }
  }, [isOpen, initialData, setValue, reset]);

  const handleFormSubmit = (data: MenuScheduleFormData) => {
    onSubmit({
      menu_cycle_id: data.menu_cycle_id,
      campus_ids: data.campus_ids?.length ? data.campus_ids : undefined,
      town_ids: data.town_ids?.length ? data.town_ids : undefined,
      start_date: data.start_date,
      end_date: data.end_date,
    });
  };

  const handleCampusChange = (campusId: string, checked: boolean) => {
    const currentIds = watchedCampusIds || [];
    if (checked) {
      setValue("campus_ids", [...currentIds, campusId]);
    } else {
      setValue(
        "campus_ids",
        currentIds.filter((id) => id !== campusId)
      );
    }
  };

  const handleTownChange = (townId: string, checked: boolean) => {
    const currentIds = watchedTownIds || [];
    if (checked) {
      setValue("town_ids", [...currentIds, townId]);
    } else {
      setValue(
        "town_ids",
        currentIds.filter((id) => id !== townId)
      );
    }
  };

  const selectedCycle = activeCycles.find((cycle) => cycle._id === watchedMenuCycleId);
  const totalSelectedLocations = (watchedCampusIds?.length || 0) + (watchedTownIds?.length || 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent id="menu-schedule-form-dialog" className="w-[1200px] max-w-[95vw] max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle id="menu-schedule-form-title" className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {initialData ? "Editar Asignación de Menú" : "Asignar Ciclo de Menú"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] pr-4">
          <form id="menu-schedule-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="space-y-6">
              {/* Selección de Ciclo de Menú */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Ciclo de Menú
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="menu_cycle_id">Ciclo de Menú *</Label>
                      <Controller
                        name="menu_cycle_id"
                        control={control}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange} disabled={!!initialData}>
                            <SelectTrigger id="menu-cycle-select" className="mt-1">
                              <SelectValue placeholder="Seleccionar ciclo de menú" />
                            </SelectTrigger>
                            <SelectContent>
                              {activeCycles.map((cycle) => (
                                <SelectItem key={cycle._id} value={cycle._id}>
                                  <div className="flex flex-col">
                                    <span className="font-medium">{cycle.name}</span>
                                    <span className="text-sm text-muted-foreground">
                                      {cycle.duration_days} días - {cycle.status}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.menu_cycle_id && (
                        <p className="text-sm text-red-600 mt-1">{errors.menu_cycle_id.message}</p>
                      )}
                    </div>

                    {selectedCycle && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Información del Ciclo</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-blue-700">Duración:</span>
                            <span className="ml-2 font-medium">{selectedCycle.duration_days} días</span>
                          </div>
                          <div>
                            <span className="text-blue-700">Estado:</span>
                            <Badge variant="default" className="ml-2">
                              {selectedCycle.status}
                            </Badge>
                          </div>
                          {selectedCycle.description && (
                            <div className="col-span-2">
                              <span className="text-blue-700">Descripción:</span>
                              <p className="mt-1 text-blue-800">{selectedCycle.description}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Fechas */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Período de Vigencia
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start_date">Fecha de Inicio *</Label>
                      <Controller
                        name="start_date"
                        control={control}
                        render={({ field }) => (
                          <Input id="start-date-input" {...field} type="date" className="mt-1" min={new Date().toISOString().split("T")[0]} />
                        )}
                      />
                      {errors.start_date && <p className="text-sm text-red-600 mt-1">{errors.start_date.message}</p>}
                    </div>

                    <div>
                      <Label htmlFor="end_date">Fecha de Fin *</Label>
                      <Controller
                        name="end_date"
                        control={control}
                        render={({ field }) => (
                          <Input id="end-date-input" {...field} type="date" className="mt-1" min={new Date().toISOString().split("T")[0]} />
                        )}
                      />
                      {errors.end_date && <p className="text-sm text-red-600 mt-1">{errors.end_date.message}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cobertura */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Cobertura
                    </div>
                    {totalSelectedLocations > 0 && (
                      <Badge variant="outline">
                        {totalSelectedLocations} ubicación{totalSelectedLocations !== 1 ? "es" : ""} seleccionada
                        {totalSelectedLocations !== 1 ? "s" : ""}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingLocations ? (
                    <div className="text-center py-4" id="loading-locations">
                      <Clock className="h-6 w-6 animate-spin mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Cargando ubicaciones...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="locations-grid">
                      {/* Campus */}
                      <div id="campus-selection">
                        <h4 className="font-medium mb-3 flex items-center gap-2" id="campus-title">
                          <MapPin className="h-4 w-4" />
                          Campus ({campuses.length})
                        </h4>
                        <ScrollArea className="h-40 border rounded-md p-3" id="campus-list">
                          <div className="space-y-2">
                            {campuses.map((campus) => (
                              <div key={campus.id} className="flex items-center space-x-2" id={`campus-item-${campus.id}`}>
                                <Checkbox
                                  id={`campus-checkbox-${campus.id}`}
                                  checked={watchedCampusIds?.includes(campus.id.toString()) || false}
                                  onCheckedChange={(checked) =>
                                    handleCampusChange(campus.id.toString(), checked as boolean)
                                  }
                                />
                                <Label
                                  htmlFor={`campus-checkbox-${campus.id}`}
                                  className="text-sm font-normal cursor-pointer flex-1"
                                >
                                  {campus.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>

                      {/* Municipios */}
                      <div id="towns-selection">
                        <h4 className="font-medium mb-3 flex items-center gap-2" id="towns-title">
                          <MapPin className="h-4 w-4" />
                          Municipios ({towns.length})
                        </h4>
                        <ScrollArea className="h-40 border rounded-md p-3" id="towns-list">
                          <div className="space-y-2">
                            {towns.map((town) => (
                              <div key={town.id} className="flex items-center space-x-2" id={`town-item-${town.id}`}>
                                <Checkbox
                                  id={`town-checkbox-${town.id}`}
                                  checked={watchedTownIds?.includes(town.id.toString()) || false}
                                  onCheckedChange={(checked) =>
                                    handleTownChange(town.id.toString(), checked as boolean)
                                  }
                                />
                                <Label
                                  htmlFor={`town-checkbox-${town.id}`}
                                  className="text-sm font-normal cursor-pointer flex-1"
                                >
                                  {town.name}
                                  <span className="text-xs text-muted-foreground block">
                                    {town.name ? `(${town.name})` : "Sin nombre"}
                                  </span>
                                </Label>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  )}

                  {errors.campus_ids && <p className="text-sm text-red-600 mt-2">{errors.campus_ids.message}</p>}
                </CardContent>
              </Card>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-3 pt-4 border-t" id="menu-schedule-form-actions">
              <Button type="button" variant="outline" onClick={onClose} id="menu-schedule-form-cancel-btn">
                Cancelar
              </Button>
              <Button type="submit" disabled={!isValid || isLoading || loadingLocations} id="menu-schedule-form-submit-btn">
                {isLoading ? "Guardando..." : initialData ? "Actualizar" : "Asignar Ciclo"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
