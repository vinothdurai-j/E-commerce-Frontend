import { useQuery } from "@tanstack/react-query";
import { productService } from "@/service/products/productService";
import { queryKeys } from "@/constants/queryKeys";

export default function useSearchSuggestions(term) {
  return useQuery({
    queryKey: queryKeys.products.suggestions(term),
    queryFn: () => productService.suggestions(term),
    enabled: term.length >= 2,
    staleTime: 1000 * 60 * 5,
    select: (res) => res.data ?? [],
  });
}

