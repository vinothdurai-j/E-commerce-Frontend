import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import bannerImage from "@/assets/images/ft-sofa-2.png";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";

/*
 * Image: collection-banner.webp is a transparent cut-out, so it is anchored to
 * the bottom edge ("object-contain object-bottom") and sits on the banner's
 * gradient. To use a full photo that has its own background instead, change
 * IMAGE_FIT to "object-cover object-center" and remove the top inset on the
 * image wrapper.
 */
const IMAGE_FIT = "object-contain object-bottom";
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

// Fade/slide the content in once, the first time the banner scrolls into view.
function useRevealOnce() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

export default function CollectionBanner({ className }) {
  const [contentRef, visible] = useRevealOnce();

  // Each line of copy gets a slightly later start for a gentle stagger.
  const reveal = (delay, extraClasses) => ({
    className: cn(
      "transition-[opacity,translate] duration-500",
      EASE,
      visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
      "motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none",
      extraClasses
    ),
    style: { transitionDelay: `${delay}ms` },
  });

  return (
    <section
      aria-labelledby="collection-banner-heading"
      className={cn("bg-card pb-12 sm:pb-16", className)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-12">
        <div
          className={cn(
            "group grid overflow-hidden rounded-3xl md:grid-cols-[45fr_55fr]",
            "bg-linear-to-br from-cream via-cream-soft to-cream"
          )}
        >
          {/* image: bottom-anchored cut-out with headroom so the hover zoom never crops the head */}
          <div className="relative h-72 sm:h-80 md:h-auto md:min-h-[26rem]">
            <img
              src={bannerImage}
              alt="Model wearing a lavender top from the new season collection"
              width={989}
              height={960}
              loading="lazy"
              decoding="async"
              draggable={false}
              className={cn(
                "absolute inset-x-0 bottom-0 top-6 h-[calc(100%-1.5rem)] w-full origin-bottom",
                IMAGE_FIT,
                "transition-transform duration-[400ms]",
                EASE,
                "group-hover:scale-[1.04]",
                "motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              )}
            />
          </div>

          {/* copy */}
          <div
            ref={contentRef}
            className="flex flex-col items-center justify-center px-6 pb-12 pt-4 text-center sm:px-10 md:py-16 lg:px-16"
          >
            <p
              {...reveal(
                0,
                "font-body text-xs font-medium uppercase tracking-[0.3em] text-terracotta"
              )}
            >
              New Season Collection
            </p>

            <h2
              id="collection-banner-heading"
              {...reveal(
                80,
                "mt-4 font-heading text-3xl font-semibold leading-tight text-display sm:text-4xl lg:text-5xl"
              )}
            >
              Best ssMinimal Collection
            </h2>

            <p {...reveal(160, "mt-4 max-w-md text-base leading-relaxed text-body")}>
              Discover timeless essentials and contemporary styles designed for
              effortless everyday elegance.
            </p>

            <div {...reveal(240, "mt-8")}>
              <Link
                to={ROUTES.PRODUCTS}
                className={cn(
                  "group/cta inline-flex items-center gap-2 rounded-full bg-display px-9 py-3.5",
                  "font-body text-sm font-semibold uppercase tracking-[0.18em] text-inverse",
                  "transition-[background-color,box-shadow] duration-300",
                  "hover:bg-terracotta hover:shadow-soft",
                  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta",
                  "motion-reduce:transition-none"
                )}
              >
                Shop Now
                <ArrowRight
                  aria-hidden="true"
                  className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    "group-hover/cta:translate-x-1 group-focus-visible/cta:translate-x-1",
                    "motion-reduce:transition-none motion-reduce:group-hover/cta:translate-x-0"
                  )}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}