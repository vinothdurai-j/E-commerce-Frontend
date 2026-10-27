import { memo, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";

/* ------------------------------------------------------------------ *
 * Config
 * ------------------------------------------------------------------ */
const SPEED_PX_PER_SEC = 36; // moderate, luxury-store pace. Raise to go faster.
const MIN_ITEMS_PER_GROUP = 8; // each looped group must be wider than the viewport
const TOUCH_RESUME_DELAY = 2500; // ms to wait after a swipe before auto-scroll resumes

/* ------------------------------------------------------------------ *
 * Adapters: change these to match your API shape / utilities
 * ------------------------------------------------------------------ */
const defaultFormatPrice = (n) => `$${Number(n).toFixed(2)}`; // swap for your formatter
const defaultGetProductPath = (p) => `${ROUTES.PRODUCTS}/${p.slug ?? p.id}`; // match your route

function normalizeProduct(p) {
  const image =
    p.images?.[0]?.url ?? p.images?.[0] ?? p.image ?? p.thumbnail ?? null;
  const price = Number(p.price ?? p.salePrice ?? p.discountPrice);
  const original = Number(p.originalPrice ?? p.mrp ?? p.compareAtPrice);
  const rating = Number(p.ratings?.average ?? p.averageRating ?? p.rating);
  const hasDiscount = original > price && price > 0;

  return {
    id: String(p._id ?? p.id),
    slug: p.slug,
    name: p.name ?? p.title ?? "Product",
    category: p.category?.name ?? p.category ?? "",
    image,
    price: Number.isFinite(price) ? price : null,
    original: hasDiscount ? original : null,
    discount: hasDiscount ? Math.round((1 - price / original) * 100) : null,
    rating: rating > 0 ? rating : null, // never show a fake rating
  };
}

/* ------------------------------------------------------------------ *
 * Auto-scroll hook (rAF driven so touch swipe + hover pause both work)
 * ------------------------------------------------------------------ */
function useInfiniteAutoScroll({ viewportRef, thumbRef, enabled, itemCount }) {
  const pause = useRef({ hover: false, touch: false, focus: false });
  const touchTimer = useRef(null);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el || !enabled || itemCount === 0) return;

    let raf;
    let last = performance.now();
    let pos = el.scrollLeft;

    const tick = (now) => {
      const dt = Math.min(now - last, 64);
      last = now;
      const half = el.scrollWidth / 2;
      const p = pause.current;
      const paused = p.hover || p.touch || p.focus;

      if (half > 0) {
        if (!paused) {
          pos += (SPEED_PX_PER_SEC * dt) / 1000;
          if (pos >= half) pos -= half;
          el.scrollLeft = pos;
        } else {
          // user is in control: keep in sync, allow swiping backwards at the start
          if (el.scrollLeft < 2) el.scrollLeft += half;
          pos = el.scrollLeft;
        }
        if (thumbRef.current) {
          const ratio = ((el.scrollLeft % half) + half) % half / half;
          thumbRef.current.style.left = `${ratio * 84}%`;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(touchTimer.current);
    };
  }, [viewportRef, thumbRef, enabled, itemCount]);

  return {
    onPointerEnter: (e) => {
      if (e.pointerType === "mouse") pause.current.hover = true;
    },
    onPointerLeave: (e) => {
      if (e.pointerType === "mouse") pause.current.hover = false;
    },
    onTouchStart: () => {
      clearTimeout(touchTimer.current);
      pause.current.touch = true;
    },
    onTouchEnd: () => {
      touchTimer.current = setTimeout(() => {
        pause.current.touch = false;
      }, TOUCH_RESUME_DELAY);
    },
    onFocus: () => {
      pause.current.focus = true;
    },
    onBlur: () => {
      pause.current.focus = false;
    },
  };
}

/* ------------------------------------------------------------------ *
 * Card
 * ------------------------------------------------------------------ */
const ProductCard = memo(function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  formatPrice,
  getProductPath,
  decorative,
}) {
  const tab = decorative ? -1 : undefined;

  return (
    <article className="group relative">
      {/* image */}
      <div className="relative aspect-[9/10] overflow-hidden rounded-3xl bg-[#f6f6f6]">
        {product.image && (
          <img
            src={product.image}
            alt={decorative ? "" : product.name}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="absolute inset-0 h-full w-full object-contain p-6 transition-transform duration-[350ms] ease-out group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        )}

        <span className="absolute left-3 top-3 z-10 rounded-md bg-red-600 px-2.5 py-1 font-body text-xs font-medium text-white">
          Hot
        </span>

        <button
          type="button"
          tabIndex={tab}
          aria-pressed={isWishlisted}
          aria-label={
            isWishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          onClick={() => onToggleWishlist(product.id)}
          className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-white text-clay transition-transform duration-300 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta motion-reduce:transition-none"
        >
          <Heart
            aria-hidden="true"
            className={cn(
              "h-[18px] w-[18px] transition-colors duration-300",
              isWishlisted && "fill-red-500 text-red-500"
            )}
          />
        </button>
      </div>

      {/* info */}
      <div className="mt-4 min-h-[5.75rem]">
        <p className="truncate font-body text-sm text-muted">
          {product.category || "\u00A0"}
        </p>

        <div className="mt-1 flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 font-body text-base font-medium text-display sm:text-lg">
            {/* stretched link covers the whole card; wishlist button sits above it */}
            <Link
              to={getProductPath(product)}
              tabIndex={tab}
              className="after:absolute after:inset-0 after:z-10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta"
            >
              {product.name}
            </Link>
          </h3>

          {product.rating && (
            <span className="flex shrink-0 items-center gap-1 font-body text-sm text-display">
              <Star
                aria-hidden="true"
                className="h-4 w-4 fill-amber-400 text-amber-400"
              />
              <span className="sr-only">Rated </span>
              {product.rating.toFixed(1)}
            </span>
          )}
        </div>

        {product.price !== null && (
          <p className="mt-1 flex flex-wrap items-baseline gap-x-2 font-body text-sm sm:text-base">
            <span className="text-clay">{formatPrice(product.price)}</span>
            {product.original && (
              <>
                <s className="text-clay/80">{formatPrice(product.original)}</s>
                <span className="text-red-600">-{product.discount}%</span>
              </>
            )}
          </p>
        )}
      </div>
    </article>
  );
});

/* ------------------------------------------------------------------ *
 * Section
 * ------------------------------------------------------------------ */
function Skeleton() {
  return (
    <div className="-mx-2.5 flex overflow-hidden" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="w-[56%] shrink-0 px-2.5 sm:w-1/3 lg:w-1/4">
          <div className="aspect-[9/10] animate-pulse rounded-3xl bg-[#f6f6f6]" />
          <div className="mt-4 h-4 w-1/3 animate-pulse rounded bg-[#f6f6f6]" />
          <div className="mt-2 h-5 w-2/3 animate-pulse rounded bg-[#f6f6f6]" />
        </div>
      ))}
    </div>
  );
}

/**
 * Props
 *  - products:        raw product array from your API
 *  - isLoading:       boolean
 *  - wishlistIds:     Set<string> (or array) of wishlisted product ids
 *  - onToggleWishlist(productId)  -> call your existing wishlist mutation
 *  - formatPrice(n)   -> optional, pass your existing formatter
 *  - getProductPath(product) -> optional, pass your existing route builder
 */
export default function BestSellers({
  products = [],
  isLoading = false,
  wishlistIds,
  onToggleWishlist,
  formatPrice = defaultFormatPrice,
  getProductPath = defaultGetProductPath,
  className,
}) {
  const viewportRef = useRef(null);
  const thumbRef = useRef(null);

  const items = useMemo(() => products.map(normalizeProduct), [products]);

  // Repeat the list until one group is wider than the viewport, then render two groups.
  const group = useMemo(() => {
    if (items.length === 0) return [];
    const reps = Math.max(1, Math.ceil(MIN_ITEMS_PER_GROUP / items.length));
    return Array.from({ length: reps }, (_, r) =>
      items.map((p) => ({ product: p, key: `${p.id}-${r}` }))
    ).flat();
  }, [items]);

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const wishlistSet = useMemo(() => new Set(wishlistIds ?? []), [wishlistIds]);

  const handlers = useInfiniteAutoScroll({
    viewportRef,
    thumbRef,
    enabled: !reduceMotion,
    itemCount: group.length,
  });

  if (!isLoading && items.length === 0) return null;

  const renderGroup = (decorative) => (
    <ul
      className="flex shrink-0"
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : "Best selling products"}
    >
      {group.map(({ product, key }) => (
        <li
          key={`${decorative ? "b" : "a"}-${key}`}
          className="w-[56cqw] shrink-0 px-2.5 sm:w-[33.3333cqw] lg:w-[25cqw]"
        >
          <ProductCard
            product={product}
            isWishlisted={wishlistSet.has(product.id)}
            onToggleWishlist={onToggleWishlist}
            formatPrice={formatPrice}
            getProductPath={getProductPath}
            decorative={decorative}
          />
        </li>
      ))}
    </ul>
  );

  return (
    <section
      aria-labelledby="best-sellers-heading"
      className={cn("w-full bg-white py-12 sm:py-16", className)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2
          id="best-sellers-heading"
          className="text-center font-heading text-3xl font-semibold text-display sm:text-4xl"
        >
          Best Sellers
        </h2>

        <div className="mt-8 sm:mt-10">
          {isLoading ? (
            <Skeleton />
          ) : (
            <>
              {/* @container gives cqw units, so card widths follow the viewport width */}
              <div
                ref={viewportRef}
                {...handlers}
                className={cn(
                  "@container -mx-2.5 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                  reduceMotion && "snap-x snap-mandatory"
                )}
              >
                <div className="flex w-max">
                  {renderGroup(false)}
                  {/* second group makes the loop seamless; hidden from AT and tab order */}
                  {!reduceMotion && renderGroup(true)}
                </div>
              </div>

              {/* progress line, like the reference */}
              {!reduceMotion && (
                <div
                  aria-hidden="true"
                  className="relative mt-6 h-0.5 w-full bg-black/5"
                >
                  <div
                    ref={thumbRef}
                    className="absolute top-0 h-full w-[16%] bg-clay"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}