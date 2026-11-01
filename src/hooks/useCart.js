import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import getMyCart from "@/service/cart/getMyCart";
import addToCart from "@/service/cart/addToCart";
import updateQuantity from "@/service/cart/updateQuantity";
import removeItem from "@/service/cart/removeItem";
import clearCart from "@/service/cart/clearCart";

export const CART_KEY = ["cart"];

// response: { items: [...], totalItems, totalAmount }
const normalize = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.cart?.items)) return data.cart.items;
  return [];
};

const getQty = (item) => item.quantity ?? item.qty ?? 1;

export function useCart() {
  const { isAuthenticated } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: CART_KEY,
    queryFn: getMyCart,
    enabled: !!isAuthenticated,
    staleTime: 60 * 1000,
  });

  const items = isAuthenticated ? normalize(data) : [];
  const count = items.reduce((sum, item) => sum + getQty(item), 0);
  const totalAmount =
    data?.totalAmount ?? items.reduce((sum, i) => sum + (i.subtotal ?? 0), 0);

  return { items, count, totalAmount, isLoading: isAuthenticated && isLoading };
}

function useCartMutation(mutationFn) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => qc.invalidateQueries({ queryKey: CART_KEY }),
  });
}

export const useAddToCart = () => useCartMutation(addToCart);
export const useUpdateQuantity = () => useCartMutation(updateQuantity);
export const useRemoveItem = () => useCartMutation(removeItem);
export const useClearCart = () => useCartMutation(clearCart);

export default useCart;