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
      <Card id="menu-cycles-data-table-card">
        <CardHeader id="menu-cycles-data-table-header">
          <CardTitle className="flex items-center justify-between" id="menu-cycles-data-table-title">
            <span>Lista de Ciclos de Menú</span>
            <div className="flex items-center space-x-2" id="menu-cycles-search-controls">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar ciclos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                  id="menu-cycles-search-input"
                />
              </div>
              <Button
                variant={statusFilter === "active" ? "default" : "outline"}
                onClick={() => setStatusFilter(statusFilter === "active" ? "all" : "active")}
                id="menu-cycles-status-filter-btn"
              >
                {statusFilter === "active" ? "Solo Activos" : "Todos"}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent id="menu-cycles-data-table-content">
          <Table id="menu-cycles-table">
            <TableHeader id="menu-cycles-table-header">
              <TableRow id="menu-cycles-table-header-row">
                <TableHead id="menu-cycles-header-name">Nombre</TableHead>
                <TableHead id="menu-cycles-header-description">Descripción</TableHead>
                <TableHead id="menu-cycles-header-duration">Duración</TableHead>
                <TableHead id="menu-cycles-header-days">Días con Menú</TableHead>
                <TableHead id="menu-cycles-header-status">Estado</TableHead>
                <TableHead id="menu-cycles-header-actions" className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody id="menu-cycles-table-body">
              {filteredData.length === 0 ? (
                <TableRow id="menu-cycles-no-data-row">
                  <TableCell colSpan={6} className="text-center py-8" id="menu-cycles-no-data-cell">
                    <div className="flex flex-col items-center space-y-2">
                      <Calendar className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        {searchTerm || statusFilter !== "all"
                          ? "No se encontraron ciclos con los filtros aplicados"
                          : "No hay ciclos de menú registrados"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((cycle, index) => (
                  <TableRow key={cycle._id} id={`menu-cycle-row-${index}`}>
                    <TableCell className="font-medium" id={`menu-cycle-name-${index}`}>
                      {cycle.name}
                    </TableCell>
                    <TableCell id={`menu-cycle-description-${index}`}>
                      {cycle.description || "-"}
                    </TableCell>
                    <TableCell id={`menu-cycle-duration-${index}`}>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{cycle.duration_days} días</span>
                      </div>
                    </TableCell>
                    <TableCell id={`menu-cycle-days-${index}`}>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{cycle.daily_menus?.length || 0} días</span>
                      </div>
                    </TableCell>
                    <TableCell id={`menu-cycle-status-${index}`}>
                      {getStatusBadge(cycle.status)}
                    </TableCell>
                    <TableCell className="text-right" id={`menu-cycle-actions-${index}`}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0" id={`menu-cycle-actions-btn-${index}`}>
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" id={`menu-cycle-actions-menu-${index}`}>
                          <DropdownMenuItem
                            onClick={() => onEdit(cycle)}
                            id={`menu-cycle-edit-action-${index}`}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleStatusClick(cycle)}
                            id={`menu-cycle-toggle-status-action-${index}`}
                          >
                            <PowerOff className="mr-2 h-4 w-4" />
                            {cycle.status === "active" ? "Desactivar" : "Activar"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de confirmación para cambio de estado */}
      <AlertDialog open={toggleStatusDialogOpen} onOpenChange={setToggleStatusDialogOpen}>
        <AlertDialogContent id="menu-cycle-toggle-status-dialog">
          <AlertDialogHeader id="menu-cycle-toggle-status-dialog-header">
            <AlertDialogTitle id="menu-cycle-toggle-status-dialog-title">
              {cycleToToggleStatus?.status === "active" ? "Desactivar" : "Activar"} Ciclo de Menú
            </AlertDialogTitle>
            <AlertDialogDescription id="menu-cycle-toggle-status-dialog-description">
              ¿Estás seguro de que quieres{" "}
              {cycleToToggleStatus?.status === "active" ? "desactivar" : "activar"} el ciclo de menú{" "}
              <strong>"{cycleToToggleStatus?.name}"</strong>?
              {cycleToToggleStatus?.status === "active" && (
                <span className="block mt-2 text-amber-600">
                  Al desactivar este ciclo, no estará disponible para ser asignado.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter id="menu-cycle-toggle-status-dialog-footer">
            <AlertDialogCancel onClick={handleToggleStatusCancel} id="menu-cycle-toggle-status-cancel-btn">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleStatusConfirm} id="menu-cycle-toggle-status-confirm-btn">
              {cycleToToggleStatus?.status === "active" ? "Desactivar" : "Activar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
