import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { SiteHeader } from "@/components/site-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, ShoppingCart, BarChart3 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { PurchaseOrderCreate, PurchaseOrderResponse } from "@team-aguila/pae-compras-client";
import { usePurchaseOrders } from "../hooks/usePurchaseOrders";
import { createPurchaseOrder } from "../api/createPurchaseOrder";
import { markPurchaseOrderShipped } from "../api/markPurchaseOrderShipped";
import { cancelPurchaseOrder } from "../api/cancelPurchaseOrder";
import { PurchaseOrderForm } from "../components/PurchaseOrderForm";
import { PurchaseOrdersDataTable } from "../components/PurchaseOrdersDataTable";

const PurchaseOrdersPage = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    order_number: "",
    status: "",
    provider_id: "",
  });

  const {
    data: orders,
    isLoading,
    error,
  } = usePurchaseOrders({
    ...filters,
    page: currentPage,
    limit: 10,
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<PurchaseOrderResponse | undefined>(undefined);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isShipConfirmOpen, setIsShipConfirmOpen] = useState(false);
  const [processingOrder, setProcessingOrder] = useState<PurchaseOrderResponse | undefined>(undefined);

  // Mutaciones
  const createOrderMutation = useMutation({
    mutationFn: createPurchaseOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchaseOrders"] });
      toast.success("Orden de compra creada exitosamente");
      setIsFormOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear la orden de compra");
    },
  });

  const cancelOrderMutation = useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason: string }) => cancelPurchaseOrder(orderId, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchaseOrders"] });
      toast.success("Orden cancelada exitosamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al cancelar la orden");
    },
  });

  const markShippedMutation = useMutation({
    mutationFn: (orderId: string) => markPurchaseOrderShipped(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchaseOrders"] });
      toast.success("Orden marcada como enviada exitosamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al marcar la orden como enviada");
    },
  });

  const handleCreateOrder = (data: PurchaseOrderCreate) => {
    createOrderMutation.mutate(data);
  };

  const handleConfirmCancel = () => {
    if (processingOrder) {
      cancelOrderMutation.mutate({
        orderId: processingOrder._id,
        reason: "Cancelado por el usuario",
      });
    }
    setIsConfirmOpen(false);
    setProcessingOrder(undefined);
  };

  const handleConfirmShip = () => {
    if (processingOrder) {
      markShippedMutation.mutate(processingOrder._id);
    }
    setIsShipConfirmOpen(false);
    setProcessingOrder(undefined);
  };

  const handleMarkAsShipped = (order?: PurchaseOrderResponse) => {
    // Si no se proporciona orden, crear una temporal para demostración
    const orderToProcess =
      order ||
      ({
        _id: "demo-order-id",
        order_number: "ORD-DEMO-001",
      } as PurchaseOrderResponse);

    setProcessingOrder(orderToProcess);
    setIsShipConfirmOpen(true);
  };

  const handleCancelOrder = (order?: PurchaseOrderResponse) => {
    // Si no se proporciona orden, crear una temporal para demostración
    const orderToProcess =
      order ||
      ({
        _id: "demo-order-id",
        order_number: "ORD-DEMO-001",
      } as PurchaseOrderResponse);

    setProcessingOrder(orderToProcess);
    setIsConfirmOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingOrder(undefined);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="p-6">
        <SiteHeader
          items={[
            { label: "Compras", href: "/purchases" },
            { label: "Órdenes de Compra", isCurrentPage: true },
          ]}
        />
        <div className="text-red-500 text-center py-8">Error al cargar las órdenes de compra: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <SiteHeader
        items={[
          { label: "Compras", href: "/purchases" },
          { label: "Órdenes de Compra", isCurrentPage: true },
        ]}
      />

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Órdenes
          </TabsTrigger>
          <TabsTrigger value="statistics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Estadísticas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">Listado de Órdenes</h2>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nueva Orden
              </Button>

              {/* Botón de prueba para marcar como enviado */}
              <Button variant="outline" onClick={() => handleMarkAsShipped()} className="flex items-center gap-2">
                🚚 Probar Marcar Enviado
              </Button>

              {/* Botón de prueba para cancelar */}
              <Button variant="destructive" onClick={() => handleCancelOrder()} className="flex items-center gap-2">
                ❌ Probar Cancelar
              </Button>
            </div>
          </div>

          <PurchaseOrdersDataTable
            data={orders}
            isLoading={isLoading}
            onPageChange={handlePageChange}
            onFiltersChange={handleFiltersChange}
          />

          {/* Lista de órdenes con acciones - Comentado temporalmente hasta resolver tipos */}
          {/* 
          {orders && orders.orders && orders.orders.length > 0 && (
            <div className="mt-4 space-y-2">
              {orders.orders.map((order: PurchaseOrderResponse) => (
                <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">
                      Orden #{order.order_number}
                    </div>
                    <div className="text-sm text-gray-500">
                      Estado: {order.status} | Proveedor: {order.provider_name}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {order.status === "confirmed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAsShipped(order)}
                      >
                        Marcar como Enviado
                      </Button>
                    )}
                    {(order.status === "pending" || order.status === "confirmed") && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleCancelOrder(order)}
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          */}
        </TabsContent>

        <TabsContent value="statistics">
          <div className="text-center py-8 text-gray-500">
            <BarChart3 className="h-16 w-16 mx-auto mb-4" />
            <p>Estadísticas de órdenes de compra próximamente</p>
          </div>
        </TabsContent>
      </Tabs>

      <PurchaseOrderForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleCreateOrder}
        initialData={editingOrder}
        isLoading={createOrderMutation.isPending}
      />

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancelar Orden de Compra"
        description={`¿Estás seguro de que quieres cancelar la orden ${processingOrder?.order_number || ""}?`}
      />

      <ConfirmationDialog
        isOpen={isShipConfirmOpen}
        onClose={() => setIsShipConfirmOpen(false)}
        onConfirm={handleConfirmShip}
        title="Marcar como Enviado"
        description={`¿Estás seguro de que quieres marcar la orden ${processingOrder?.order_number || ""} como enviada?`}
      />
    </div>
  );
};

export default PurchaseOrdersPage;
