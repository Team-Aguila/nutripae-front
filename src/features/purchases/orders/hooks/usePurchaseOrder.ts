import { useQuery } from "@tanstack/react-query";
import { getPurchaseOrder } from "../api/getPurchaseOrder";

export const usePurchaseOrder = (orderId: string) => {
  return useQuery({
    queryKey: ["purchaseOrder", orderId],
    queryFn: () => getPurchaseOrder(orderId),
    enabled: !!orderId,
  });
};
