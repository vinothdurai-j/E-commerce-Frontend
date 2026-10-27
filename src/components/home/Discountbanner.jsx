import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import discountImage from "@/assets/images/ft-purchase.png"; // <- save your reference image here (or change the path)
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";

const IMAGE_FIT = "object-contain object-bottom";
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

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

export default function DiscountBanner({
  discount = "30% OFF",
  title = "Fashionable women's wear",
  to = `${ROUTES.PRODUCTS}?category=women`,
  className,
}) {
  const [contentRef, visible] = useRevealOnce();

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
      aria-labelledby="discount-banner-heading"
      className={cn("w-full bg-card", className)}
    >
      {/* grey background like the reference: swap bg-gray-200 for your own token if you have one */}
      <div className="group grid w-full overflow-hidden bg-linear-to-br from-cream via-cream-soft to-cream md:grid-cols-[55fr_45fr]">
        {/* copy: left on desktop, below the image on mobile */}
        <div
          ref={contentRef}
          className="flex items-center justify-center px-6 pb-12 pt-4 text-center sm:px-10 md:order-1 md:py-16 lg:px-16"
        >
          <div>
            <h2
              id="discount-banner-heading"
              {...reveal(
                0,
                "font-heading text-5xl leading-tight text-display sm:text-6xl lg:text-7xl"
              )}
            >
              {discount}
            </h2>

            <p
              {...reveal(
                100,
                "mt-3 font-body text-lg text-body sm:text-xl lg:text-2xl"
              )}
            >
              {title}
            </p>

            <div {...reveal(200, "mt-8")}>
              <Link
                to={to}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full bg-pill px-8 py-3",
                  "font-body text-xs font-semibold uppercase tracking-[0.18em] text-inverse",
                  "transition-colors duration-300 hover:bg-terracotta focus-visible:bg-terracotta",
                  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta",
                  "motion-reduce:transition-none"
                )}
              >
                Shop Now
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* image: top on mobile, right side on desktop */}
        <div className="relative h-72 sm:h-80 md:order-2 md:h-auto md:min-h-[28rem] lg:min-h-[34rem]">
          <img
            src={discountImage}
            alt="Model wearing a green leather blazer from the women's collection"
            loading="lazy"
            decoding="async"
            draggable={false}
            className={cn(
              "absolute inset-x-0 bottom-0 top-6 h-[calc(100%-1.5rem)] w-full origin-bottom",
              IMAGE_FIT,
              "transition-transform duration-[400ms]",
              EASE,
              "motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            )}
          />
          
        </div>
      </div>
    </section>
  );
}