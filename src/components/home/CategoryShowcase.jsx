import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";
import menImg from "../../assets/images/fs-mens.png";
import womenImg from "../../assets/images/fs-womens.png";
import kidsImg from "../../assets/images/fs-kids.png";

/*
 * 1) IMAGES: imported with relative paths from src/assets/images.
 *
 * 2) LINKS: `to` assumes your Products page reads ?category=<slug>.
 *    Change it to match your real filter mechanism / route constants.
 *
 * 3) HEIGHTS: all three cards share CARD_HEIGHT.
 *    On md+ the height is 100svh minus a fixed amount (header + heading + label + button),
 *    clamped between a min and max.
 *    - Taller cards: lower the rem value (10rem -> 8rem) and raise the max px.
 *    - Shorter cards: do the opposite.
 *    Keep at least ~8rem so the "Shop Now" button stays above the fold.
 *
 * 4) PARALLAX: `speed` = how far the photo drifts inside its frame while
 *    scrolling, as a fraction (0 to 1) of the available travel. 1 = full travel.
 */
const OVERSHOOT = 0.1; // image layer is 10% taller than its frame (extra sits at the BOTTOM)

const CARD_HEIGHT =
  "h-[34rem] sm:h-[38rem] md:h-[clamp(420px,calc(100svh_-_10rem),640px)] lg:h-[clamp(560px,calc(100svh_-_10rem),860px)]";

const CATEGORIES = [
  {
    slug: "men",
    label: "Men",
    image: menImg,
    alt: "Model wearing menswear from the SHILOH men's collection",
    to: `${ROUTES.PRODUCTS}?category=men`,
    offset: "md:mt-8",
    height: CARD_HEIGHT,
    position: "object-center",
    speed: 0.6,
  },
  {
    slug: "women",
    label: "Women",
    image: womenImg,
    alt: "Model wearing womenswear from the SHILOH women's collection",
    to: `${ROUTES.PRODUCTS}?category=women`,
    offset: "md:mt-0",
    height: CARD_HEIGHT,
    position: "object-top",
    speed: 1,
  },
  {
    slug: "kids",
    label: "Kids",
    image: kidsImg,
    alt: "Child wearing kidswear from the SHILOH kids' collection",
    to: `${ROUTES.PRODUCTS}?category=kids`,
    offset: "md:mt-14",
    height: CARD_HEIGHT,
    position: "object-center",
    speed: 0.35,
  },
];

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/*
 * Scroll parallax. Each image layer drifts vertically at its own speed.
 * Runs only while the section is on screen, writes transforms directly to the
 * DOM (no React state, no re-renders), and is skipped for reduced motion.
 */
function useParallax(sectionRef, layerRefs, speeds) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;

    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      layerRefs.current.forEach((layer, i) => {
        if (!layer) return;
        const frame = layer.parentElement.getBoundingClientRect();
        // 0 when the frame enters at the bottom of the screen .. 1 when it leaves at the top
        const t = Math.min(1, Math.max(0, (vh - frame.top) / (vh + frame.height)));
        // the photo starts top-aligned (heads visible) and drifts UP, revealing more of its lower part
        const y = -t * speeds[i] * OVERSHOOT * frame.height;
        layer.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
      });
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
      } else {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    });
    observer.observe(section);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export default function CategoryShowcase({
  categories = CATEGORIES,
  className,
}) {
  const sectionRef = useRef(null);
  const layerRefs = useRef([]);

  useParallax(
    sectionRef,
    layerRefs,
    categories.map((c) => c.speed ?? 0.1)
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="category-showcase-heading"
      className={cn("w-full overflow-hidden bg-card py-12 font-body sm:py-16", className)}
    >
      <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-10">
        <div className="text-center">
          <h2
            id="category-showcase-heading"
            className="font-heading text-3xl text-display sm:text-4xl"
          >
            Shop Your Style
          </h2>
          <p className="mx-auto mt-3 max-w-md font-body text-base text-muted">
            Discover collections designed for every style.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-8 sm:mt-12 md:grid-cols-3 md:items-start md:gap-5 lg:gap-8">
          {categories.map((c, i) => (
            <li key={c.slug} className={cn("min-w-0", c.offset)}>
              <Link
                to={c.to}
                aria-label={`Shop ${c.label}`}
                className="group block rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta"
              >
                {/* frame: clips the image, never moves */}
                <div
                  className={cn(
                    "relative overflow-hidden rounded-3xl border border-line-card bg-cream transition-shadow duration-500 group-hover:shadow-soft",
                    c.height
                  )}
                >
                  {/* parallax layer: taller than the frame, moved by scroll */}
                  <div
                    ref={(el) => (layerRefs.current[i] = el)}
                    className="absolute inset-x-0 top-0 h-[110%] will-change-transform"
                  >
                    {/* hover zoom lives on the img so it never fights the parallax transform */}
                    <img
                      src={c.image}
                      alt={c.alt}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      className={cn(
                        "h-full w-full object-cover transition-transform duration-500",
                        EASE,
                        c.position,
                        "motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      )}
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-col items-center gap-3 text-center">
                  <h3 className="font-heading text-xl text-display">
                    {c.label}
                  </h3>
                  {/* visual button only: the whole card is the single link */}
                  <span
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full bg-pill px-7 py-2.5",
                      "font-body text-xs font-semibold uppercase tracking-[0.18em] text-inverse",
                      "transition-colors duration-300 group-hover:bg-terracotta group-focus-visible:bg-terracotta",
                      "motion-reduce:transition-none"
                    )}
                  >
                    Shop Now
                    <ArrowRight
                      aria-hidden="true"
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                    />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}