import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Building, Building2, MapIcon } from "lucide-react";
import { useMenuCycles } from "../../cycles/hooks/useMenuCycles";
import { useQuery } from "@tanstack/react-query";
import { httpGet } from "@/lib/http-client";
import type { MenuScheduleAssignmentRequest } from "../api/assignMenuCycle";
import type { MenuScheduleResponse } from "../api/getMenuSchedules";

// Tipos locales
interface Department {
  id: string;
  name: string;
  code?: string;
}

interface DepartmentTown {
  id: string;
  name: string;
  department_id: string;
}

interface Institution {
  id: string;
  name: string;
  town_id: string;
  type?: string;
}

interface Campus {
  id: string;
  name: string;
  institution_id: string;
  address?: string;
}

// APIs locales
const getDepartments = async (): Promise<Department[]> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const url = `${base_coverage_url}/departments`;
  return httpGet<Department[]>(url);
};

const getDepartmentTowns = async (departmentId: string): Promise<DepartmentTown[]> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const url = `${base_coverage_url}/departments/${departmentId}/towns`;
  return httpGet<DepartmentTown[]>(url);
};

const getTownInstitutions = async (townId: string): Promise<Institution[]> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const url = `${base_coverage_url}/towns/${townId}/institutions`;
  return httpGet<Institution[]>(url);
};

const getInstitutionCampus = async (institutionId: string): Promise<Campus[]> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const url = `${base_coverage_url}/institutions/${institutionId}/campus`;
  return httpGet<Campus[]>(url);
};

// Hooks locales
const useDepartments = () => {
  return useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

const useDepartmentTowns = (departmentId: string | undefined) => {
  return useQuery({
    queryKey: ["departments", departmentId, "towns"],
    queryFn: () => getDepartmentTowns(departmentId!),
    enabled: !!departmentId,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

const useTownInstitutions = (townId: string | undefined) => {
  return useQuery({
    queryKey: ["towns", townId, "institutions"],
    queryFn: () => getTownInstitutions(townId!),
    enabled: !!townId,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

const useInstitutionCampus = (institutionId: string | undefined) => {
  return useQuery({
    queryKey: ["institutions", institutionId, "campus"],
    queryFn: () => getInstitutionCampus(institutionId!),
    enabled: !!institutionId,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

const menuScheduleSchema = z
  .object({
    menu_cycle_id: z.string().min(1, "Debe seleccionar un ciclo de menú"),
    department_id: z.string().optional(),
    town_id: z.string().optional(),
    institution_id: z.string().optional(),
    campus_ids: z.array(z.string()).min(1, "Debe seleccionar al menos un campus"),
    start_date: z.string().min(1, "La fecha de inicio es obligatoria"),
    end_date: z.string().min(1, "La fecha de fin es obligatoria"),
  })
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
  // Estados para manejar la jerarquía de selección
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | undefined>();
  const [selectedTownId, setSelectedTownId] = useState<string | undefined>();
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string | undefined>();

  // Queries para obtener datos con tipado explícito
  const { data: departments = [], isLoading: loadingDepartments } = useDepartments();
  const { data: towns = [], isLoading: loadingTowns } = useDepartmentTowns(selectedDepartmentId);
  const { data: institutions = [], isLoading: loadingInstitutions } = useTownInstitutions(selectedTownId);
  const { data: campuses = [], isLoading: loadingCampuses } = useInstitutionCampus(selectedInstitutionId);

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
      department_id: "",
      town_id: "",
      institution_id: "",
      campus_ids: [],
      start_date: "",
      end_date: "",
    },
  });

  const watchedMenuCycleId = watch("menu_cycle_id");
  const watchedCampusIds = watch("campus_ids");

  // Resetear formulario cuando se abre/cierra
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setValue("menu_cycle_id", initialData.menu_cycle_id);
        setValue("start_date", initialData.start_date.split("T")[0]);
        setValue("end_date", initialData.end_date.split("T")[0]);

        const campusIds = initialData.coverage.filter((c) => c.location_type === "campus").map((c) => c.location_id);

        setValue("campus_ids", campusIds);
      } else {
        reset();
        setSelectedDepartmentId(undefined);
        setSelectedTownId(undefined);
        setSelectedInstitutionId(undefined);
      }
    }
  }, [isOpen, initialData, setValue, reset]);

  // Resetear selecciones cuando cambian los niveles superiores
  useEffect(() => {
    if (!selectedDepartmentId) {
      setSelectedTownId(undefined);
      setSelectedInstitutionId(undefined);
      setValue("town_id", "");
      setValue("institution_id", "");
      setValue("campus_ids", []);
    }
  }, [selectedDepartmentId, setValue]);

  useEffect(() => {
    if (!selectedTownId) {
      setSelectedInstitutionId(undefined);
      setValue("institution_id", "");
      setValue("campus_ids", []);
    }
  }, [selectedTownId, setValue]);

  useEffect(() => {
    if (!selectedInstitutionId) {
      setValue("campus_ids", []);
    }
  }, [selectedInstitutionId, setValue]);

  const handleFormSubmit = (data: MenuScheduleFormData) => {
    onSubmit({
      menu_cycle_id: data.menu_cycle_id,
      campus_ids: data.campus_ids?.length ? data.campus_ids : [],
      start_date: data.start_date,
      end_date: data.end_date,
    });
  };

  const handleDepartmentChange = (departmentId: string) => {
    setSelectedDepartmentId(departmentId);
    setValue("department_id", departmentId);
  };

  const handleTownChange = (townId: string) => {
    setSelectedTownId(townId);
    setValue("town_id", townId);
  };

  const handleInstitutionChange = (institutionId: string) => {
    setSelectedInstitutionId(institutionId);
    setValue("institution_id", institutionId);
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

  const selectedCycle = activeCycles.find((cycle) => cycle._id === watchedMenuCycleId);
  const totalSelectedCampuses = watchedCampusIds?.length || 0;

  const isLoadingAnyData = loadingDepartments || loadingTowns || loadingInstitutions || loadingCampuses;

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
                    {totalSelectedCampuses > 0 && (
                      <Badge variant="outline">
                        {totalSelectedCampuses} campus
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingAnyData ? (
                    <div className="text-center py-4" id="loading-locations">
                      <Clock className="h-6 w-6 animate-spin mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Cargando ubicaciones...</p>
                    </div>
                  ) : (
                    <div className="space-y-6" id="coverage-hierarchy">
                      {/* Departamentos */}
                      <div id="department-selection">
                        <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                          <MapIcon className="h-4 w-4" />
                          Departamento
                        </Label>
                        <Select
                          value={selectedDepartmentId || ""}
                          onValueChange={handleDepartmentChange}
                          disabled={loadingDepartments}
                        >
                          <SelectTrigger id="department-select">
                            <SelectValue placeholder="Seleccionar departamento" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((department: any) => (
                              <SelectItem key={department.id} value={department.id}>
                                {department.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Ciudades */}
                      <div id="town-selection">
                        <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Ciudad
                        </Label>
                        <Select
                          value={selectedTownId || ""}
                          onValueChange={handleTownChange}
                          disabled={!selectedDepartmentId || loadingTowns}
                        >
                          <SelectTrigger id="town-select">
                            <SelectValue placeholder={
                              !selectedDepartmentId
                                ? "Primero seleccione un departamento"
                                : loadingTowns
                                  ? "Cargando ciudades..."
                                  : "Seleccionar ciudad"
                            } />
                          </SelectTrigger>
                          <SelectContent>
                            {towns.map((town: any) => (
                              <SelectItem key={town.id} value={town.id}>
                                {town.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Instituciones */}
                      <div id="institution-selection">
                        <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          Institución
                        </Label>
                        <Select
                          value={selectedInstitutionId || ""}
                          onValueChange={handleInstitutionChange}
                          disabled={!selectedTownId || loadingInstitutions}
                        >
                          <SelectTrigger id="institution-select">
                            <SelectValue placeholder={
                              !selectedTownId
                                ? "Primero seleccione una ciudad"
                                : loadingInstitutions
                                  ? "Cargando instituciones..."
                                  : "Seleccionar institución"
                            } />
                          </SelectTrigger>
                          <SelectContent>
                            {institutions.map((institution: any) => (
                              <SelectItem key={institution.id} value={institution.id}>
                                <div className="flex flex-col">
                                  <span>{institution.name}</span>
                                  {institution.type && (
                                    <span className="text-xs text-muted-foreground">{institution.type}</span>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Campus */}
                      {selectedInstitutionId && (
                        <div id="campus-selection">
                          <Label className="text-sm font-medium mb-3 flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            Campus ({campuses.length})
                          </Label>
                          {loadingCampuses ? (
                            <div className="text-center py-4">
                              <Clock className="h-6 w-6 animate-spin mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">Cargando campus...</p>
                            </div>
                          ) : campuses.length === 0 ? (
                            <div className="text-center py-4 text-muted-foreground">
                              <Building className="h-6 w-6 mx-auto mb-2" />
                              <p className="text-sm">No hay campus disponibles para esta institución</p>
                            </div>
                          ) : (
                            <ScrollArea className="h-40 border rounded-md p-3" id="campus-list">
                              <div className="space-y-2">
                                {campuses.map((campus: any) => (
                                  <div key={campus.id} className="flex items-center space-x-2" id={`campus-item-${campus.id}`}>
                                    <Checkbox
                                      id={`campus-checkbox-${campus.id}`}
                                      checked={watchedCampusIds?.includes(campus.id) || false}
                                      onCheckedChange={(checked) =>
                                        handleCampusChange(campus.id, checked as boolean)
                                      }
                                    />
                                    <Label
                                      htmlFor={`campus-checkbox-${campus.id}`}
                                      className="text-sm font-normal cursor-pointer flex-1"
                                    >
                                      <div>
                                        <div>{campus.name}</div>
                                        {campus.address && (
                                          <div className="text-xs text-muted-foreground">{campus.address}</div>
                                        )}
                                      </div>
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          )}
                          {errors.campus_ids && <p className="text-sm text-red-600 mt-2">{errors.campus_ids.message}</p>}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-3 pt-4 border-t" id="menu-schedule-form-actions">
              <Button type="button" variant="outline" onClick={onClose} id="menu-schedule-form-cancel-btn">
                Cancelar
              </Button>
              <Button type="submit" disabled={!isValid || isLoading || isLoadingAnyData} id="menu-schedule-form-submit-btn">
                {isLoading ? "Guardando..." : initialData ? "Actualizar" : "Asignar Ciclo"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
