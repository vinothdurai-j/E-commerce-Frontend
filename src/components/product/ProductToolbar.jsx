import { useId } from "react";
import { SlidersHorizontal, X } from "lucide-react";

export default function ProductToolbar({
  resultCount,
  sort,
  sortOptions,
  onSort,
  onOpenFilters,
  activeCount,
  chips,
  onClear,
}) {
  const selectId = useId();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p aria-live="polite" className="font-body text-sm text-muted">
          <span className="font-medium text-display">{resultCount}</span>{" "}
          {resultCount === 1 ? "product" : "products"}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenFilters}
            className="inline-flex items-center gap-2 rounded-full border border-line-card bg-card px-4 py-2 font-body text-sm text-display transition-colors duration-300 hover:border-terracotta hover:text-terracotta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta motion-reduce:transition-none lg:hidden"
          >
            <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
            Filters
            {activeCount > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-terracotta px-1 text-xs text-white">
                {activeCount}
              </span>
            )}
          </button>

          <label htmlFor={selectId} className="sr-only">
            Sort products
          </label>
          <select
            id={selectId}
            value={sort}
            onChange={(e) => onSort(e.target.value)}
            className="rounded-full border border-line-card bg-card px-4 py-2 font-body text-sm text-display focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {chips.length > 0 && (
        <ul className="flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <li key={chip.key}>
              <button
                type="button"
                onClick={chip.onRemove}
                aria-label={`Remove filter: ${chip.label}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-terracotta bg-cream px-3 py-1 font-body text-sm text-terracotta transition-colors duration-300 hover:bg-cream-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta motion-reduce:transition-none"
              >
                {chip.label}
                <X aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={onClear}
              className="font-body text-sm text-muted underline-offset-4 hover:text-terracotta hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            >
              Clear all
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}