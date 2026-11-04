import { useCallback, useMemo, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Pagination from "@/components/common/Pagination";
import ProductFilters, { FilterDrawer } from "@/components/product/ProductFilters";
import ProductGrid from "@/components/product/ProductGrid";
import ProductToolbar from "@/components/product/ProductToolbar";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { useBestSellers } from "@/hooks/useBestSellers";
import { useWishlist } from "@/hooks/useWishlist";
import { ROUTES } from "@/constants/routes";
import { formatPrice, normalizeProduct } from "@/utils/productHelpers";
import { cn } from "@/utils/cn";

const PAGE_SIZE = 12;
const NEW_ARRIVAL_DAYS = 30;

const SORTS = {
  newest: { label: "Newest", fn: (a, b) => b.createdAt - a.createdAt },
  "price-asc": {
    label: "Price: Low to High",
    fn: (a, b) => (a.price ?? Infinity) - (b.price ?? Infinity),
  },
  "price-desc": {
    label: "Price: High to Low",
    fn: (a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity),
  },
  discount: { label: "Biggest discount", fn: (a, b) => (b.discount ?? 0) - (a.discount ?? 0) },
  rating: { label: "Customer rating", fn: (a, b) => (b.rating ?? 0) - (a.rating ?? 0) },
};

const TAGS = {
  "new-arrivals": { title: "New Arrivals", description: "Fresh styles, just landed." },
  trending: { title: "Trending Products", description: "What everyone is loving right now." },
  sale: { title: "Sale Products", description: "Great styles at even better prices." },
};

const toNumber = (v) => {
  if (v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

export default function Products() {
  const [params, setParams] = useSearchParams();
  const { slug: routeSlug } = useParams(); // works if /category/:slug renders this page
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isBestSellers = pathname === ROUTES.BEST_SELLERS;
  const showBrands = params.get("view") === "brands";
  const tag = params.get("tag") ?? "";
  const tagInfo = TAGS[tag] ?? null;
  const [filtersOpen, setFiltersOpen] = useState(false);
  const closeFilters = useCallback(() => setFiltersOpen(false), []);

  const {
    data: result,
    isLoading: productsLoading,
    isError,
    refetch,
  } = useProducts();
  const { data: bestSellerData } = useBestSellers();
  const { data: categories = [] } = useCategories();
  const { ids, toggle: onToggleWishlist } = useWishlist();
  const wishlistIds = useMemo(() => new Set(ids), [ids]);

  const isLoading = isBestSellers ? false : productsLoading;
  const rawProducts = isBestSellers ? bestSellerData ?? [] : result?.data ?? [];
  const products = useMemo(() => rawProducts.map(normalizeProduct), [rawProducts]);

  /* ---- URL state ---- */
  const categorySlug = routeSlug ?? params.get("category") ?? "";
  const brand = params.get("brand") ?? "";
  const min = toNumber(params.get("min"));
  const max = toNumber(params.get("max"));
  const stock = ["in", "out"].includes(params.get("stock")) ? params.get("stock") : "";
  const discount = toNumber(params.get("discount"));
  const rating = toNumber(params.get("rating"));
  const pageParam = Math.max(1, Math.floor(toNumber(params.get("page")) ?? 1));

  const hasRating = useMemo(() => products.some((p) => p.rating), [products]);
  const showDiscount = useMemo(() => products.some((p) => p.discount), [products]);

  const sortParam = params.get("sort");
  const sort =
    SORTS[sortParam] && (sortParam !== "rating" || hasRating) ? sortParam : "newest";
  const sortOptions = Object.entries(SORTS)
    .filter(([value]) => value !== "rating" || hasRating)
    .map(([value, { label }]) => ({ value, label }));

  const updateParams = (patch, { keepPage = false } = {}) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") next.delete(key);
      else next.set(key, String(value));
    });
    if (!keepPage) next.delete("page");
    setParams(next, { replace: true });
  };

  const selectCategory = (slug) => {
    if (routeSlug) {
      navigate(slug ? `${ROUTES.PRODUCTS}?category=${slug}` : ROUTES.PRODUCTS);
    } else {
      updateParams({ category: slug || null });
    }
  };

  const applyPrice = (lo, hi) => {
    if (lo !== null && hi !== null && lo > hi) [lo, hi] = [hi, lo];
    updateParams({ min: lo, max: hi });
  };

  const clearAll = () => {
    if (routeSlug) {
      navigate(ROUTES.PRODUCTS);
      return;
    }
    const next = new URLSearchParams();
    if (params.get("sort")) next.set("sort", params.get("sort"));
    if (showBrands) next.set("view", "brands");
    if (tag) next.set("tag", tag);
    setParams(next, { replace: true });
  };

  /* ---- derived data ---- */
  const bounds = useMemo(() => {
    const prices = products.map((p) => p.price).filter((n) => n !== null);
    if (!prices.length) return null;
    return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
  }, [products]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      if (p.categorySlug) counts[p.categorySlug] = (counts[p.categorySlug] ?? 0) + 1;
    });
    return counts;
  }, [products]);

  const brandList = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      if (p.brand) counts[p.brand] = (counts[p.brand] ?? 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [products]);

  const results = useMemo(() => {
    const cutoff = Date.now() - NEW_ARRIVAL_DAYS * 24 * 60 * 60 * 1000;

    const filtered = products.filter((p) => {
      if (categorySlug && p.categorySlug !== categorySlug) return false;
      if (brand && p.brand !== brand) return false;
      if (tag === "sale" && !p.discount) return false;
      if (tag === "new-arrivals" && p.createdAt < cutoff) return false;
      if (min !== null && (p.price ?? 0) < min) return false;
      if (max !== null && (p.price ?? 0) > max) return false;
      if (stock === "in" && !p.inStock) return false;
      if (stock === "out" && p.inStock) return false;
      if (discount && (p.discount ?? 0) < discount) return false;
      if (rating && (p.rating ?? 0) < rating) return false;
      return true;
    });

    // Best sellers dummy data has no createdAt, so keep its own order by default
    if (isBestSellers && sort === "newest") return filtered;

    // Default ordering for tag pages (when user hasn't picked a sort)
    if (!sortParam) {
      if (tag === "sale") return filtered.sort(SORTS.discount.fn);
      if (tag === "trending") {
        return filtered.sort(
          (a, b) => (b.rating ?? 0) - (a.rating ?? 0) || b.createdAt - a.createdAt
        );
      }
    }

    return filtered.sort(SORTS[sort].fn);
  }, [
    products,
    categorySlug,
    brand,
    tag,
    min,
    max,
    stock,
    discount,
    rating,
    sort,
    sortParam,
    isBestSellers,
  ]);

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const page = Math.min(pageParam, totalPages); // never an invalid page
  const pageItems = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const categoryName = categorySlug
    ? categories.find((c) => c.slug === categorySlug)?.name ?? null
    : null;

  /* ---- active filter chips ---- */
  const chips = [];
  if (categorySlug) {
    chips.push({
      key: "category",
      label: categoryName ?? categorySlug,
      onRemove: () => selectCategory(""),
    });
  }
  if (brand) {
    chips.push({
      key: "brand",
      label: brand,
      onRemove: () => updateParams({ brand: null }),
    });
  }
  if (min !== null || max !== null) {
    const label =
      min !== null && max !== null
        ? `${formatPrice(min)} – ${formatPrice(max)}`
        : min !== null
          ? `From ${formatPrice(min)}`
          : `Up to ${formatPrice(max)}`;
    chips.push({ key: "price", label, onRemove: () => updateParams({ min: null, max: null }) });
  }
  if (stock) {
    chips.push({
      key: "stock",
      label: stock === "in" ? "In stock" : "Out of stock",
      onRemove: () => updateParams({ stock: null }),
    });
  }
  if (discount) {
    chips.push({
      key: "discount",
      label: `${discount}% off or more`,
      onRemove: () => updateParams({ discount: null }),
    });
  }
  if (rating) {
    chips.push({
      key: "rating",
      label: `${rating} stars & up`,
      onRemove: () => updateParams({ rating: null }),
    });
  }

  const goToPage = (next) => {
    updateParams({ page: next === 1 ? null : next }, { keepPage: true });
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document
      .getElementById("product-results")
      ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  const filterProps = {
    categories,
    categoryCounts,
    totalCount: products.length,
    categorySlug,
    onSelectCategory: selectCategory,
    price: { min, max },
    bounds,
    onPrice: applyPrice,
    stock,
    onStock: (v) => updateParams({ stock: v || null }),
    discount,
    onDiscount: (v) => updateParams({ discount: v }),
    showDiscount,
    rating,
    onRating: (v) => updateParams({ rating: v }),
    showRating: hasRating,
    activeCount: chips.length,
    onClear: clearAll,
  };

  const pill =
    "shrink-0 rounded-full border px-4 py-2 font-body text-sm transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta motion-reduce:transition-none";

  const pageTitle = isBestSellers
    ? "Best Sellers"
    : showBrands
      ? "Shop by Brand"
      : tagInfo?.title ?? categoryName ?? "Discover Your Style";

  const breadcrumbLabel = isBestSellers
    ? "Best Sellers"
    : showBrands
      ? "Shop by Brand"
      : tagInfo?.title ?? "Products";

  const pageDescription = isBestSellers
    ? "Our most loved products, picked by customers like you."
    : showBrands
      ? "Pick a brand to see its products."
      : tagInfo?.description ?? "Explore our latest collections, crafted for every occasion.";

  return (
    <div className="bg-canvas">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <header>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 font-body text-sm text-muted">
              <li>
                <Link to={ROUTES.HOME} className="hover:text-terracotta">
                  Home
                </Link>
              </li>
              <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
              <li>
                <Link to={ROUTES.PRODUCTS} className="hover:text-terracotta">
                  Shop
                </Link>
              </li>
              <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
              <li>
                {categoryName ? (
                  <Link to={ROUTES.PRODUCTS} className="hover:text-terracotta">
                    Products
                  </Link>
                ) : (
                  <span aria-current="page" className="text-display">
                    {breadcrumbLabel}
                  </span>
                )}
              </li>
              {categoryName && (
                <>
                  <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
                  <li aria-current="page" className="text-display">
                    {categoryName}
                  </li>
                </>
              )}
            </ol>
          </nav>

          <h1 className="mt-4 font-heading text-3xl font-semibold text-display sm:text-4xl">
            {pageTitle}
          </h1>
          <p className="mt-2 max-w-xl font-body text-muted">
            {pageDescription}
            {!isLoading && !isError && ` ${results.length} products available.`}
          </p>
        </header>

        {/* Brand quick navigation (only on ?view=brands) */}
        {showBrands && brandList.length > 0 && (
          <nav aria-label="Brands" className="mt-6">
            <ul className="flex flex-wrap gap-2">
              <li>
                <button
                  type="button"
                  onClick={() => updateParams({ brand: null })}
                  aria-current={!brand ? "true" : undefined}
                  className={cn(
                    pill,
                    !brand
                      ? "border-terracotta bg-cream text-terracotta"
                      : "border-line-card bg-card text-display hover:border-terracotta hover:text-terracotta"
                  )}
                >
                  All Brands
                </button>
              </li>
              {brandList.map((b) => (
                <li key={b.name}>
                  <button
                    type="button"
                    onClick={() => updateParams({ brand: brand === b.name ? null : b.name })}
                    aria-current={brand === b.name ? "true" : undefined}
                    className={cn(
                      pill,
                      brand === b.name
                        ? "border-terracotta bg-cream text-terracotta"
                        : "border-line-card bg-card text-display hover:border-terracotta hover:text-terracotta"
                    )}
                  >
                    {b.name} ({b.count})
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Category quick navigation */}
        {categories.length > 0 && (
          <nav aria-label="Product categories" className="mt-6">
            <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <li>
                <button
                  type="button"
                  onClick={() => selectCategory("")}
                  aria-current={!categorySlug ? "true" : undefined}
                  className={cn(
                    pill,
                    !categorySlug
                      ? "border-terracotta bg-cream text-terracotta"
                      : "border-line-card bg-card text-display hover:border-terracotta hover:text-terracotta"
                  )}
                >
                  All Products
                </button>
              </li>
              {categories.map((c) => (
                <li key={c.id ?? c.slug}>
                  <button
                    type="button"
                    onClick={() => selectCategory(c.slug)}
                    aria-current={categorySlug === c.slug ? "true" : undefined}
                    className={cn(
                      pill,
                      categorySlug === c.slug
                        ? "border-terracotta bg-cream text-terracotta"
                        : "border-line-card bg-card text-display hover:border-terracotta hover:text-terracotta"
                    )}
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Sidebar + results */}
        <div className="mt-8 lg:grid lg:grid-cols-[16rem_1fr] lg:gap-10">
          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1">
              <ProductFilters {...filterProps} />
            </div>
          </aside>

          <section id="product-results" aria-label="Products" className="scroll-mt-24 space-y-6">
            <ProductToolbar
              resultCount={results.length}
              sort={sort}
              sortOptions={sortOptions}
              onSort={(v) => updateParams({ sort: v === "newest" ? null : v })}
              onOpenFilters={() => setFiltersOpen(true)}
              activeCount={chips.length}
              chips={chips}
              onClear={clearAll}
            />

            <ProductGrid
              products={pageItems}
              isLoading={isLoading}
              isError={isBestSellers ? false : isError}
              onRetry={() => refetch()}
              hasActiveFilters={chips.length > 0}
              onClearFilters={clearAll}
              wishlistIds={wishlistIds}
              onToggleWishlist={onToggleWishlist}
            />

            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={goToPage}
              className="pt-4"
            />
          </section>
        </div>
      </div>

      <FilterDrawer open={filtersOpen} onClose={closeFilters} resultCount={results.length}>
        <ProductFilters {...filterProps} />
      </FilterDrawer>
    </div>
  );
}