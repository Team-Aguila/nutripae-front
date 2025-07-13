import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, RotateCcw, ArrowRightLeft } from "lucide-react";
import { type InventoryMovement } from "@/features/purchases/inventory-movements/api/inventoryMovements";
import { type Product } from "@/features/purchases/products/api/products";
import { formatDateForDisplayManual, formatDateOnlyForDisplayManual } from "../utils/dateUtils";

interface MovementDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  movement: InventoryMovement | null;
  products: Product[];
}

export function MovementDetailsDialog({
  open,
  onClose,
  movement,
  products,
}: MovementDetailsDialogProps) {
  if (!movement) return null;

  const product = products.find((p) => p._id === movement.product_id);

  const getMovementIcon = (type: string) => {
    const icons = {
      receipt: <TrendingUp className="w-5 h-5 text-green-600" />,
      usage: <TrendingDown className="w-5 h-5 text-red-600" />,
      adjustment: <RotateCcw className="w-5 h-5 text-yellow-600" />,
      expired: <ArrowRightLeft className="w-5 h-5 text-gray-600" />,
      loss: <ArrowRightLeft className="w-5 h-5 text-orange-600" />,
    };
    return icons[type as keyof typeof icons] || icons["receipt"];
  };

  const getMovementBadge = (type: string) => {
    const config = {
      receipt: { variant: "default" as const, className: "bg-green-100 text-green-800", label: "Entrada" },
      usage: { variant: "secondary" as const, className: "bg-red-100 text-red-800", label: "Salida" },
      adjustment: { variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800", label: "Ajuste" },
      expired: { variant: "secondary" as const, className: "bg-gray-100 text-gray-800", label: "Vencido" },
      loss: { variant: "secondary" as const, className: "bg-orange-100 text-orange-800", label: "Pérdida" },
    };
    return config[type as keyof typeof config] || config["receipt"];
  };

  const movementBadge = getMovementBadge(movement.movement_type);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {getMovementIcon(movement.movement_type)}
            <span>Detalles del Movimiento</span>
            <Badge {...movementBadge}>
              {movementBadge.label}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Información completa del movimiento de inventario
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información del Producto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Información del Producto</h3>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Producto</label>
              <p className="text-sm font-medium">{product?.name || "Producto no encontrado"}</p>
              <p className="text-xs text-gray-500">ID: {movement.product_id}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Cantidad</label>
              <p className="text-sm">
                <span className={`font-medium ${movement.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                  {movement.quantity > 0 ? "+" : ""}{movement.quantity}
                </span>{" "}
                {movement.unit}
              </p>
            </div>

            {movement.lot && (
              <div>
                <label className="text-sm font-medium text-gray-500">Lote</label>
                <p className="text-sm">{movement.lot}</p>
              </div>
            )}

            {movement.expiration_date && (
              <div>
                <label className="text-sm font-medium text-gray-500">Fecha de Vencimiento</label>
                <p className="text-sm">{formatDateOnlyForDisplayManual(movement.expiration_date)}</p>
              </div>
            )}
          </div>

          {/* Información del Movimiento */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Información del Movimiento</h3>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Fecha y Hora</label>
              <p className="text-sm">{formatDateForDisplayManual(movement.movement_date)}</p>
              <p className="text-xs text-gray-500">Colombia (UTC-5)</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Usuario</label>
              <p className="text-sm">{movement.created_by}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Institución</label>
              <p className="text-sm">ID: {movement.institution_id}</p>
            </div>

            {movement.storage_location && (
              <div>
                <label className="text-sm font-medium text-gray-500">Ubicación de Almacenamiento</label>
                <p className="text-sm">{movement.storage_location}</p>
              </div>
            )}

            {movement.notes && (
              <div>
                <label className="text-sm font-medium text-gray-500">Notas/Razón</label>
                <p className="text-sm bg-gray-50 text-gray-900 p-2 rounded font-medium">{movement.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Información Técnica */}
        <div className="mt-6 pt-4 border-t">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Información Técnica</h3>
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
            <div>
              <span className="font-medium">ID del Movimiento:</span>
              <p className="font-mono">{movement._id}</p>
            </div>
            <div>
              <span className="font-medium">Tipo de Movimiento:</span>
              <p>{movement.movement_type}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
