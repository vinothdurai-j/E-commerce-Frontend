import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";
/*
 * IMAGES: these three files already exist in your project (used by CategoryShowcase),
 * so the paths are safe. They are TEMPORARY stand-ins. For the best result, add
 * dedicated portrait images and swap the imports, e.g.:
 *   new-arrivals.png, trending.png, best-sellers.png  ->  src/assets/images/
 */
import newArrivalsImg from "../../assets/images/fs-womens.png";
import trendingImg from "../../assets/images/fs-mens.png";
import favoritesImg from "../../assets/images/fs-kids.png";

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/*
 * LINKS: `to` assumes your Products page can filter with ?collection=<slug>.
 * If your filter uses a different param (or ?category=), change it here only.
 */
const COLLECTIONS = [
  {
    slug: "new-arrivals",
    badge: "New",
    title: "Fresh Finds, New Styles",
    description: "Explore the latest additions to your wardrobe.",
    cta: "Shop Collection",
    image: newArrivalsImg,
    alt: "Model wearing new arrivals from the SHILOH collection",
    imagePosition: "object-top",
    to: `${ROUTES.PRODUCTS}?collection=new-arrivals`,
  },
  {
    slug: "trending-styles",
    badge: "Trending",
    title: "Styles That Stand Out",
    description: "Discover the looks everyone is loving.",
    cta: "Shop Collection",
    image: trendingImg,
    alt: "Model wearing trending styles from the SHILOH collection",
    imagePosition: "object-center",
    to: `${ROUTES.PRODUCTS}?collection=trending`,
  },
  {
    slug: "best-sellers",
    badge: "Best Seller",
    title: "Your Everyday Favorites",
    description: "Shop timeless picks worth wearing again.",
    cta: "Shop Collection",
    image: favoritesImg,
    alt: "Model wearing best-selling pieces from the SHILOH collection",
    imagePosition: "object-center",
    to: `${ROUTES.PRODUCTS}?collection=best-sellers`,
  },
];

export default function NewCollection({
  collections = COLLECTIONS,
  className,
}) {
  // the middle card starts as the featured (enlarged) one
  const [active, setActive] = useState(Math.floor(collections.length / 2));
  const [liked, setLiked] = useState({});

  const total = collections.length;
  const prev = () => setActive((i) => (i - 1 + total) % total);
  const next = () => setActive((i) => (i + 1) % total);
  const toggleLike = (slug) =>
    setLiked((state) => ({ ...state, [slug]: !state[slug] }));

  const arrowClass = cn(
    "absolute top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full",
    "border border-line-card bg-card text-display shadow-soft",
    "transition-colors duration-300 hover:bg-terracotta hover:text-inverse",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta",
    "motion-reduce:transition-none"
  );

  return (
    <section
      aria-labelledby="new-collection-heading"
      className={cn("w-full overflow-hidden bg-canvas py-12 font-body sm:py-16", className)}
    >
      <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-10">
        <div className="text-center">
          <p className="font-body text-xs font-medium uppercase tracking-[0.3em] text-muted">
            Curated for you
          </p>
          <h2
            id="new-collection-heading"
            className="mt-3 font-heading text-3xl text-display sm:text-4xl lg:text-5xl"
          >
            Our New Collection
          </h2>
          <p className="mx-auto mt-3 max-w-md font-body text-base text-muted">
            Explore the latest styles loved by our customers.
          </p>
        </div>

        <div className="relative mt-10 px-6 sm:mt-12 md:px-10">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous collection"
            className={cn(arrowClass, "left-0")}
          >
            <ChevronLeft aria-hidden="true" className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next collection"
            className={cn(arrowClass, "right-0")}
          >
            <ChevronRight aria-hidden="true" className="h-5 w-5" />
          </button>

          {/* mobile: only the active card is shown. md+: all three, active one enlarged */}
          <ul className="grid grid-cols-1 items-center gap-4 md:grid-cols-3 md:gap-5 md:py-8 lg:gap-8">
            {collections.map((c, i) => {
              const isActive = i === active;
              return (
                <li
                  key={c.slug}
                  className={cn("min-w-0", isActive ? "block" : "hidden md:block")}
                >
                  <article
                    className={cn(
                      "group relative rounded-3xl border border-line-card bg-card p-3",
                      "transition duration-500",
                      EASE,
                      isActive
                        ? "z-10 shadow-soft md:scale-[1.06] lg:scale-110"
                        : "md:hover:-translate-y-1 md:hover:shadow-soft",
                      "motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                    )}
                  >
                    {/* wishlist heart: visual toggle only, wire it to your wishlist later */}
                    <button
                      type="button"
                      onClick={() => toggleLike(c.slug)}
                      aria-pressed={!!liked[c.slug]}
                      aria-label={`Save ${c.title}`}
                      className="absolute right-5 top-5 z-20 flex h-8 w-8 items-center justify-center rounded-full text-display transition-colors duration-300 hover:text-terracotta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                    >
                      <Heart
                        aria-hidden="true"
                        className={cn(
                          "h-5 w-5",
                          liked[c.slug] && "fill-terracotta text-terracotta"
                        )}
                      />
                    </button>

                    <Link
                      to={c.to}
                      aria-label={`${c.cta}: ${c.title}`}
                      className="block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta"
                    >
                      {/* image: zoom lives on the img so the card layout never shifts */}
                      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-cream">
                        <span className="absolute left-3 top-3 z-10 rounded-full bg-sand/70 px-3 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-display">
                          {c.badge}
                        </span>
                        <img
                          src={c.image}
                          alt={c.alt}
                          loading="lazy"
                          decoding="async"
                          draggable={false}
                          className={cn(
                            "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105",
                            EASE,
                            c.imagePosition,
                            "motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                          )}
                        />
                      </div>

                      <div className="px-2 pb-2 pt-4">
                        <h3 className="font-heading text-lg leading-snug text-display lg:text-xl">
                          {c.title}
                        </h3>
                        <p className="mt-2 min-h-[2.5rem] font-body text-sm text-muted">
                          {c.description}
                        </p>

                        {/* visual button only: the card image + this are one link */}
                        <span
                          className={cn(
                            "mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-pill px-5 py-2.5",
                            "font-body text-xs font-semibold uppercase tracking-[0.14em] text-inverse",
                            "transition-colors duration-300 group-hover:bg-terracotta",
                            "motion-reduce:transition-none"
                          )}
                        >
                          {c.cta}
                          <ArrowRight
                            aria-hidden="true"
                            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                          />
                        </span>
                      </div>
                    </Link>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>

        {/* pagination dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {collections.map((c, i) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show ${c.title}`}
              aria-current={i === active}
              className={cn(
                "h-2.5 rounded-full transition-all duration-300",
                i === active ? "w-6 bg-pill" : "w-2.5 bg-sand hover:bg-clay",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta",
                "motion-reduce:transition-none"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}