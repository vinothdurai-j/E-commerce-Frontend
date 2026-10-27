import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import bannerImage from "@/assets/images/fs-banner.png";
import { ROUTES } from "@/constants/routes";
import  Button  from "@/components/common/Button.jsx"; // <- adjust to your Button path
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

export default function CollectionBanner({ className }) {
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
      aria-labelledby="collection-banner-heading"
      className={cn("w-full bg-card", className)}
    >
      <div
        className={cn(
          "group grid w-full overflow-hidden md:grid-cols-[45fr_55fr]",
          "bg-linear-to-br from-cream via-cream-soft to-cream"
        )}
      >
        {/* image */}
        <div className="relative h-72 sm:h-80 md:h-auto md:min-h-[28rem] lg:min-h-[34rem]">
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
              "",
              "motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            )}
          />
        </div>
        

        {/* copy: same pattern as the hero */}
        <div
          ref={contentRef}
          className="flex items-center px-6 pb-12 pt-4 sm:px-10 md:py-16 lg:px-16"
        >
          <div>
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
                "mt-4 font-heading text-4xl leading-tight text-display sm:text-5xl lg:text-7xl"
              )}
            >
              Best Minimal
              <span className="mt-2 block text-3xl sm:text-4xl lg:text-6xl">
                Collection
              </span>
            </h2>

            <p {...reveal(160, "mt-4 max-w-xl font-body text-base text-body")}>
              Discover timeless essentials and contemporary styles designed for
              effortless everyday elegance.
            </p>

            <div {...reveal(240, "mt-8")}>
              <Link to={ROUTES.PRODUCTS} className="inline-block">
                <Button>Shop Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}