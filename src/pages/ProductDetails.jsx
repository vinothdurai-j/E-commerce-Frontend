import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ChevronRight, Heart, Minus, PackageSearch, Plus, Star, TriangleAlert } from "lucide-react";
import Button from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import ImageGallery from "@/components/product/ImageGallery";
import { useProduct } from "@/hooks/useProducts";
import { useAddToCart } from "@/hooks/useCart";
import useAuth from "@/hooks/useAuth";
import useWishlist from "@/hooks/useWishlist";
import { ROUTES } from "@/constants/routes";
import { formatPrice, normalizeProduct } from "@/utils/productHelpers";
import { notify } from "@/utils/toast";
import { cn } from "@/utils/cn";

const MAX_PER_ITEM = 10; // backend rule

function DetailsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-12 sm:px-6 motion-reduce:animate-none">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-[9/10] rounded-3xl bg-cream" />
        <div className="space-y-4">
          <div className="h-4 w-1/4 rounded bg-cream" />
          <div className="h-9 w-2/3 rounded bg-cream" />
          <div className="h-6 w-1/3 rounded bg-cream" />
          <div className="h-24 w-full rounded bg-cream" />
        </div>
      </div>
    </div>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: raw, isLoading, isError, refetch } = useProduct(id); // product direct
  const addToCart = useAddToCart();
  const { isAuthenticated, user } = useAuth();
  const { has, toggle } = useWishlist();

  const [qty, setQty] = useState(1);

  if (isLoading) return <DetailsSkeleton />;

  if (isError) {
    const notFound = false;
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <EmptyState
          icon={TriangleAlert}
          title="We couldn’t load this product"
          description="It may have been removed, or there was a connection problem."
          action={
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => refetch()}>Try again</Button>
              <Link to={ROUTES.PRODUCTS}>
                <Button variant="outline">Back to shop</Button>
              </Link>
            </div>
          }
        />
      </div>
    );
  }

  if (!raw || raw.status === "inactive") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <EmptyState
          icon={PackageSearch}
          title="Product not available"
          action={
            <Link to={ROUTES.PRODUCTS}>
              <Button variant="outline">Back to shop</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const product = normalizeProduct(raw);
  const productId = product.id;
  const stock = Number(raw.stock) || 0;
  const inStock = stock > 0;
  const maxQty = Math.min(MAX_PER_ITEM, stock);
  const wishlisted = has(productId);

  const requireCustomer = () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { state: { from: location } });
      return false;
    }
    if (user?.role !== "user") {
      notify.error("Please log in with a customer account to shop.");
      return false;
    }
    return true;
  };

  const handleAdd = () => {
    if (!requireCustomer()) return;
    addToCart.mutate({ productId, quantity: qty });
  };

  // Buy now = cart-la add panni checkout-ku. Cart-la vera items irundha avaiyum checkout-la irukkum.
  const handleBuyNow = () => {
    if (!requireCustomer()) return;
    addToCart.mutate(
      { productId, quantity: qty },
      { onSuccess: () => navigate(ROUTES.CHECKOUT) }
    );
  };

  const busy = addToCart.isPending;

  return (
    <div className="bg-canvas">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 font-body text-sm text-muted">
            <li><Link to={ROUTES.HOME} className="hover:text-terracotta">Home</Link></li>
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
            <li><Link to={ROUTES.PRODUCTS} className="hover:text-terracotta">Shop</Link></li>
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
            <li aria-current="page" className="max-w-[50vw] truncate text-display">{product.name}</li>
          </ol>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* key: product maarina gallery reset aaganum */}
          <ImageGallery key={productId} images={raw.images ?? []} name={product.name} />

          <div>
            {product.category && (
              <p className="font-body text-sm text-muted">{product.category}</p>
            )}
            <h1 className="mt-1 font-heading text-3xl font-semibold text-display sm:text-4xl">
              {product.name}
            </h1>

            {product.rating && (
              <p className="mt-3 flex items-center gap-1.5 font-body text-sm text-display">
                <Star aria-hidden="true" className="h-4 w-4 fill-amber-400 text-amber-400" />
                {product.rating.toFixed(1)}
                <span className="text-muted">
                  ({raw.reviewCount} {raw.reviewCount === 1 ? "review" : "reviews"})
                </span>
              </p>
            )}

            <p className="mt-5 flex flex-wrap items-baseline gap-x-3 font-body">
              <span className="text-3xl text-display">{formatPrice(product.price)}</span>
              {product.original && (
                <>
                  <s className="text-lg text-clay/80">{formatPrice(product.original)}</s>
                  <span className="text-sm font-medium text-error">-{product.discount}%</span>
                </>
              )}
            </p>
            <p className="mt-1 font-body text-xs text-muted">Inclusive of all taxes</p>

            <p
              className={cn(
                "mt-4 font-body text-sm font-medium",
                !inStock ? "text-error" : stock <= 5 ? "text-warning" : "text-success"
              )}
            >
              {!inStock ? "Out of stock" : stock <= 5 ? `Only ${stock} left` : "In stock"}
            </p>

            {raw.description && (
              <p className="mt-6 whitespace-pre-line font-body leading-relaxed text-muted">
                {raw.description}
              </p>
            )}

            {inStock && (
              <div className="mt-8 flex items-center gap-4">
                <span className="font-body text-sm font-medium text-display">Quantity</span>
                <div className="flex items-center rounded-full border border-line-card bg-card">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                    className="grid h-10 w-10 place-items-center text-display disabled:opacity-40"
                  >
                    <Minus aria-hidden="true" className="h-4 w-4" />
                  </button>
                  <span aria-live="polite" className="w-8 text-center font-body text-sm">{qty}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                    disabled={qty >= maxQty}
                    className="grid h-10 w-10 place-items-center text-display disabled:opacity-40"
                  >
                    <Plus aria-hidden="true" className="h-4 w-4" />
                  </button>
                </div>
                {qty >= maxQty && (
                  <span className="font-body text-xs text-muted">Max {maxQty} per order</span>
                )}
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                disabled={!inStock || busy}
                onClick={handleAdd}
                className="min-w-40 px-8 py-3 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? "Adding..." : "Add to cart"}
              </Button>
              <Button
                variant="outline"
                disabled={!inStock || busy}
                onClick={handleBuyNow}
                className="min-w-40 px-8 py-3 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Buy now
              </Button>
              <button
                type="button"
                aria-pressed={wishlisted}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                onClick={() => toggle(productId)}
                className="grid h-12 w-12 place-items-center rounded-full border border-line-card bg-card transition-colors hover:border-terracotta"
              >
                <Heart
                  aria-hidden="true"
                  className={cn("h-5 w-5", wishlisted ? "fill-red-500 text-red-500" : "text-clay")}
                />
              </button>
            </div>

            {!inStock && (
              <p className="mt-3 font-body text-sm text-muted">
                This product is currently unavailable.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}