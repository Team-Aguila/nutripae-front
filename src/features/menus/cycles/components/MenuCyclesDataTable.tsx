import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal, Edit, PowerOff, Search, Calendar, Users } from "lucide-react";
import type { MenuCycleResponse } from "@team-aguila/pae-menus-client";

interface MenuCyclesDataTableProps {
  data: MenuCycleResponse[];
  onEdit: (cycle: MenuCycleResponse) => void;
  onToggleStatus: (cycle: MenuCycleResponse, newStatus: "active" | "inactive") => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge variant="default">Activo</Badge>;
    case "inactive":
      return <Badge variant="secondary">Inactivo</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getDayLabel = (day: string) => {
  const dayLabels = {
    monday: "Lun",
    tuesday: "Mar",
    wednesday: "Mié",
    thursday: "Jue",
    friday: "Vie",
    saturday: "Sáb",
    sunday: "Dom",
  };
  return dayLabels[day as keyof typeof dayLabels] || day;
};

export const MenuCyclesDataTable = ({ data, onEdit, onToggleStatus }: MenuCyclesDataTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active">("all");
  const [toggleStatusDialogOpen, setToggleStatusDialogOpen] = useState(false);
  const [cycleToToggleStatus, setCycleToToggleStatus] = useState<MenuCycleResponse | null>(null);

  // Filtrar datos por búsqueda y estado
  const filteredData = data.filter((cycle) => {
    const matchesSearch =
      cycle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cycle.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || cycle.status === "active";

    return matchesSearch && matchesStatus;
  });

  const handleToggleStatusClick = (cycle: MenuCycleResponse) => {
    setCycleToToggleStatus(cycle);
    setToggleStatusDialogOpen(true);
  };

  const handleToggleStatusConfirm = () => {
    if (cycleToToggleStatus) {
      const newStatus = cycleToToggleStatus.status === "active" ? "inactive" : "active";
      onToggleStatus(cycleToToggleStatus, newStatus);
      setCycleToToggleStatus(null);
      setToggleStatusDialogOpen(false);
    }
  };

  const handleToggleStatusCancel = () => {
    setCycleToToggleStatus(null);
    setToggleStatusDialogOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lista de Ciclos de Menú</span>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar ciclos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <div className="flex items-center space-x-2 text-white">
                <span className="text-xs font-medium">Estado:</span>
                <div className="flex rounded-md border border-gray-300 bg-secondary p-0.5 shadow-sm">
                  <Button
                    variant={statusFilter === "all" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setStatusFilter("all")}
                    className={`h-6 px-2 text-xs ${
                      statusFilter === "all"
                        ? "bg-blue-600 hover:bg-blue-700 shadow-sm"
                        : "hover:text-gray-400 hover:bg-gray-100"
                    }`}
                  >
                    Todos
                  </Button>
                  <Button
                    variant={statusFilter === "active" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setStatusFilter("active")}
                    className={`h-6 px-2 text-xs ${
                      statusFilter === "active"
                        ? "bg-green-600 hover:bg-green-700 shadow-sm"
                        : "hover:text-gray-400 hover:bg-gray-100"
                    }`}
                  >
                    Solo activos
                  </Button>
                </div>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Semanas</TableHead>
                  <TableHead>Días configurados</TableHead>
                  <TableHead>Platos únicos</TableHead>
                  <TableHead>Fecha creación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {searchTerm
                        ? "No se encontraron ciclos que coincidan con la búsqueda"
                        : "No hay ciclos de menú registrados"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((cycle) => {
                    const uniqueDishes = new Set();
                    cycle.daily_menus?.forEach((menu) => {
                      // Los dish_ids son arrays, necesitamos iterar sobre ellos
                      menu.breakfast_dish_ids?.forEach((id) => uniqueDishes.add(id));
                      menu.lunch_dish_ids?.forEach((id) => uniqueDishes.add(id));
                      menu.snack_dish_ids?.forEach((id) => uniqueDishes.add(id));
                    });

                    return (
                      <TableRow key={cycle._id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{cycle.name}</div>
                            {cycle.description && (
                              <div className="text-sm text-muted-foreground line-clamp-2">{cycle.description}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(cycle.status || "inactive")}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {Math.ceil((cycle.duration_days || 0) / 7)} semana
                            {Math.ceil((cycle.duration_days || 0) / 7) !== 1 ? "s" : ""}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">{cycle.daily_menus?.length || 0} días</div>
                            {cycle.daily_menus && cycle.daily_menus.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {cycle.daily_menus.slice(0, 7).map((menu, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {getDayLabel(String(menu.day))}
                                  </Badge>
                                ))}
                                {cycle.daily_menus.length > 7 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{cycle.daily_menus.length - 7}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            {uniqueDishes.size} platos
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {cycle.created_at ? new Date(cycle.created_at).toLocaleDateString("es-ES") : "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menú</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onEdit(cycle)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleToggleStatusClick(cycle)}
                                className={
                                  cycle.status === "active"
                                    ? "text-orange-600 focus:text-orange-600"
                                    : "text-green-600 focus:text-green-600"
                                }
                              >
                                <PowerOff className="mr-2 h-4 w-4" />
                                {cycle.status === "active" ? "Desactivar" : "Activar"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={toggleStatusDialogOpen} onOpenChange={setToggleStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {cycleToToggleStatus?.status === "active" ? "¿Desactivar ciclo de menú?" : "¿Activar ciclo de menú?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción {cycleToToggleStatus?.status === "active" ? "desactivará" : "activará"} el ciclo de menú
              <strong> "{cycleToToggleStatus?.name}"</strong>.
              {cycleToToggleStatus?.status === "active"
                ? " Los menús asociados no se eliminarán pero el ciclo no estará disponible para nuevas asignaciones."
                : " El ciclo estará disponible para nuevas asignaciones."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleToggleStatusCancel}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleStatusConfirm}
              className={
                cycleToToggleStatus?.status === "active"
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "bg-green-600 hover:bg-green-700"
              }
            >
              {cycleToToggleStatus?.status === "active" ? "Desactivar" : "Activar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
