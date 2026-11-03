import { useMemo } from "react";
import { Link } from "react-router-dom";
import ProductGrid from "@/components/product/ProductGrid";
import { useWishlist } from "@/hooks/useWishlist";
import { useProducts } from "@/hooks/useProducts";
import { useBestSellers } from "@/hooks/useBestSellers";
import { normalizeProduct } from "@/utils/productHelpers";
import { ROUTES } from "@/constants/routes";

export default function Wishlist() {
  const { ids, toggle } = useWishlist();
  const { data: result, isLoading, isError, refetch } = useProducts();
  const { data: bestSellers = [] } = useBestSellers();

  const wishlistProducts = useMemo(() => {
    const all = [...(result?.data ?? []), ...bestSellers].map(normalizeProduct);
    const unique = new Map(all.map((p) => [String(p.id), p]));
    return ids.map((id) => unique.get(String(id))).filter(Boolean);
  }, [result, bestSellers, ids]);

  return (
    <div className="bg-canvas">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <h1 className="font-heading text-3xl font-semibold text-display sm:text-4xl">
          My Wishlist
        </h1>
        <p className="mt-2 font-body text-muted">
          {ids.length} {ids.length === 1 ? "item" : "items"} saved
        </p>

        {!isLoading && wishlistProducts.length === 0 ? (
          <div className="mt-12 flex flex-col items-center gap-4 py-12 text-center">
            <p className="font-body text-muted">Your wishlist is empty.</p>
            <Link
              to={ROUTES.PRODUCTS}
              className="rounded-full bg-pill px-6 py-2 text-inverse transition hover:bg-terracotta"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8">
            <ProductGrid
              products={wishlistProducts}
              isLoading={isLoading}
              isError={isError}
              onRetry={() => refetch()}
              hasActiveFilters={false}
              onClearFilters={() => {}}
              wishlistIds={new Set(ids)}
              onToggleWishlist={toggle}
            />
          </div>
        )}
      </div>
    </div>
  );
}