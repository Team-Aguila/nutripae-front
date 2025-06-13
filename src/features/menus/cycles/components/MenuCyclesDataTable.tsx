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
  onDeactivate: (cycle: MenuCycleResponse) => void;
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

export const MenuCyclesDataTable = ({ data, onEdit, onDeactivate }: MenuCyclesDataTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [cycleToDeactivate, setCycleToDeactivate] = useState<MenuCycleResponse | null>(null);

  const filteredData = data.filter(
    (cycle) =>
      cycle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cycle.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeactivateClick = (cycle: MenuCycleResponse) => {
    setCycleToDeactivate(cycle);
    setDeactivateDialogOpen(true);
  };

  const handleDeactivateConfirm = () => {
    if (cycleToDeactivate) {
      onDeactivate(cycleToDeactivate);
      setCycleToDeactivate(null);
      setDeactivateDialogOpen(false);
    }
  };

  const handleDeactivateCancel = () => {
    setCycleToDeactivate(null);
    setDeactivateDialogOpen(false);
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
                      if (menu.breakfast_dish_id) uniqueDishes.add(menu.breakfast_dish_id);
                      if (menu.lunch_dish_id) uniqueDishes.add(menu.lunch_dish_id);
                      if (menu.snack_dish_id) uniqueDishes.add(menu.snack_dish_id);
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
                        <TableCell>{getStatusBadge(cycle.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {cycle.weeks} semana{cycle.weeks !== 1 ? "s" : ""}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">{cycle.daily_menus?.length || 0} días</div>
                            {cycle.daily_menus && cycle.daily_menus.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {cycle.daily_menus.slice(0, 7).map((menu, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {getDayLabel(menu.day)}
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
                              {cycle.status === "active" && (
                                <DropdownMenuItem
                                  onClick={() => handleDeactivateClick(cycle)}
                                  className="text-orange-600"
                                >
                                  <PowerOff className="mr-2 h-4 w-4" />
                                  Desactivar
                                </DropdownMenuItem>
                              )}
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

      <AlertDialog open={deactivateDialogOpen} onOpenChange={setDeactivateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Desactivar ciclo de menú?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción desactivará el ciclo de menú
              <strong> "{cycleToDeactivate?.name}"</strong>. Los menús asociados no se eliminarán pero el ciclo no
              estará disponible para nuevas asignaciones.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeactivateCancel}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeactivateConfirm} className="bg-orange-600 hover:bg-orange-700">
              Desactivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
