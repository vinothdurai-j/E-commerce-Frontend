import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { productPath } from "@/constants/routes";
import { formatPrice } from "@/utils/productHelpers";
import { cn } from "@/utils/cn";

const ProductCard = memo(function ProductCard({
  product,
  isWishlisted = false,
  onToggleWishlist,
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = product.image && !imageFailed;

  return (
    <article className="group relative">
      <div className="relative aspect-[9/10] overflow-hidden rounded-3xl bg-[#f6f6f6]">
        {showImage ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            draggable={false}
            onError={() => setImageFailed(true)}
            className={cn(
              "absolute inset-0 h-full w-full object-contain p-3 transition-transform duration-[350ms] ease-out sm:p-6",
              "group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100",
              !product.inStock && "opacity-60"
            )}
          />
        ) : (
          <span
            aria-hidden="true"
            className="absolute inset-0 grid place-items-center font-heading text-6xl text-clay"
          >
            {product.name.charAt(0)}
          </span>
        )}

        {!product.inStock && (
          <span className="absolute left-3 top-3 z-10 rounded-md bg-display px-2.5 py-1 font-body text-xs font-medium text-white">
            Sold out
          </span>
        )}

        {onToggleWishlist && (
          <button
            type="button"
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
        )}
      </div>

      <div className="mt-3 min-h-[5.25rem] sm:mt-4 sm:min-h-[5.75rem]">
        <p className="truncate font-body text-xs text-muted sm:text-sm">
          {product.category || "\u00A0"}
        </p>

        <div className="mt-1 flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 font-body text-sm font-medium text-display sm:text-lg">
            <Link
              to={productPath(product.id)}
              className="after:absolute after:inset-0 after:z-10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta"
            >
              {product.name}
            </Link>
          </h3>

          {product.rating && (
            <span className="flex shrink-0 items-center gap-1 font-body text-xs text-display sm:text-sm">
              <Star aria-hidden="true" className="h-3.5 w-3.5 fill-amber-400 text-amber-400 sm:h-4 sm:w-4" />
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

export default ProductCard;