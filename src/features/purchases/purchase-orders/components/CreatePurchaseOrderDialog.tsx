import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Plus, Trash2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import {
  createPurchaseOrder,
  type PurchaseOrderCreate,
  type PurchaseOrderItem,
} from "../api/purchaseOrders";

interface CreatePurchaseOrderDialogProps {
  open: boolean;
  onClose: () => void;
  onOrderCreated: () => void;
}

interface OrderItemForm extends Omit<PurchaseOrderItem, "product_name"> {
  product_name: string; // Para mostrar en el formulario
}

export function CreatePurchaseOrderDialog({
  open,
  onClose,
  onOrderCreated,
}: CreatePurchaseOrderDialogProps) {
  const [loading, setLoading] = useState(false);
  
  // Estado del formulario principal
  const [orderForm, setOrderForm] = useState({
    provider_id: "",
    institution_id: 1,
    expected_delivery_date: "",
    notes: "",
  });

  // Estado para los items de la orden
  const [items, setItems] = useState<OrderItemForm[]>([]);
  
  // Estado para el formulario de nuevo item
  const [newItem, setNewItem] = useState<OrderItemForm>({
    product_id: "",
    product_name: "",
    quantity: 0,
    unit: "unidad",
    unit_price: 0,
    total_price: 0,
  });

  const resetForm = () => {
    setOrderForm({
      provider_id: "",
      institution_id: 1,
      expected_delivery_date: "",
      notes: "",
    });
    setItems([]);
    setNewItem({
      product_id: "",
      product_name: "",
      quantity: 0,
      unit: "unidad",
      unit_price: 0,
      total_price: 0,
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const addItem = () => {
    if (!newItem.product_id || !newItem.product_name || newItem.quantity <= 0 || newItem.unit_price <= 0) {
      toast.error("Por favor complete todos los campos del producto");
      return;
    }

    const itemWithTotal: OrderItemForm = {
      ...newItem,
      total_price: newItem.quantity * newItem.unit_price,
    };

    setItems(prev => [...prev, itemWithTotal]);
    setNewItem({
      product_id: "",
      product_name: "",
      quantity: 0,
      unit: "unidad",
      unit_price: 0,
      total_price: 0,
    });
    toast.success("Producto agregado a la orden");
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
    toast.success("Producto removido de la orden");
  };

  const updateItemQuantity = (index: number, quantity: number) => {
    setItems(prev =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity, total_price: quantity * item.unit_price }
          : item
      )
    );
  };

  const updateItemPrice = (index: number, unit_price: number) => {
    setItems(prev =>
      prev.map((item, i) =>
        i === index
          ? { ...item, unit_price, total_price: item.quantity * unit_price }
          : item
      )
    );
  };

  const getTotalAmount = () => {
    return items.reduce((total, item) => total + (item.total_price || 0), 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP"
    }).format(amount);
  };

  const isFormValid = () => {
    return (
      orderForm.provider_id &&
      orderForm.institution_id &&
      orderForm.expected_delivery_date &&
      items.length > 0
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast.error("Por favor complete todos los campos obligatorios y agregue al menos un producto");
      return;
    }

    try {
      setLoading(true);

      // Preparar los items para enviar (sin product_name y total_price)
      const orderItems = items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: item.unit_price,
      }));

      const orderData: PurchaseOrderCreate = {
        provider_id: orderForm.provider_id,
        institution_id: orderForm.institution_id,
        expected_delivery_date: orderForm.expected_delivery_date,
        items: orderItems,
        notes: orderForm.notes || undefined,
      };

      const newOrder = await createPurchaseOrder(orderData);
      
      toast.success(
        `Orden de compra ${newOrder.order_number} creada exitosamente. Total: ${formatCurrency(newOrder.total_amount)}`
      );
      
      onOrderCreated();
      handleClose();
    } catch (error) {
      console.error("❌ Error creating purchase order:", error);
      toast.error("Error al crear la orden de compra. Verifique los datos e intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        handleClose();
      }
    }}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Nueva Orden de Compra
          </DialogTitle>
          <DialogDescription>
            Crea una nueva orden de compra especificando proveedor, productos y cantidades.
            Los campos marcados con * son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información General */}
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="provider">Proveedor *</Label>
                  <Select
                    value={orderForm.provider_id}
                    onValueChange={(value) => setOrderForm({ ...orderForm, provider_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prov-001">Proveedor Alimentos S.A.</SelectItem>
                      <SelectItem value="prov-002">Distribuidora Regional Ltda.</SelectItem>
                      <SelectItem value="prov-003">Suministros PAE S.A.S.</SelectItem>
                      <SelectItem value="prov-004">Comercializadora del Valle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="institution">Institución *</Label>
                  <Select
                    value={orderForm.institution_id.toString()}
                    onValueChange={(value) => setOrderForm({ ...orderForm, institution_id: Number(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar institución" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Institución Educativa Central</SelectItem>
                      <SelectItem value="2">Colegio San José</SelectItem>
                      <SelectItem value="3">Escuela Rural El Progreso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="delivery-date">Fecha de Entrega Esperada *</Label>
                  <Input
                    id="delivery-date"
                    type="date"
                    value={orderForm.expected_delivery_date}
                    onChange={(e) => setOrderForm({ ...orderForm, expected_delivery_date: e.target.value })}
                    min={new Date().toISOString().split("T")[0]} // No permitir fechas pasadas
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={orderForm.notes}
                  onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                  placeholder="Observaciones adicionales sobre la orden..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Agregar Productos */}
          <Card>
            <CardHeader>
              <CardTitle>Agregar Productos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="product-id">ID Producto *</Label>
                  <Input
                    id="product-id"
                    value={newItem.product_id}
                    onChange={(e) => setNewItem({ ...newItem, product_id: e.target.value })}
                    placeholder="Ej: PROD-001"
                  />
                </div>

                <div>
                  <Label htmlFor="product-name">Nombre del Producto *</Label>
                  <Input
                    id="product-name"
                    value={newItem.product_name}
                    onChange={(e) => setNewItem({ ...newItem, product_name: e.target.value })}
                    placeholder="Ej: Arroz Blanco 500g"
                  />
                </div>

                <div>
                  <Label htmlFor="quantity">Cantidad *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    step="1"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="unit">Unidad *</Label>
                  <Select
                    value={newItem.unit}
                    onValueChange={(value) => setNewItem({ ...newItem, unit: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unidad">Unidad</SelectItem>
                      <SelectItem value="kg">Kilogramo</SelectItem>
                      <SelectItem value="lt">Litro</SelectItem>
                      <SelectItem value="caja">Caja</SelectItem>
                      <SelectItem value="bolsa">Bolsa</SelectItem>
                      <SelectItem value="paquete">Paquete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="unit-price">Precio Unitario *</Label>
                  <Input
                    id="unit-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newItem.unit_price}
                    onChange={(e) => setNewItem({ ...newItem, unit_price: Number(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={addItem} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Agregar Producto
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Productos */}
          {items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Productos en la Orden
                  <Badge variant="secondary">{items.length} productos</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Producto</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Unidad</TableHead>
                      <TableHead>Precio Unit.</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-sm">{item.product_id}</TableCell>
                        <TableCell>{item.product_name}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItemQuantity(index, Number(e.target.value))}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unit_price}
                            onChange={(e) => updateItemPrice(index, Number(e.target.value))}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(item.total_price || 0)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex justify-end mt-4 pt-4 border-t">
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Total de la Orden:</div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(getTotalAmount())}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={loading || !isFormValid()}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Crear Orden de Compra
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
