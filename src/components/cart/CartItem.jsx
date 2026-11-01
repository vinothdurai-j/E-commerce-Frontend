import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/utils/productHelpers";
import { cn } from "@/utils/cn";

const MAX_PER_ITEM = 10;

const getImage = (images) => {
  const first = images?.[0];
  return typeof first === "string" ? first : first?.url ?? null;
};

export default function CartItem({ item, onUpdate, onRemove, busy }) {
  const { product, quantity, price, subtotal, available } = item;
  const productId = product._id;
  const image = getImage(product.images);
  const maxQty = Math.min(MAX_PER_ITEM, product.stock ?? MAX_PER_ITEM);
  const hasDiscount = product.price > price;

  return (
    <li className="flex gap-4 rounded-2xl border border-line-card bg-card p-4 sm:gap-6">
      <Link
        to={`/products/${productId}`}
        className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-cream sm:h-28 sm:w-28"
      >
        {image ? (
          <img src={image} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center text-xs text-muted">No image</div>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to={`/products/${productId}`}
              className="line-clamp-2 font-body text-sm font-medium text-display hover:text-terracotta sm:text-base"
            >
              {product.name}
            </Link>
            <p className="mt-1 flex items-baseline gap-2 font-body text-sm">
              <span className="text-display">{formatPrice(price)}</span>
              {hasDiscount && <s className="text-xs text-clay/80">{formatPrice(product.price)}</s>}
            </p>
            {!available && (
              <p className="mt-1 font-body text-xs text-error">Currently unavailable</p>
            )}
          </div>

          <button
            type="button"
            aria-label={`Remove ${product.name}`}
            onClick={() => onRemove(productId)}
            disabled={busy}
            className="rounded-full p-2 text-muted transition-colors hover:text-error disabled:opacity-40"
          >
            <Trash2 aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center rounded-full border border-line-card bg-canvas">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => onUpdate({ productId, quantity: quantity - 1 })}
              disabled={busy || quantity <= 1}
              className="grid h-9 w-9 place-items-center text-display disabled:opacity-40"
            >
              <Minus aria-hidden="true" className="h-4 w-4" />
            </button>
            <span aria-live="polite" className="w-8 text-center font-body text-sm">{quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => onUpdate({ productId, quantity: quantity + 1 })}
              disabled={busy || quantity >= maxQty}
              className="grid h-9 w-9 place-items-center text-display disabled:opacity-40"
            >
              <Plus aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>

          <p className={cn("font-body text-base font-semibold text-display", !available && "opacity-50")}>
            {formatPrice(subtotal)}
          </p>
        </div>
      </div>
    </li>
  );
}