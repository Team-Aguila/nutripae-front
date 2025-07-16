import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, ChefHat } from "lucide-react";
import type { DishResponse } from "@team-aguila/pae-menus-client";

interface DishDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  dish: DishResponse | null;
}

const MEAL_TYPE_LABELS = {
  desayuno: "Desayuno",
  almuerzo: "Almuerzo",
  refrigerio: "Refrigerio",
};

export const DishDetailsModal = ({ isOpen, onClose, dish }: DishDetailsModalProps) => {
  if (!dish) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent id="dish-details-modal" className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle id="dish-details-title" className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            Detalles del Plato: {dish.name}
          </DialogTitle>
        </DialogHeader>

        <div id="dish-details-content" className="space-y-6">
          {/* Información básica */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Nombre</h4>
                  <p className="font-medium">{dish.name}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Estado</h4>
                  <Badge variant={dish.status === "active" ? "default" : "secondary"}>
                    {dish.status === "active" ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </div>

              {dish.description && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Descripción</h4>
                  <p className="text-sm">{dish.description}</p>
                </div>
              )}

              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Tipos de comida compatibles</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {dish.compatible_meal_types.map((type) => (
                    <Badge key={type} variant="outline">
                      {MEAL_TYPE_LABELS[type as keyof typeof MEAL_TYPE_LABELS] || type}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Fecha de creación</h4>
                <div className="flex items-center gap-1 mt-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{new Date(dish.created_at).toLocaleDateString("es-ES")}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información nutricional */}
          {dish.nutritional_info && (dish.nutritional_info.calories || dish.nutritional_info.protein) && (
            <Card>
              <CardHeader>
                <CardTitle>Información Nutricional</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {dish.nutritional_info.calories && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Calorías</h4>
                      <p className="text-lg font-semibold">{dish.nutritional_info.calories} cal</p>
                    </div>
                  )}
                  {dish.nutritional_info.protein && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Proteína</h4>
                      <p className="text-lg font-semibold">{dish.nutritional_info.protein}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Receta - Ingredientes */}
          <Card>
            <CardHeader>
              <CardTitle>Receta</CardTitle>
              <CardDescription>Ingredientes necesarios para preparar este plato</CardDescription>
            </CardHeader>
            <CardContent>
              <Table id="dish-recipe-table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Ingrediente ID</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead className="text-right">Unidad</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody id="dish-recipe-table-body">
                  {dish.recipe?.ingredients?.map((ingredient, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{ingredient.ingredient_id}</TableCell>
                      <TableCell className="text-right">{ingredient.quantity}</TableCell>
                      <TableCell className="text-right">{ingredient.unit}</TableCell>
                    </TableRow>
                  )) || (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                          No hay ingredientes registrados
                        </TableCell>
                      </TableRow>
                    )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
