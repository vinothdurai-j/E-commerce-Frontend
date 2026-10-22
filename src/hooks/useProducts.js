import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import getAllProducts from "@/service/products/getAllProducts";
import getProductById from "@/service/products/getProductById";
import filterProducts from "@/service/products/filterProducts";
import createProduct from "@/service/products/createProduct";
import updateProduct from "@/service/products/updateProduct";
import deleteProduct from "@/service/products/deleteProduct";
import toggleProductStatus from "@/service/products/toggleProductStatus";
import { queryKeys } from "@/constants/queryKeys";
import { notify } from "@/utils/toast";

export function useProducts(params) {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => getAllProducts(params),
    placeholderData: (prev) => prev,
  });
}

export function useFilteredProducts(filters) {
  return useQuery({
    queryKey: queryKeys.products.list({ type: "filter", ...filters }),
    queryFn: () => filterProducts(filters),
    placeholderData: (prev) => prev,
  });
}

export function useProduct(id) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
}

function useInvalidate() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: queryKeys.products.all });
}

export function useCreateProduct() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      invalidate();
      notify.success("Product created");
    },
  });
}

export function useUpdateProduct() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: updateProduct, // mutate({ id, payload })
    onSuccess: () => {
      invalidate();
      notify.success("Product updated");
    },
  });
}

export function useDeleteProduct() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      invalidate();
      notify.success("Product deleted");
    },
  });
}

export function useToggleProductStatus() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: toggleProductStatus,
    onSuccess: invalidate,
  });
}