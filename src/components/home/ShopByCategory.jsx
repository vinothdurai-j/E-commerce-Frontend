import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/common/Button";
import { useCategories } from "@/hooks/useCategories";
import { categoryPath } from "@/constants/navigation";
import { cn } from "@/utils/cn";

/*
 * Layout maths (all in CSS, so cards and the arrow buttons stay in sync):
 *   --gutter   = side padding of the carousel (room for the arrows on sm+),
 *   --per-view = how many cards fit (fractional on small screens so the next
 *                card "peeks" and invites a swipe), --gap = space between them.
 *   card width = (track width - gaps) / per-view, image is aspect-square, so the
 *   image height equals the card width -> arrows are centred on that height.
 */
const CARD_WIDTH =
  "w-[calc((100%_-_(var(--per-view)_-_1)_*_var(--gap))_/_var(--per-view))]";
// padding-% is relative to the wrapper's full width, so remove both gutters first.
const ARROW_TOP_OFFSET =
  "pt-[calc((100%_-_2_*_var(--gutter)_-_(var(--per-view)_-_1)_*_var(--gap))_/_var(--per-view))]";

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/* ---------- carousel behaviour ---------- */
function useCarousel(itemCount) {
  const scrollerRef = useRef(null);
  const [edge, setEdge] = useState({ atStart: true, atEnd: true });

  // Keep prev/next availability in sync with scrolling and resizing.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let frame = 0;
    const measure = () => {
      const atStart = el.scrollLeft <= 1;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
      setEdge((prev) =>
        prev.atStart === atStart && prev.atEnd === atEnd ? prev : { atStart, atEnd }
      );
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    el.addEventListener("scroll", schedule, { passive: true });
    // ResizeObserver also fires once on observe(), which does the first measure.
    const observer = new ResizeObserver(schedule);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);

    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", schedule);
      observer.disconnect();
    };
  }, [itemCount]);

  // Scroll by whole cards: distance = real card width + real gap.
  const scrollByPage = useCallback((direction) => {
    const el = scrollerRef.current;
    const card = el?.querySelector("[data-category-card]");
    if (!el || !card) return;

    const track = card.parentElement;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = card.getBoundingClientRect().width + gap;
    const visible = Math.max(1, Math.floor((track.clientWidth + gap) / step + 0.01));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    el.scrollBy({
      left: direction * visible * step,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, []);

  // ArrowLeft / ArrowRight move focus between category links.
  const onKeyDown = useCallback((event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    const links = [...event.currentTarget.querySelectorAll("a")];
    const index = links.indexOf(document.activeElement);
    if (index === -1) return;
    const next = links[index + (event.key === "ArrowRight" ? 1 : -1)];
    if (next) {
      event.preventDefault();
      next.focus();
    }
  }, []);

  return { scrollerRef, edge, scrollByPage, onKeyDown };
}

/* ---------- pieces ---------- */
function NavButton({ direction, disabled, onClick }) {
  const isPrev = direction === "prev";
  const Icon = isPrev ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isPrev ? "Previous categories" : "Next categories"}
      className={cn(
        "pointer-events-auto absolute top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-line-card bg-card text-display shadow-soft sm:h-11 sm:w-11",
        "transition-[color,background-color,border-color,opacity] duration-300",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta",
        "enabled:hover:border-terracotta enabled:hover:bg-cream-soft enabled:hover:text-terracotta",
        "disabled:cursor-not-allowed disabled:opacity-40 max-sm:disabled:invisible",
        "[&_svg]:transition-transform [&_svg]:duration-300 motion-reduce:[&_svg]:transition-none",
        isPrev
          ? "-left-3 sm:left-0 sm:-translate-x-[calc(100%+0.25rem)] enabled:hover:[&_svg]:-translate-x-0.5"
          : "-right-3 sm:right-0 sm:translate-x-[calc(100%+0.25rem)] enabled:hover:[&_svg]:translate-x-0.5"
      )}
    >
      <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
    </button>
  );
}

function CategoryCard({ category }) {
  const { name, slug, image, fit } = category;
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = image && !imageFailed;

  return (
    <li data-category-card className={cn("flex-none snap-start", CARD_WIDTH)}>
      <Link
        to={categoryPath(slug)}
        className={cn(
          "group block rounded-3xl",
          "transition-transform duration-300 hover:-translate-y-1 focus-visible:-translate-y-1",
          EASE,
          "motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-visible:translate-y-0",
          // inset so the scroller's overflow can't clip the ring on the first/last card
          "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-terracotta"
        )}
      >
        <div
          className={cn(
            "aspect-square overflow-hidden rounded-3xl bg-cream-soft",
            "transition-[background-color,box-shadow] duration-300",
            EASE,
            "group-hover:bg-cream group-hover:shadow-[0_16px_24px_-16px_rgba(29,27,26,0.35)]",
            "group-focus-visible:bg-cream group-focus-visible:shadow-[0_16px_24px_-16px_rgba(29,27,26,0.35)]",
            "motion-reduce:transition-none"
          )}
        >
          {showImage ? (
            <img
              src={image}
              alt={`${name} collection`}
              width={520}
              height={520}
              loading="lazy"
              decoding="async"
              draggable={false}
              onError={() => setImageFailed(true)}
              className={cn(
                "h-full w-full transition-transform duration-[400ms]",
                EASE,
                "group-hover:scale-[1.06] group-focus-visible:scale-[1.06]",
                "motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100",
                fit === "cover" ? "object-cover" : "object-contain p-4 sm:p-5"
              )}
            />
          ) : (
            <span
              aria-hidden="true"
              className="grid h-full w-full place-items-center font-heading text-6xl text-clay"
            >
              {name.charAt(0)}
            </span>
          )}
        </div>

        <span
          className={cn(
            "mt-4 block text-center font-body text-base font-medium text-display sm:text-lg",
            "transition-colors duration-300 group-hover:text-terracotta group-focus-visible:text-terracotta"
          )}
        >
          {name}
        </span>
      </Link>
    </li>
  );
}

function CategorySkeleton() {
  return (
    <ul
      role="status"
      aria-label="Loading categories"
      className="flex gap-(--gap) overflow-hidden py-4"
    >
      {Array.from({ length: 5 }, (_, i) => (
        <li key={i} className={cn("flex-none animate-pulse", CARD_WIDTH)}>
          <div className="aspect-square rounded-3xl bg-cream" />
          <div className="mx-auto mt-4 h-5 w-2/3 rounded-full bg-cream" />
        </li>
      ))}
    </ul>
  );
}

function Message({ children, action }) {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center text-muted">
      <p>{children}</p>
      {action}
    </div>
  );
}

/* ---------- section ---------- */
export default function ShopByCategory({ className }) {
  const { data: categories = [], isLoading, isError, refetch } = useCategories();
  const { scrollerRef, edge, scrollByPage, onKeyDown } = useCarousel(categories.length);
  const canScroll = !(edge.atStart && edge.atEnd);

  let body;
  if (isLoading) {
    body = <CategorySkeleton />;
  } else if (isError) {
    body = (
      <Message
        action={
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        }
      >
        We couldn&rsquo;t load the categories right now.
      </Message>
    );
  } else if (categories.length === 0) {
    body = <Message>Categories will appear here soon.</Message>;
  } else {
    body = (
      <>
        <div
          ref={scrollerRef}
          onKeyDown={onKeyDown}
          className={cn(
            "snap-x snap-mandatory overflow-x-auto overscroll-x-contain py-4",
            "-mx-4 px-4 scroll-px-4 sm:mx-0 sm:px-0 sm:scroll-px-0",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          )}
        >
          <ul className="flex gap-(--gap)">
            {categories.map((category) => (
              <CategoryCard key={category.id ?? category.slug} category={category} />
            ))}
            {/* The edge-to-edge scroller on mobile doesn't keep its end padding in
                the scrollable area, so this spacer restores the right gutter. */}
            <li
              aria-hidden="true"
              className="w-[calc(var(--gutter)_-_var(--gap))] flex-none sm:hidden"
            />
          </ul>
        </div>

        {canScroll && (
          // Same width as the card track (wrapper minus its padding), so the
          // padding-top below equals one card width = image height.
          <div
            className={cn(
              "pointer-events-none absolute inset-x-(--gutter) top-4 h-0",
              ARROW_TOP_OFFSET
            )}
          >
            <NavButton
              direction="prev"
              disabled={edge.atStart}
              onClick={() => scrollByPage(-1)}
            />
            <NavButton
              direction="next"
              disabled={edge.atEnd}
              onClick={() => scrollByPage(1)}
            />
          </div>
        )}
      </>
    );
  }

  return (
    <section
      aria-labelledby="shop-by-category-heading"
      className={cn("bg-card py-12 sm:py-16", className)}
    >
      <h2
        id="shop-by-category-heading"
        className="px-4 text-center font-heading text-3xl font-semibold text-display sm:text-4xl"
      >
        Shop By Category
      </h2>

      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Shop by category"
        className={cn(
          "relative mx-auto mt-6 max-w-7xl px-(--gutter) sm:mt-8",
          "[--gutter:1rem] [--per-view:2.3] [--gap:0.75rem]",
          "sm:[--gutter:3rem] sm:[--per-view:3.3] sm:[--gap:1rem]",
          "md:[--per-view:3.5] md:[--gap:1.25rem]",
          "lg:[--per-view:5]",
          "xl:[--gap:1.5rem]"
        )}
      >
        {body}
      </div>
    </section>
  );
}
