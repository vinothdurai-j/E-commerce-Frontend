import { useEffect, useRef, useState } from "react";
import { Quote, Star } from "lucide-react";
import { cn } from "@/utils/cn";

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/*
 * PLACEHOLDER CONTENT: replace names, locations and quotes with real customer
 * reviews before going live. No avatar images are used: initials are generated
 * from the name, so there are no asset paths to break.
 */
const TESTIMONIALS = [
  {
    id: "t1",
    name: "Ananya R.",
    location: "Chennai",
    rating: 5,
    quote:
      "The fabric feels premium and the fit is exactly as shown. I have already worn my order three times.",
  },
  {
    id: "t2",
    name: "Karthik S.",
    location: "Coimbatore",
    rating: 5,
    quote:
      "Fast delivery and beautiful packaging. The quality is easily better than what I expected for the price.",
  },
  {
    id: "t3",
    name: "Meera P.",
    location: "Bengaluru",
    rating: 4,
    quote:
      "Ordered for my kids and everything washed well. Simple styles that actually last, and easy returns.",
  },
];

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

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
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

function Stars({ rating }) {
  return (
    <div
      role="img"
      aria-label={`Rated ${rating} out of 5`}
      className="flex items-center gap-1"
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          aria-hidden="true"
          className={cn(
            "h-4 w-4",
            n <= rating ? "fill-terracotta text-terracotta" : "fill-transparent text-sand"
          )}
        />
      ))}
    </div>
  );
}

export default function Testimonials({
  testimonials = TESTIMONIALS,
  className,
}) {
  const [gridRef, visible] = useRevealOnce();

  return (
    <section
      aria-labelledby="testimonials-heading"
      className={cn("w-full overflow-hidden bg-stage py-12 font-body sm:py-16 lg:py-20", className)}
    >
      <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-10">
        <div className="text-center">
          <p className="font-body text-xs font-medium uppercase tracking-[0.3em] text-terracotta">
            Testimonials
          </p>
          <h2
            id="testimonials-heading"
            className="mt-3 font-heading text-3xl text-display sm:text-4xl lg:text-5xl"
          >
            What Our Customers Say
          </h2>
          <p className="mx-auto mt-3 max-w-md font-body text-base text-muted">
            Real words from people who wear SHILOH every day.
          </p>
        </div>

        {/* mobile: swipeable row. md+: three columns */}
        <ul
          ref={gridRef}
          className={cn(
            "mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:mt-12",
            "md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:pb-0 lg:gap-8",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          )}
        >
          {testimonials.map((t, i) => (
            <li
              key={t.id}
              style={{ transitionDelay: `${i * 100}ms` }}
              className={cn(
                "min-w-[85%] snap-center sm:min-w-[60%] md:min-w-0",
                "transition-[opacity,translate] duration-500",
                EASE,
                visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                "motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none"
              )}
            >
              <figure className="flex h-full flex-col rounded-3xl border border-line-card bg-card p-6 shadow-soft sm:p-8">
                <Quote
                  aria-hidden="true"
                  className="h-8 w-8 text-sand"
                />

                <div className="mt-4">
                  <Stars rating={t.rating} />
                </div>

                <blockquote className="mt-4 flex-1 font-body text-base leading-relaxed text-body">
                  {t.quote}
                </blockquote>

                <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream font-heading text-base text-display"
                  >
                    {getInitials(t.name)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-heading text-base text-display">
                      {t.name}
                    </span>
                    <span className="block truncate font-body text-sm text-muted">
                      {t.location}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}