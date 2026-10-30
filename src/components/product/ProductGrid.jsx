import { PackageSearch, TriangleAlert } from "lucide-react";
import Button from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import ProductCard from "@/components/product/ProductCard";

const GRID =
  "grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3";

function CardSkeleton() {
  return (
    <div className="animate-pulse motion-reduce:animate-none">
      <div className="aspect-[9/10] rounded-3xl bg-cream" />
      <div className="mt-4 h-3 w-1/3 rounded bg-cream" />
      <div className="mt-2 h-4 w-2/3 rounded bg-cream" />
      <div className="mt-2 h-4 w-1/2 rounded bg-cream" />
    </div>
  );
}

export default function ProductGrid({
  products,
  isLoading,
  isError,
  onRetry,
  hasActiveFilters,
  onClearFilters,
  wishlistIds,
  onToggleWishlist,
}) {
  if (isLoading) {
    return (
      <div className={GRID} role="status" aria-label="Loading products">
        {Array.from({ length: 6 }, (_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon={TriangleAlert}
        title="We couldn’t load the products"
        description="Please check your connection and try again."
        action={
          <Button variant="outline" onClick={onRetry}>
            Try again
          </Button>
        }
      />
    );
  }

  if (products.length === 0) {
    return hasActiveFilters ? (
      <EmptyState
        icon={PackageSearch}
        title="No products match your filters"
        description="Try removing a filter or widening your price range."
        action={
          <Button variant="outline" onClick={onClearFilters}>
            Clear filters
          </Button>
        }
      />
    ) : (
      <EmptyState
        icon={PackageSearch}
        title="No products yet"
        description="New arrivals will appear here soon."
      />
    );
  }

  return (
    <ul className={GRID}>
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard
            product={product}
            isWishlisted={wishlistIds.has(product.id)}
            onToggleWishlist={onToggleWishlist}
          />
        </li>
      ))}
    </ul>
  );
}