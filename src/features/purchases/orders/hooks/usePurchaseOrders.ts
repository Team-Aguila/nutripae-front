import { useQuery } from "@tanstack/react-query";
import { getPurchaseOrders } from "../api/getPurchaseOrders";

export const usePurchaseOrders = (params?: {
  order_number?: string;
  provider_id?: string;
  status?: string;
  created_from?: string;
  created_to?: string;
  delivery_from?: string;
  delivery_to?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["purchaseOrders", params],
    queryFn: () => getPurchaseOrders(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
