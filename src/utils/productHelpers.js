const priceFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export const formatPrice = (n) => priceFormatter.format(Number(n) || 0);

/**
 * Backend schema: price = MRP, discountPrice = selling price (must be < price).
 * Rating is exposed only when real reviews exist.
 */
export function normalizeProduct(p) {
  const mrp = Number(p.price);
  const sale = Number(p.discountPrice);
  const hasDiscount =
    Number.isFinite(mrp) && Number.isFinite(sale) && sale > 0 && sale < mrp;
  const price = hasDiscount ? sale : mrp;
  const avg = Number(p.averageRating);

  return {
    id: String(p._id ?? p.id),
    name: p.name ?? "Product",
    category: p.category?.name ?? "",
    categorySlug: p.category?.slug ?? "",
    image: p.images?.[0] ?? null,
    price: Number.isFinite(price) ? price : null,
    original: hasDiscount ? mrp : null,
    discount: hasDiscount ? Math.round((1 - sale / mrp) * 100) : null,
    rating: avg > 0 && Number(p.reviewCount) > 0 ? avg : null,
    inStock: Number(p.stock) > 0,
    createdAt: p.createdAt ? new Date(p.createdAt).getTime() : 0,
  };
}