import { SiteHeader } from "@/components/site-header";
import { DailyAvailabilitiesDataTable } from "../components/DailyAvailabilitiesDataTable";
import { useEnrichedDailyAvailabilities } from "../hooks/useEnrichedDailyAvailabilities";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import type { EnrichedDailyAvailabilityDetails } from "../hooks/useEnrichedDailyAvailabilities";
import { useState, useRef, useEffect } from "react";
import { createDailyAvailability } from "../api/createDailyAvailability";
import { getEmployees } from "../api/getEmployees";
import { getAvailabilityStatuses } from "../api/getAvailabilityStatuses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, PlusIcon, FilterIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

const DailyAvailabilityPage = () => {
  const queryClient = useQueryClient();
  const today = new Date();

  // Estados para filtros
  const [filterStartDate, setFilterStartDate] = useState<Date>(today);
  const [filterEndDate, setFilterEndDate] = useState<Date>(today);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // Estados para crear disponibilidad
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    employee_id: "",
    date: today.toISOString().split("T")[0],
    status_id: "",
    notes: "",
  });

  // Validar que las fechas estén en orden correcto
  const isValidDateRange = filterStartDate <= filterEndDate;

  // Query para obtener datos con filtros
  const {
    data: originalData,
    isLoading,
    error,
  } = useEnrichedDailyAvailabilities(
    format(filterStartDate, "yyyy-MM-dd"),
    format(filterEndDate, "yyyy-MM-dd"),
    selectedEmployee && selectedEmployee !== "all" ? parseInt(selectedEmployee) : undefined
  );

  // Query para obtener empleados
  const { data: employees } = useQuery({
    queryKey: ["hr", "employees"],
    queryFn: () => getEmployees(undefined, undefined, true), // Solo empleados activos
  });

  // Query para obtener estados de disponibilidad
  const { data: availabilityStatuses } = useQuery({
    queryKey: ["hr", "availabilityStatuses"],
    queryFn: getAvailabilityStatuses,
  });

  // Estado local para manejar las actualizaciones
  const [localData, setLocalData] = useState<EnrichedDailyAvailabilityDetails[]>([]);
  const isInitialized = useRef(false);

  // Sincronizar datos originales con datos locales solo una vez
  useEffect(() => {
    if (originalData && !isInitialized.current && isValidDateRange) {
      setLocalData([...originalData]);
      isInitialized.current = true;
    }
  }, [originalData, isValidDateRange]);

  // Mutación para crear disponibilidad
  const createAvailabilityMutation = useMutation({
    mutationFn: async (data: any) => {
      return createDailyAvailability({
        employee_id: parseInt(data.employee_id),
        date: data.date,
        status_id: parseInt(data.status_id),
        notes: data.notes || undefined,
      });
    },
    onSuccess: (newAvailability) => {
      // Actualizar datos locales inmediatamente
      const enrichedNewAvailability: EnrichedDailyAvailabilityDetails = {
        ...newAvailability,
        employee: employees?.find((emp) => emp.id === newAvailability.employee_id) || {
          id: newAvailability.employee_id,
          full_name: "Empleado",
          document_number: "",
          birth_date: "",
          hire_date: "",
          document_type_id: 1,
          gender_id: 1,
          operational_role_id: 0,
          is_active: true,
          created_at: "",
          updated_at: "",
          document_type: { id: 1, name: "Desconocido" },
          gender: { id: 1, name: "Desconocido" },
          operational_role: { id: 0, name: "Rol" },
          availabilities: [],
        },
      };

      setLocalData((prevData) => [...prevData, enrichedNewAvailability]);
      queryClient.invalidateQueries({ queryKey: ["hr", "dailyAvailabilities"] });

      // Limpiar formulario
      setCreateForm({
        employee_id: "",
        date: today.toISOString().split("T")[0],
        status_id: "",
        notes: "",
      });
      setIsCreateDialogOpen(false);
      toast.success("Disponibilidad creada exitosamente");
    },
    onError: (error: Error) => {
      // Mostrar mensaje específico para errores de validación o conflictos
      if (error.message.includes("Ya existe una disponibilidad")) {
        toast.error(error.message);
      } else if (error.message.includes("400")) {
        toast.error("Datos inválidos. Por favor, verifica la información ingresada.");
      } else if (error.message.includes("500")) {
        toast.error("Error del servidor. Por favor, intenta nuevamente más tarde.");
      } else {
        toast.error(error.message || "Error al crear la disponibilidad");
      }
    },
  });

  const handleCreateAvailability = () => {
    if (!createForm.employee_id || !createForm.status_id || !createForm.date) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    // Verificar si ya existe una disponibilidad para este empleado en esta fecha
    const existingAvailability = localData.find(
      (availability) =>
        availability.employee_id === parseInt(createForm.employee_id) && availability.date === createForm.date
    );

    if (existingAvailability) {
      toast.error(
        "Ya existe una disponibilidad registrada para este empleado en la fecha seleccionada. Por favor, selecciona otra fecha o edita la disponibilidad existente."
      );
      return;
    }

    createAvailabilityMutation.mutate(createForm);
  };

  const handleFilterChange = () => {
    // Resetear el estado local cuando cambian los filtros
    isInitialized.current = false;
    setLocalData([]);
  };

  // Aplicar filtros adicionales (por estado)
  const filteredData =
    selectedStatus && selectedStatus !== "all"
      ? localData.filter((item) => item.status.id.toString() === selectedStatus)
      : localData;

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <SiteHeader
          items={[
            { label: "Recursos Humanos", href: "/hr" },
            { label: "Disponibilidad Diaria", isCurrentPage: true },
          ]}
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-lg font-semibold">Cargando...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <SiteHeader
          items={[
            { label: "Recursos Humanos", href: "/hr" },
            { label: "Disponibilidad Diaria", isCurrentPage: true },
          ]}
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-red-600">Error al cargar disponibilidades diarias</h2>
            <p className="text-muted-foreground">{error instanceof Error ? error.message : "Error desconocido"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <SiteHeader
        items={[
          { label: "Recursos Humanos", href: "/hr" },
          { label: "Disponibilidad Diaria", isCurrentPage: true },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Disponibilidad Diaria</h1>
        <p className="text-muted-foreground">
          Gestión de la disponibilidad diaria del personal para planificación de turnos y asignación de tareas.
        </p>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FilterIcon className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtro por rango de fechas */}
            <div className="space-y-2">
              <Label>Fecha de inicio</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filterStartDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filterStartDate ? format(filterStartDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filterStartDate}
                    onSelect={(date) => {
                      if (date) {
                        setFilterStartDate(date);
                        handleFilterChange();
                      }
                    }}
                    locale={es}
                    showOutsideDays={false}
                    className="rounded-md border"
                    classNames={{
                      months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                      month: "space-y-4",
                      caption: "flex justify-center pt-1 relative items-center",
                      caption_label: "text-sm font-medium",
                      nav: "space-x-1 flex items-center",
                      nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex",
                      head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                      row: "flex w-full mt-2",
                      cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                      day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                      day_selected:
                        "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                      day_today: "bg-accent text-accent-foreground",
                      day_outside:
                        "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                      day_disabled: "text-muted-foreground opacity-50",
                      day_hidden: "invisible",
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Fecha de fin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filterEndDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filterEndDate ? format(filterEndDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filterEndDate}
                    onSelect={(date) => {
                      if (date) {
                        setFilterEndDate(date);
                        handleFilterChange();
                      }
                    }}
                    locale={es}
                    showOutsideDays={false}
                    className="rounded-md border"
                    classNames={{
                      months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                      month: "space-y-4",
                      caption: "flex justify-center pt-1 relative items-center",
                      caption_label: "text-sm font-medium",
                      nav: "space-x-1 flex items-center",
                      nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex",
                      head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                      row: "flex w-full mt-2",
                      cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                      day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                      day_selected:
                        "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                      day_today: "bg-accent text-accent-foreground",
                      day_outside:
                        "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                      day_disabled: "text-muted-foreground opacity-50",
                      day_hidden: "invisible",
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Filtro por empleado */}
            <div className="space-y-2">
              <Label>Empleado</Label>
              <Select
                value={selectedEmployee}
                onValueChange={(value) => {
                  setSelectedEmployee(value);
                  handleFilterChange();
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los empleados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los empleados</SelectItem>
                  {employees?.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id.toString()}>
                      {employee.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por estado */}
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  {availabilityStatuses?.map((status) => (
                    <SelectItem key={status.id} value={status.id.toString()}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mostrar mensaje de error si las fechas no son válidas */}
      {!isValidDateRange && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">
            ⚠️ La fecha de inicio no puede ser posterior a la fecha de fin. Por favor, ajusta las fechas para continuar.
          </p>
        </div>
      )}

      {/* Botón crear disponibilidad */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Disponibilidades</h2>
          <p className="text-muted-foreground">Mostrando {filteredData.length} disponibilidades</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              Crear Disponibilidad
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Nueva Disponibilidad</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="employee">Empleado *</Label>
                <Select
                  value={createForm.employee_id}
                  onValueChange={(value) => setCreateForm((prev) => ({ ...prev, employee_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar empleado" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees?.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id.toString()}>
                        {employee.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Fecha *</Label>
                <Input
                  id="date"
                  type="date"
                  value={createForm.date}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, date: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado *</Label>
                <Select
                  value={createForm.status_id}
                  onValueChange={(value) => setCreateForm((prev) => ({ ...prev, status_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {availabilityStatuses?.map((status) => (
                      <SelectItem key={status.id} value={status.id.toString()}>
                        {status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  placeholder="Notas adicionales..."
                  value={createForm.notes}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateAvailability} disabled={createAvailabilityMutation.isPending}>
                {createAvailabilityMutation.isPending ? "Creando..." : "Crear"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <DailyAvailabilitiesDataTable
        data={filteredData}
        onEdit={() => toast.info("La edición no está disponible en esta versión")}
      />
    </div>
  );
};

export default DailyAvailabilityPage;
