import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import getAllCategories from "@/service/categories/getAllCategories";
import getCategoryById from "@/service/categories/getCategoryById";
import getCategoryTree from "@/service/categories/getCategoryTree";
import createCategory from "@/service/categories/createCategory";
import updateCategory from "@/service/categories/updateCategory";
import deleteCategory from "@/service/categories/deleteCategory";
import toggleCategoryStatus from "@/service/categories/toggleCategoryStatus";
import { CATEGORY_IMAGES } from "@/constants/categoryImages";
import { queryKeys } from "@/constants/queryKeys";
import { notify } from "@/utils/toast";

const CATEGORY_KEY = ["categories"];

/* Storefront list: active only, subcategories come from backend */
export function useCategories() {
  return useQuery({
    queryKey: [...CATEGORY_KEY, "tree"],
    queryFn: getCategoryTree,
    staleTime: 10 * 60 * 1000,
    select: (list) =>
      list
        .filter((c) => c.status !== "inactive")
        .map((c) => ({
          id: c._id,
          name: c.name,
          slug: c.slug,
          image: c.image ?? CATEGORY_IMAGES[c.slug]?.src ?? null,
          fit: CATEGORY_IMAGES[c.slug]?.fit,
          items: c.items ?? [],
        })),
  });
}

/* Admin list: all categories including inactive, raw backend shape */
export function useAdminCategories() {
  return useQuery({
    queryKey: [...CATEGORY_KEY, "admin"],
    queryFn: getAllCategories,
  });
}

export function useCategory(id) {
  return useQuery({
    queryKey: [...CATEGORY_KEY, "detail", id],
    queryFn: () => getCategoryById(id),
    enabled: !!id,
  });
}

/* Category changes also affect populated category inside products */
function useInvalidate() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: CATEGORY_KEY });
    qc.invalidateQueries({ queryKey: queryKeys.products.all });
  };
}

export function useCreateCategory() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      invalidate();
      notify.success("Category created");
    },
  });
}

export function useUpdateCategory() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: updateCategory, // mutate({ id, payload })
    onSuccess: () => {
      invalidate();
      notify.success("Category updated");
    },
  });
}

export function useDeleteCategory() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      invalidate();
      notify.success("Category deleted");
    },
  });
}

export function useToggleCategoryStatus() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: toggleCategoryStatus,
    onSuccess: invalidate,
  });
}