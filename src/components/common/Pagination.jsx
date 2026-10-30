import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

function getItems(page, total) {
  const set = new Set([1, total, page - 1, page, page + 1]);
  const pages = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const items = [];
  pages.forEach((n, i) => {
    if (i > 0 && n - pages[i - 1] > 1) items.push("gap");
    items.push(n);
  });
  return items;
}

const base =
  "grid h-10 min-w-10 place-items-center rounded-full border px-3 font-body text-sm transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta motion-reduce:transition-none";

export default function Pagination({ page, totalPages, onChange, className }) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex flex-wrap items-center justify-center gap-2", className)}
    >
      <button
        type="button"
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className={cn(base, "border-line-card bg-card text-display enabled:hover:border-terracotta enabled:hover:text-terracotta disabled:opacity-40")}
      >
        <ChevronLeft aria-hidden="true" className="h-4 w-4" />
      </button>

      {getItems(page, totalPages).map((item, i) =>
        item === "gap" ? (
          <span key={`gap-${i}`} aria-hidden="true" className="px-1 text-muted">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-label={`Page ${item}`}
            aria-current={item === page ? "page" : undefined}
            onClick={() => onChange(item)}
            className={cn(
              base,
              item === page
                ? "border-terracotta bg-cream text-terracotta"
                : "border-line-card bg-card text-display hover:border-terracotta hover:text-terracotta"
            )}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        aria-label="Next page"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className={cn(base, "border-line-card bg-card text-display enabled:hover:border-terracotta enabled:hover:text-terracotta disabled:opacity-40")}
      >
        <ChevronRight aria-hidden="true" className="h-4 w-4" />
      </button>
    </nav>
  );
}