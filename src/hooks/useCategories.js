import { CATEGORIES } from "@/constants/navigation";
import { CATEGORY_IMAGES } from "@/constants/categoryImages";

/*
 * Category cards for the storefront. Shape: { id, name, slug, image?, fit? }
 *
 * There is no categories endpoint in the frontend yet (service/categories/ is
 * empty), so this serves the same CATEGORIES the navbar uses, plus thumbnails.
 * The return value mirrors useQuery ({ data, isLoading, isError, refetch }),
 * so <ShopByCategory /> needs no change when the backend is ready:
 *
 *   1. add service/categories/getCategories.js (calls the real endpoint)
 *   2. replace the body below with
 *        return useQuery({
 *          queryKey: queryKeys.categories,      // already in constants/queryKeys.js
 *          queryFn: getCategories,
 *          select: (list) => list.map((c) => ({ id: c._id, name: c.name, slug: c.slug, image: c.image })),
 *        });
 */
const LOCAL_RESULT = {
  data: CATEGORIES.map(({ name, slug }) => ({
    id: slug,
    name,
    slug,
    image: CATEGORY_IMAGES[slug]?.src ?? null,
    fit: CATEGORY_IMAGES[slug]?.fit,
  })),
  isLoading: false,
  isError: false,
  refetch: () => {},
};

export function useCategories() {
  return LOCAL_RESULT;
}
