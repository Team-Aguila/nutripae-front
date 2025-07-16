import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2 } from "lucide-react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import type { PurchaseOrderCreate, PurchaseOrderResponse } from "@team-aguila/pae-compras-client";

const purchaseOrderItemSchema = z.object({
  product_id: z.string().min(1, "Selecciona un producto"),
  quantity: z.number().min(1, "La cantidad debe ser mayor a 0"),
  price: z.number().min(0, "El precio debe ser mayor o igual a 0"),
});

const purchaseOrderSchema = z.object({
  provider_id: z.string().min(1, "Selecciona un proveedor"),
  required_delivery_date: z.string().optional(),
  items: z.array(purchaseOrderItemSchema).min(1, "Debe agregar al menos un item"),
});

type PurchaseOrderFormData = z.infer<typeof purchaseOrderSchema>;

interface PurchaseOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PurchaseOrderCreate) => void;
  initialData?: PurchaseOrderResponse;
  isLoading?: boolean;
}

export const PurchaseOrderForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: PurchaseOrderFormProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PurchaseOrderFormData>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      provider_id: "",
      required_delivery_date: "",
      items: [{ product_id: "", quantity: 1, price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    if (initialData) {
      reset({
        provider_id: initialData.provider_id,
        required_delivery_date: initialData.required_delivery_date || "",
        items: initialData.line_items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: parseFloat(item.price),
        })),
      });
    } else {
      reset({
        provider_id: "",
        required_delivery_date: "",
        items: [{ product_id: "", quantity: 1, price: 0 }],
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data: PurchaseOrderFormData) => {
    const formattedData: PurchaseOrderCreate = {
      provider_id: data.provider_id,
      required_delivery_date: data.required_delivery_date || undefined,
      items: data.items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    onSubmit(formattedData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Orden de Compra" : "Nueva Orden de Compra"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Modifica los detalles de la orden de compra." : "Crea una nueva orden de compra manual."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4">
              {/* Proveedor */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="provider_id">Proveedor *</Label>
                  <Controller
                    name="provider_id"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un proveedor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="provider1">Proveedor 1</SelectItem>
                          <SelectItem value="provider2">Proveedor 2</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.provider_id && <p className="text-red-500 text-sm mt-1">{errors.provider_id.message}</p>}
                </div>

                <div>
                  <Label htmlFor="required_delivery_date">Fecha de Entrega Requerida</Label>
                  <Controller
                    name="required_delivery_date"
                    control={control}
                    render={({ field }) => <Input {...field} type="date" placeholder="Selecciona la fecha" />}
                  />
                </div>
              </div>

              {/* Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Items de la Orden</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex items-end gap-4 p-4 border rounded-lg">
                        <div className="flex-1">
                          <Label>Producto *</Label>
                          <Controller
                            name={`items.${index}.product_id`}
                            control={control}
                            render={({ field }) => (
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona un producto" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="product1">Producto 1</SelectItem>
                                  <SelectItem value="product2">Producto 2</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors.items?.[index]?.product_id && (
                            <p className="text-red-500 text-sm mt-1">{errors.items[index]?.product_id?.message}</p>
                          )}
                        </div>

                        <div className="w-24">
                          <Label>Cantidad *</Label>
                          <Controller
                            name={`items.${index}.quantity`}
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                type="number"
                                min="1"
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              />
                            )}
                          />
                          {errors.items?.[index]?.quantity && (
                            <p className="text-red-500 text-sm mt-1">{errors.items[index]?.quantity?.message}</p>
                          )}
                        </div>

                        <div className="w-32">
                          <Label>Precio *</Label>
                          <Controller
                            name={`items.${index}.price`}
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                type="number"
                                step="0.01"
                                min="0"
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            )}
                          />
                          {errors.items?.[index]?.price && (
                            <p className="text-red-500 text-sm mt-1">{errors.items[index]?.price?.message}</p>
                          )}
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => remove(index)}
                          disabled={fields.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => append({ product_id: "", quantity: 1, price: 0 })}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Item
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : initialData ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
