import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import Button from "@/components/common/Button";
import { formatPrice } from "@/utils/productHelpers";
import { cn } from "@/utils/cn";

const DISCOUNT_OPTIONS = [10, 20, 30, 50];
const RATING_OPTIONS = [4, 3];

function Group({ title, children }) {
  return (
    <fieldset className="border-b border-line py-5 first:pt-0 last:border-b-0">
      <legend className="mb-3 p-0 font-heading text-base font-semibold text-display">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function Option({ name, checked, onSelect, count, children }) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center justify-between gap-3 py-1.5 font-body text-sm transition-colors duration-300 motion-reduce:transition-none",
        checked ? "text-terracotta" : "text-display hover:text-terracotta"
      )}
    >
      <span className="flex items-center gap-3">
        <input
          type="radio"
          name={name}
          checked={checked}
          onChange={onSelect}
          className="h-4 w-4 accent-terracotta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
        />
        {children}
      </span>
      {count !== undefined && <span className="text-muted">{count}</span>}
    </label>
  );
}

function PriceRange({ min, max, bounds, onApply }) {
  const id = useId();
  const [draft, setDraft] = useState({ min: min ?? "", max: max ?? "" });

  const commit = () => {
    const lo = draft.min === "" ? null : Number(draft.min);
    const hi = draft.max === "" ? null : Number(draft.max);
    if (lo === min && hi === max) return;
    onApply(lo, hi);
  };
  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commit();
    }
  };
  const field =
    "w-full rounded-xl border border-line-card bg-card px-3 py-2 font-body text-sm text-display placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-terracotta";

  return (
    <div>
      <div className="flex items-center gap-2">
        <label htmlFor={`${id}-min`} className="sr-only">
          Minimum price
        </label>
        <input
          id={`${id}-min`}
          type="number"
          inputMode="numeric"
          min={0}
          placeholder={bounds ? String(bounds.min) : "Min"}
          value={draft.min}
          onChange={(e) => setDraft((d) => ({ ...d, min: e.target.value }))}
          onBlur={commit}
          onKeyDown={onKeyDown}
          className={field}
        />
        <span aria-hidden="true" className="text-muted">
          –
        </span>
        <label htmlFor={`${id}-max`} className="sr-only">
          Maximum price
        </label>
        <input
          id={`${id}-max`}
          type="number"
          inputMode="numeric"
          min={0}
          placeholder={bounds ? String(bounds.max) : "Max"}
          value={draft.max}
          onChange={(e) => setDraft((d) => ({ ...d, max: e.target.value }))}
          onBlur={commit}
          onKeyDown={onKeyDown}
          className={field}
        />
      </div>
      {bounds && (
        <p className="mt-2 font-body text-xs text-muted">
          {formatPrice(bounds.min)} – {formatPrice(bounds.max)}
        </p>
      )}
    </div>
  );
}

export default function ProductFilters({
  categories,
  categoryCounts,
  totalCount,
  categorySlug,
  onSelectCategory,
  price,
  bounds,
  onPrice,
  stock,
  onStock,
  discount,
  onDiscount,
  showDiscount,
  rating,
  onRating,
  showRating,
  activeCount,
  onClear,
}) {
  const uid = useId();

  return (
    <div>
      <div className="flex items-center justify-between pb-4">
        <h2 className="font-heading text-lg font-semibold text-display">Filters</h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="font-body text-sm text-terracotta underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
          >
            Clear all
          </button>
        )}
      </div>

      <Group title="Category">
        <Option
          name={`${uid}-category`}
          checked={!categorySlug}
          onSelect={() => onSelectCategory("")}
          count={totalCount}
        >
          All products
        </Option>
        {categories.map((c) => (
          <Option
            key={c.id ?? c.slug}
            name={`${uid}-category`}
            checked={categorySlug === c.slug}
            onSelect={() => onSelectCategory(c.slug)}
            count={categoryCounts[c.slug] ?? 0}
          >
            {c.name}
          </Option>
        ))}
      </Group>

      <Group title="Price">
        <PriceRange
          key={`${price.min}-${price.max}`}
          min={price.min}
          max={price.max}
          bounds={bounds}
          onApply={onPrice}
        />
      </Group>

      <Group title="Availability">
        <Option name={`${uid}-stock`} checked={!stock} onSelect={() => onStock("")}>
          All
        </Option>
        <Option name={`${uid}-stock`} checked={stock === "in"} onSelect={() => onStock("in")}>
          In stock
        </Option>
        <Option name={`${uid}-stock`} checked={stock === "out"} onSelect={() => onStock("out")}>
          Out of stock
        </Option>
      </Group>

      {showDiscount && (
        <Group title="Discount">
          <Option name={`${uid}-discount`} checked={!discount} onSelect={() => onDiscount(null)}>
            Any
          </Option>
          {DISCOUNT_OPTIONS.map((d) => (
            <Option
              key={d}
              name={`${uid}-discount`}
              checked={discount === d}
              onSelect={() => onDiscount(d)}
            >
              {d}% or more
            </Option>
          ))}
        </Group>
      )}

      {showRating && (
        <Group title="Rating">
          <Option name={`${uid}-rating`} checked={!rating} onSelect={() => onRating(null)}>
            Any
          </Option>
          {RATING_OPTIONS.map((r) => (
            <Option
              key={r}
              name={`${uid}-rating`}
              checked={rating === r}
              onSelect={() => onRating(r)}
            >
              {r} stars &amp; up
            </Option>
          ))}
        </Group>
      )}
    </div>
  );
}

/* Mobile drawer. `onClose` must be a stable callback (useCallback) in the parent. */
export function FilterDrawer({ open, onClose, resultCount, children }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-50 transition-[visibility] duration-300 lg:hidden",
        open ? "visible" : "invisible"
      )}
    >
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-black/40 transition-opacity duration-300 motion-reduce:transition-none",
          open ? "opacity-100" : "opacity-0"
        )}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Product filters"
        tabIndex={-1}
        className={cn(
          "absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col bg-card outline-none",
          "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-end border-b border-line px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="grid h-9 w-9 place-items-center rounded-full text-display transition-colors hover:bg-cream-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        <div className="border-t border-line p-4 [&>button]:w-full">
          <Button onClick={onClose}>
            Show {resultCount} {resultCount === 1 ? "product" : "products"}
          </Button>
        </div>
      </div>
    </div>
  );
}