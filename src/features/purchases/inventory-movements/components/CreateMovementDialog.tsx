import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, RotateCcw, Loader2, Package } from "lucide-react";
import { toast } from "sonner";
import {
  receiveInventory,
  consumeInventory,
  createManualAdjustment,
  getAvailableStock,
  type InventoryReceiptRequest,
  type InventoryConsumptionRequest,
  type ManualInventoryAdjustmentRequest,
  type InventoryBatchStock,
  type CurrentStockResponse,
} from "@/features/purchases/inventory-movements/api/inventoryMovements";
import { type Product } from "@/features/purchases/products/api/products";
import {
  getCurrentColombianDateString,
  convertColombianDateToUTC,
  convertColombianDateToDateOnly,
  formatDateOnlyForDisplayManual,
} from "../utils/dateUtils";

interface CreateMovementDialogProps {
  open: boolean;
  onClose: () => void;
  onMovementCreated: () => void;
  products: Product[];
  selectedProduct?: string;
}

export function CreateMovementDialog({
  open,
  onClose,
  onMovementCreated,
  products,
  selectedProduct,
}: CreateMovementDialogProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("receipt");

  // Estado para el stock disponible real
  const [availableStock, setAvailableStock] = useState<CurrentStockResponse | null>(null);
  const [loadingStock, setLoadingStock] = useState(false);

  // Estado para entrada (recepción)
  const [receiptForm, setReceiptForm] = useState({
    product_id: selectedProduct || "",
    institution_id: 1,
    storage_location: "",
    quantity_received: 0,
    unit_of_measure: "unidad",
    expiration_date: "",
    batch_number: "",
    purchase_order_id: "",
    received_by: "usuario_actual",
    reception_date: getCurrentColombianDateString(),
    notes: "",
  });

  // Estado para salida (consumo)
  const [consumptionForm, setConsumptionForm] = useState({
    product_id: selectedProduct || "",
    institution_id: 1,
    storage_location: "",
    quantity: 0,
    unit: "unidad",
    consumption_date: getCurrentColombianDateString(),
    notes: "",
    consumed_by: "usuario_actual",
    selected_batch_id: "", // ID del batch seleccionado para consumo
  });

  // Estado para ajuste manual
  const [adjustmentForm, setAdjustmentForm] = useState({
    product_id: selectedProduct || "",
    inventory_id: "",
    quantity: 0,
    unit: "unidad",
    reason: "",
    notes: "",
    adjusted_by: "usuario_actual",
    selected_batch_id: "", // ID del batch seleccionado para ajuste
  });

  // Cargar stock disponible cuando cambie el producto seleccionado
  useEffect(() => {
    const loadAvailableData = async () => {
      if (!selectedProduct) {
        setAvailableStock(null);
        return;
      }

      try {
        setLoadingStock(true);

        // Usar únicamente el endpoint del backend
        const stock = await getAvailableStock(selectedProduct, 1);

        setAvailableStock(stock);
      } catch (error) {
        console.error("Error cargando stock:", error);
        setAvailableStock(null);
      } finally {
        setLoadingStock(false);
      }
    };

    loadAvailableData();
  }, [selectedProduct]);

  // Función para obtener el batch seleccionado
  const getSelectedBatch = (batchId: string): InventoryBatchStock | null => {
    return availableStock?.batches?.find((batch) => batch.inventory_id === batchId) || null;
  };

  // Función para manejar la selección de batch en formularios de salida/ajuste
  const handleBatchSelection = (batchId: string, formType: "consumption" | "adjustment") => {
    const selectedBatch = getSelectedBatch(batchId);
    if (!selectedBatch) return;

    if (formType === "consumption") {
      setConsumptionForm((prev) => ({
        ...prev,
        selected_batch_id: batchId,
        unit: selectedBatch.unit,
        storage_location: selectedBatch.storage_location,
        institution_id: selectedBatch.institution_id,
      }));
    } else if (formType === "adjustment") {
      setAdjustmentForm((prev) => ({
        ...prev,
        selected_batch_id: batchId,
        unit: selectedBatch.unit,
        inventory_id: selectedBatch.inventory_id,
      }));
    }
  };

  const resetForms = () => {
    setReceiptForm({
      product_id: selectedProduct || "",
      institution_id: 1,
      storage_location: "",
      quantity_received: 0,
      unit_of_measure: "unidad",
      expiration_date: "",
      batch_number: "",
      purchase_order_id: "",
      received_by: "usuario_actual",
      reception_date: getCurrentColombianDateString(),
      notes: "",
    });

    setConsumptionForm({
      product_id: selectedProduct || "",
      institution_id: 1,
      storage_location: "",
      quantity: 0,
      unit: "unidad",
      consumption_date: getCurrentColombianDateString(),
      notes: "",
      consumed_by: "usuario_actual",
      selected_batch_id: "",
    });

    setAdjustmentForm({
      product_id: selectedProduct || "",
      inventory_id: "",
      quantity: 0,
      unit: "unidad",
      reason: "",
      notes: "",
      adjusted_by: "usuario_actual",
      selected_batch_id: "",
    });
  };

  const handleClose = () => {
    resetForms();
    onClose();
  };

  // Validaciones para formularios
  const isReceiptFormValid = () => {
    return (
      receiptForm.product_id &&
      receiptForm.institution_id &&
      receiptForm.storage_location.trim() &&
      receiptForm.quantity_received > 0 &&
      receiptForm.unit_of_measure &&
      receiptForm.expiration_date &&
      receiptForm.batch_number.trim() &&
      receiptForm.received_by.trim() &&
      receiptForm.reception_date
    );
  };

  const isConsumptionFormValid = () => {
    const selectedBatch = consumptionForm.selected_batch_id
      ? getSelectedBatch(consumptionForm.selected_batch_id)
      : null;

    return (
      consumptionForm.product_id &&
      consumptionForm.institution_id &&
      consumptionForm.storage_location.trim() &&
      consumptionForm.quantity > 0 &&
      consumptionForm.unit &&
      consumptionForm.consumption_date &&
      consumptionForm.consumed_by.trim() &&
      consumptionForm.selected_batch_id.trim() &&
      // Validar que no se exceda la cantidad disponible
      (!selectedBatch || consumptionForm.quantity <= selectedBatch.available_quantity)
    );
  };

  const isAdjustmentFormValid = () => {
    const selectedBatch = adjustmentForm.selected_batch_id ? getSelectedBatch(adjustmentForm.selected_batch_id) : null;

    // Si es un ajuste negativo, validar que no exceda la cantidad disponible
    const isNegativeAdjustment = adjustmentForm.quantity < 0;
    const exceedsAvailable =
      isNegativeAdjustment && selectedBatch && Math.abs(adjustmentForm.quantity) > selectedBatch.available_quantity;

    return (
      adjustmentForm.product_id &&
      adjustmentForm.inventory_id.trim() &&
      adjustmentForm.quantity !== 0 &&
      adjustmentForm.unit &&
      adjustmentForm.reason.trim() &&
      adjustmentForm.adjusted_by.trim() &&
      adjustmentForm.selected_batch_id.trim() && // Batch seleccionado es obligatorio
      !exceedsAvailable // No exceder la cantidad disponible en ajustes negativos
    );
  };

  const handleReceiptSubmit = async () => {
    if (!isReceiptFormValid()) {
      toast.error("Por favor complete todos los campos obligatorios");
      return;
    }

    try {
      setLoading(true);

      const request: InventoryReceiptRequest = {
        ...receiptForm,
        quantity_received: Number(receiptForm.quantity_received),
        // Para expiration_date solo enviar la fecha (sin hora)
        expiration_date: convertColombianDateToDateOnly(receiptForm.expiration_date),
        // Para reception_date convertir a UTC con hora
        reception_date: convertColombianDateToUTC(receiptForm.reception_date),
      };

      await receiveInventory(request);

      toast.success("Entrada de inventario registrada exitosamente");
      onMovementCreated();
      handleClose();
    } catch (error) {
      console.error("Error creating receipt:", error);
      toast.error("Error al registrar la entrada de inventario");
    } finally {
      setLoading(false);
    }
  };

  const handleConsumptionSubmit = async () => {
    if (!isConsumptionFormValid()) {
      toast.error("Por favor complete todos los campos obligatorios");
      return;
    }

    try {
      setLoading(true);

      // Excluir campos internos del formulario que no son parte de la API
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { selected_batch_id: _selected_batch_id, ...formData } = consumptionForm;

      const request: InventoryConsumptionRequest = {
        ...formData,
        quantity: Number(formData.quantity),
        // Para consumption_date solo enviar la fecha (sin hora)
        consumption_date: convertColombianDateToDateOnly(formData.consumption_date),
        // Forzar reason a "SYSTEM" para movimientos internos del sistema
        reason: "SYSTEM",
      };

      const response = await consumeInventory(request);

      // Mostrar información detallada sobre los batches afectados
      if (response.batch_details && response.batch_details.length > 0) {
        // Crear mensaje detallado sobre la actualización del stock
        const batchInfo = response.batch_details
          .map(
            (batch) =>
              `Lote ${batch.lot || "N/A"}: ${batch.consumed_quantity} ${response.unit} consumidos, ${batch.remaining_quantity} restantes`
          )
          .join("; ");

        toast.success(
          `Salida registrada exitosamente. Total consumido: ${response.total_quantity_consumed} ${response.unit}. Detalles: ${batchInfo}`
        );
      } else {
        toast.success("Salida de inventario registrada exitosamente");
      }

      onMovementCreated();
      handleClose();
    } catch (error) {
      console.error("Error creating consumption:", error);
      toast.error("Error al registrar la salida de inventario");
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustmentSubmit = async () => {
    if (!isAdjustmentFormValid()) {
      toast.error("Por favor complete todos los campos obligatorios");
      return;
    }

    try {
      setLoading(true);

      // Excluir campos internos del formulario que no son parte de la API
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { selected_batch_id: _selected_batch_id, ...formData } = adjustmentForm;

      const request: ManualInventoryAdjustmentRequest = {
        ...formData,
        quantity: Number(formData.quantity),
      };

      const response = await createManualAdjustment(request);

      // Mostrar información detallada sobre el ajuste realizado
      const adjustmentType = response.adjustment_quantity > 0 ? "Incremento" : "Reducción";
      const adjustmentAmount = Math.abs(response.adjustment_quantity);

      toast.success(
        `Ajuste registrado exitosamente. ${adjustmentType} de ${adjustmentAmount} ${response.unit}. ` +
        `Stock anterior: ${response.previous_stock}, Stock nuevo: ${response.new_stock}`
      );
      onMovementCreated();
      handleClose();
    } catch (error) {
      console.error("Error creating adjustment:", error);
      toast.error("Error al registrar el ajuste de inventario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Movimiento de Inventario</DialogTitle>
          <DialogDescription>
            Registra una entrada, salida o ajuste de inventario para el producto seleccionado.
            <br />
            <span className="text-sm text-gray-500 mt-1 block">Los campos marcados con * son obligatorios.</span>
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="receipt" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Entrada
            </TabsTrigger>
            <TabsTrigger value="consumption" className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Salida
            </TabsTrigger>
            <TabsTrigger value="adjustment" className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Ajuste
            </TabsTrigger>
          </TabsList>

          {/* Tab de Entrada */}
          <TabsContent value="receipt" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Entrada de Inventario
                  <Badge className="bg-green-100 text-green-800">Entrada</Badge>
                </CardTitle>
                <CardDescription>Registra la recepción de productos al inventario</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="receipt-product">Producto *</Label>
                    <Select
                      value={receiptForm.product_id}
                      onValueChange={(value) => setReceiptForm({ ...receiptForm, product_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar producto" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product._id} value={product._id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="receipt-institution">Institución *</Label>
                    <Select
                      value={receiptForm.institution_id.toString()}
                      onValueChange={(value) => setReceiptForm({ ...receiptForm, institution_id: Number(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar institución" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Institución 1</SelectItem>
                        <SelectItem value="2">Institución 2</SelectItem>
                        <SelectItem value="3">Institución 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="receipt-location">Ubicación de Almacenamiento *</Label>
                    <Input
                      id="receipt-location"
                      value={receiptForm.storage_location}
                      onChange={(e) => setReceiptForm({ ...receiptForm, storage_location: e.target.value })}
                      placeholder="Ej: Bodega A, Estante 1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="receipt-quantity">Cantidad Recibida *</Label>
                    <Input
                      id="receipt-quantity"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={receiptForm.quantity_received}
                      onChange={(e) => setReceiptForm({ ...receiptForm, quantity_received: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="receipt-unit">Unidad de Medida *</Label>
                    <Select
                      value={receiptForm.unit_of_measure}
                      onValueChange={(value) => setReceiptForm({ ...receiptForm, unit_of_measure: value })}
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
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="receipt-expiration">Fecha de Vencimiento *</Label>
                    <Input
                      id="receipt-expiration"
                      type="date"
                      value={receiptForm.expiration_date}
                      onChange={(e) => setReceiptForm({ ...receiptForm, expiration_date: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="receipt-batch">Número de Lote *</Label>
                    <Input
                      id="receipt-batch"
                      value={receiptForm.batch_number}
                      onChange={(e) => setReceiptForm({ ...receiptForm, batch_number: e.target.value })}
                      placeholder="Ej: L001-2025"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="receipt-date">Fecha de Recepción *</Label>
                    <Input
                      id="receipt-date"
                      type="date"
                      value={receiptForm.reception_date}
                      onChange={(e) => setReceiptForm({ ...receiptForm, reception_date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="receipt-notes">Notas</Label>
                  <Textarea
                    id="receipt-notes"
                    value={receiptForm.notes}
                    onChange={(e) => setReceiptForm({ ...receiptForm, notes: e.target.value })}
                    placeholder="Observaciones adicionales..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={handleClose}>
                    Cancelar
                  </Button>
                  <Button onClick={handleReceiptSubmit} disabled={loading || !isReceiptFormValid()}>
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Registrar Entrada
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Salida */}
          <TabsContent value="consumption" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                  Salida de Inventario
                  <Badge className="bg-red-100 text-red-800">Salida</Badge>
                </CardTitle>
                <CardDescription>Registra el consumo o salida de productos del inventario</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="consumption-product">Producto *</Label>
                    <Select
                      value={consumptionForm.product_id}
                      onValueChange={(value) => setConsumptionForm({ ...consumptionForm, product_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar producto" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product._id} value={product._id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="consumption-institution">Institución *</Label>
                    <Select
                      value={consumptionForm.institution_id.toString()}
                      onValueChange={(value) =>
                        setConsumptionForm({ ...consumptionForm, institution_id: Number(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar institución" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Institución 1</SelectItem>
                        <SelectItem value="2">Institución 2</SelectItem>
                        <SelectItem value="3">Institución 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="consumption-location">Ubicación de Almacenamiento *</Label>
                    <Input
                      id="consumption-location"
                      value={consumptionForm.storage_location}
                      onChange={(e) => setConsumptionForm({ ...consumptionForm, storage_location: e.target.value })}
                      placeholder="Ej: Bodega A, Estante 1"
                      required
                    />
                  </div>
                </div>

                {/* Selector de stock disponible */}
                <div>
                  <Label htmlFor="consumption-batch">Stock Disponible *</Label>
                  {loadingStock ? (
                    <div className="flex items-center gap-2 p-2 border rounded">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-gray-500">Cargando stock disponible...</span>
                    </div>
                  ) : !availableStock || !availableStock.batches || availableStock.batches.length === 0 ? (
                    <div className="flex flex-col gap-2 p-3 border rounded bg-amber-50 border-amber-200">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-medium text-amber-800">
                          No hay stock disponible para este producto
                        </span>
                      </div>
                      <div className="text-xs text-amber-700">
                        Para realizar salidas, primero debe registrar una entrada de inventario. Vaya a la pestaña
                        "Entrada" para agregar stock inicial.
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Stock total reportado: {availableStock?.total_available || 0}{" "}
                        {availableStock?.unit || "unidades"}
                      </div>
                      {/* Información de debug */}
                      <div className="text-xs text-blue-600 mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                        <div className="font-medium">ℹ️ Información de diagnóstico:</div>
                        <div>• Producto seleccionado: {selectedProduct || "Ninguno"}</div>
                        <div>• Institución: 1</div>
                        <div>• Estado del stock: {availableStock ? "Cargado" : "No cargado"}</div>
                        {availableStock && (
                          <>
                            <div>• Total disponible: {availableStock.total_available}</div>
                            <div>• Número de lotes: {availableStock.batches?.length || 0}</div>
                            <div>• Unidad: {availableStock.unit}</div>
                          </>
                        )}
                        <div className="mt-1 text-xs text-gray-500">
                          Si ve este mensaje persistentemente, verifique la consola del navegador (F12) para más
                          detalles técnicos.
                        </div>
                        <div className="mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (selectedProduct) {
                                setLoadingStock(true);
                                getAvailableStock(selectedProduct, 1)
                                  .then((stock) => {
                                    setAvailableStock(stock);
                                  })
                                  .catch((error) => {
                                    console.error("🔄 Error al recargar:", error);
                                    setAvailableStock(null);
                                  })
                                  .finally(() => setLoadingStock(false));
                              }
                            }}
                            disabled={loadingStock || !selectedProduct}
                          >
                            {loadingStock ? (
                              <>
                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                Recargando...
                              </>
                            ) : (
                              "🔄 Recargar Stock"
                            )}
                          </Button>
                        </div>
                      </div>
                      {availableStock &&
                        availableStock.total_available > 0 &&
                        (!availableStock.batches || availableStock.batches.length === 0) && (
                          <div className="text-xs text-orange-600 mt-1 p-2 bg-orange-50 rounded border border-orange-200">
                            ⚠️ El sistema detecta stock total ({availableStock.total_available} {availableStock.unit})
                            pero no hay lotes específicos disponibles. Esto puede indicar que el endpoint del backend
                            necesita configuración adicional.
                          </div>
                        )}
                    </div>
                  ) : (
                    <Select
                      value={consumptionForm.selected_batch_id}
                      onValueChange={(value) => handleBatchSelection(value, "consumption")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar lote disponible" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableStock?.batches?.map((batch) => (
                          <SelectItem key={batch.inventory_id} value={batch.inventory_id}>
                            <div className="flex flex-col">
                              <div className="font-medium">
                                {batch.available_quantity} {batch.unit} - {batch.storage_location}
                              </div>
                              <div className="text-xs text-gray-500">
                                Lote: {batch.lot || "N/A"} | Vence:{" "}
                                {batch.expiration_date ? formatDateOnlyForDisplayManual(batch.expiration_date) : "N/A"}{" "}
                                | Recibido: {formatDateOnlyForDisplayManual(batch.date_of_admission)}
                              </div>
                            </div>
                          </SelectItem>
                        )) || []}
                      </SelectContent>
                    </Select>
                  )}
                  {consumptionForm.selected_batch_id && (
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                      <div className="font-medium text-blue-800">Lote seleccionado:</div>
                      {(() => {
                        const selectedBatch = getSelectedBatch(consumptionForm.selected_batch_id);
                        return selectedBatch ? (
                          <div className="text-blue-600">
                            Cantidad disponible: {selectedBatch.available_quantity} {selectedBatch.unit} | Lote:{" "}
                            {selectedBatch.lot || "N/A"} | Ubicación: {selectedBatch.storage_location}
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="consumption-quantity">Cantidad a Consumir *</Label>
                    <Input
                      id="consumption-quantity"
                      type="number"
                      min="0.01"
                      max={
                        consumptionForm.selected_batch_id
                          ? getSelectedBatch(consumptionForm.selected_batch_id)?.available_quantity
                          : undefined
                      }
                      step="0.01"
                      value={consumptionForm.quantity}
                      onChange={(e) => setConsumptionForm({ ...consumptionForm, quantity: Number(e.target.value) })}
                      required
                    />
                    {consumptionForm.selected_batch_id && (
                      <p className="text-xs text-gray-500 mt-1">
                        Máximo disponible: {getSelectedBatch(consumptionForm.selected_batch_id)?.available_quantity}{" "}
                        {consumptionForm.unit}
                      </p>
                    )}
                    {consumptionForm.selected_batch_id &&
                      consumptionForm.quantity > 0 &&
                      (() => {
                        const selectedBatch = getSelectedBatch(consumptionForm.selected_batch_id);
                        const isExceeded = selectedBatch && consumptionForm.quantity > selectedBatch.available_quantity;
                        return isExceeded ? (
                          <div className="mt-1 p-2 bg-red-50 border border-red-200 rounded text-sm">
                            <div className="text-red-800 font-medium">⚠️ Error de Cantidad</div>
                            <div className="text-red-600">
                              No se puede consumir más de {selectedBatch.available_quantity} {selectedBatch.unit}
                              (cantidad disponible en este lote)
                            </div>
                          </div>
                        ) : null;
                      })()}
                  </div>

                  <div>
                    <Label htmlFor="consumption-unit">Unidad de Medida *</Label>
                    <Select
                      value={consumptionForm.unit}
                      onValueChange={(value) => setConsumptionForm({ ...consumptionForm, unit: value })}
                      disabled={!!consumptionForm.selected_batch_id} // Deshabilitar si hay batch seleccionado
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
                      </SelectContent>
                    </Select>
                    {consumptionForm.selected_batch_id && (
                      <p className="text-xs text-gray-500 mt-1">
                        La unidad se establece automáticamente según el lote seleccionado
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="consumption-date">Fecha de Consumo *</Label>
                    <Input
                      id="consumption-date"
                      type="date"
                      value={consumptionForm.consumption_date}
                      onChange={(e) => setConsumptionForm({ ...consumptionForm, consumption_date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="consumption-notes">Notas</Label>
                  <Textarea
                    id="consumption-notes"
                    value={consumptionForm.notes}
                    onChange={(e) => setConsumptionForm({ ...consumptionForm, notes: e.target.value })}
                    placeholder="Observaciones adicionales..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={handleClose}>
                    Cancelar
                  </Button>
                  <Button onClick={handleConsumptionSubmit} disabled={loading || !isConsumptionFormValid()}>
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Registrar Salida
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Ajuste */}
          <TabsContent value="adjustment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-yellow-600" />
                  Ajuste Manual
                  <Badge className="bg-yellow-100 text-yellow-800">Ajuste</Badge>
                </CardTitle>
                <CardDescription>Realiza ajustes manuales al inventario existente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="adjustment-product">Producto *</Label>
                  <Select
                    value={adjustmentForm.product_id}
                    onValueChange={(value) => setAdjustmentForm({ ...adjustmentForm, product_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product._id} value={product._id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Selector de stock disponible para ajustar */}
                <div>
                  <Label htmlFor="adjustment-batch">Stock Disponible para Ajustar *</Label>
                  {loadingStock ? (
                    <div className="flex items-center gap-2 p-2 border rounded">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-gray-500">Cargando stock disponible...</span>
                    </div>
                  ) : !availableStock || !availableStock.batches || availableStock.batches.length === 0 ? (
                    <div className="flex flex-col gap-2 p-3 border rounded bg-amber-50 border-amber-200">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-medium text-amber-800">
                          No hay stock disponible para este producto
                        </span>
                      </div>
                      <div className="text-xs text-amber-700">
                        Para realizar ajustes, primero debe registrar una entrada de inventario. Vaya a la pestaña
                        "Entrada" para agregar stock inicial.
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Stock total: {availableStock?.total_available || 0} {availableStock?.unit || "unidades"}
                      </div>
                    </div>
                  ) : (
                    <Select
                      value={adjustmentForm.selected_batch_id}
                      onValueChange={(value) => handleBatchSelection(value, "adjustment")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar lote para ajustar" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableStock?.batches?.map((batch) => (
                          <SelectItem key={batch.inventory_id} value={batch.inventory_id}>
                            <div className="flex flex-col">
                              <div className="font-medium">
                                {batch.available_quantity} {batch.unit} - {batch.storage_location}
                              </div>
                              <div className="text-xs text-gray-500">
                                Lote: {batch.lot || "N/A"} | Vence:{" "}
                                {batch.expiration_date ? formatDateOnlyForDisplayManual(batch.expiration_date) : "N/A"}{" "}
                                | Recibido: {formatDateOnlyForDisplayManual(batch.date_of_admission)}
                              </div>
                            </div>
                          </SelectItem>
                        )) || []}
                      </SelectContent>
                    </Select>
                  )}
                  {adjustmentForm.selected_batch_id && (
                    <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-sm">
                      <div className="font-medium text-amber-800">Lote seleccionado para ajustar:</div>
                      {(() => {
                        const selectedBatch = getSelectedBatch(adjustmentForm.selected_batch_id);
                        return selectedBatch ? (
                          <div className="text-amber-600">
                            <div>ID de Inventario: {selectedBatch.inventory_id}</div>
                            <div>
                              Cantidad actual: {selectedBatch.available_quantity} {selectedBatch.unit}
                            </div>
                            <div>Lote: {selectedBatch.lot || "N/A"}</div>
                            <div>Ubicación: {selectedBatch.storage_location}</div>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="adjustment-quantity">Cantidad de Ajuste *</Label>
                    <Input
                      id="adjustment-quantity"
                      type="number"
                      step="0.01"
                      value={adjustmentForm.quantity}
                      onChange={(e) => setAdjustmentForm({ ...adjustmentForm, quantity: Number(e.target.value) })}
                      placeholder="Cantidad positiva o negativa"
                      required
                    />
                    {adjustmentForm.selected_batch_id && (
                      <p className="text-xs text-gray-500 mt-1">
                        Stock actual: {getSelectedBatch(adjustmentForm.selected_batch_id)?.available_quantity}{" "}
                        {adjustmentForm.unit}
                      </p>
                    )}
                    {adjustmentForm.selected_batch_id &&
                      adjustmentForm.quantity < 0 &&
                      (() => {
                        const selectedBatch = getSelectedBatch(adjustmentForm.selected_batch_id);
                        const isExceeded =
                          selectedBatch && Math.abs(adjustmentForm.quantity) > selectedBatch.available_quantity;
                        return isExceeded ? (
                          <div className="mt-1 p-2 bg-red-50 border border-red-200 rounded text-sm">
                            <div className="text-red-800 font-medium">⚠️ Error de Ajuste</div>
                            <div className="text-red-600">
                              El ajuste negativo no puede exceder el stock disponible de{" "}
                              {selectedBatch.available_quantity} {selectedBatch.unit}
                            </div>
                          </div>
                        ) : null;
                      })()}
                  </div>

                  <div>
                    <Label htmlFor="adjustment-unit">Unidad de Medida *</Label>
                    <Select
                      value={adjustmentForm.unit}
                      onValueChange={(value) => setAdjustmentForm({ ...adjustmentForm, unit: value })}
                      disabled={!!adjustmentForm.selected_batch_id} // Deshabilitar si hay batch seleccionado
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
                      </SelectContent>
                    </Select>
                    {adjustmentForm.selected_batch_id && (
                      <p className="text-xs text-gray-500 mt-1">
                        La unidad se establece automáticamente según el lote seleccionado
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="adjustment-reason">Razón del Ajuste *</Label>
                    <Input
                      id="adjustment-reason"
                      value={adjustmentForm.reason}
                      onChange={(e) => setAdjustmentForm({ ...adjustmentForm, reason: e.target.value })}
                      placeholder="Ej: Conteo físico, Error de registro, Daño de producto"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="adjustment-notes">Notas</Label>
                  <Textarea
                    id="adjustment-notes"
                    value={adjustmentForm.notes}
                    onChange={(e) => setAdjustmentForm({ ...adjustmentForm, notes: e.target.value })}
                    placeholder="Detalles del ajuste..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={handleClose}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAdjustmentSubmit} disabled={loading || !isAdjustmentFormValid()}>
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Registrar Ajuste
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
