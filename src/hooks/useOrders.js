import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import placeOrder from "@/service/orders/placeOrder";
import getMyOrders from "@/service/orders/getMyOrders";
import getOrderById from "@/service/orders/getOrderById";
import cancelOrder from "@/service/orders/cancelOrder";
import validateCoupon from "@/service/coupons/validateCoupon";
import { CART_KEY } from "@/hooks/useCart";
import { notify } from "@/utils/toast";

export const ORDERS_KEY = ["orders"];

// array illa { orders: [...] } rendume work aagum
export const normalizeOrders = (res) =>
  Array.isArray(res) ? res : res?.orders ?? res?.data ?? [];

// single order: order illa { order: {...} }
export const normalizeOrder = (res) => res?.order ?? res ?? null;

export function usePlaceOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: placeOrder,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CART_KEY });
      qc.invalidateQueries({ queryKey: ORDERS_KEY });
    },
  });
}

export function useMyOrders(params) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: [...ORDERS_KEY, params],
    queryFn: () => getMyOrders(params),
    select: normalizeOrders,
    enabled: !!isAuthenticated,
  });
}

export function useOrder(id, options = {}) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: [...ORDERS_KEY, "detail", id],
    queryFn: () => getOrderById(id),
    select: normalizeOrder,
    enabled: !!isAuthenticated && !!id && options.enabled !== false,
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => cancelOrder(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ORDERS_KEY });
      notify.success("Order cancelled");
    },
  });
}

export function useValidateCoupon() {
  return useMutation({ mutationFn: validateCoupon });
}