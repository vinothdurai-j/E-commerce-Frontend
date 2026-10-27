import { useEffect, useRef } from "react";
import { cn } from "@/utils/cn";

/**
 * Layered scroll transition:
 *  - `base` (your CategoryShowcase) pins to the viewport once its bottom is reached
 *  - `children` (the next section) scrolls up from below and slides over it
 *  - while that happens, `base` gently scales down and dims (driven by scroll position)
 *  - scrolling back up reverses everything, because it is all position-based
 *
 * No animation library: the pinning is native `position: sticky`; the only JS is one
 * passive scroll listener that writes a single CSS variable (--p, 0 → 1) with no
 * React re-renders.
 *
 * Props
 *  - base:       the pinned section (CategoryShowcase)
 *  - children:   the section that rises over it
 *  - stickyTop:  CSS length to pin under a fixed header, e.g. "0px" or "5rem"
 *  - scale/dim:  how much `base` recedes at the end of the transition (0 disables)
 */
export default function StickyOverlay({
  base,
  children,
  stickyTop = "0px",
  scale = 0.06,
  dim = 0.25,
  className,
}) {
  const rootRef = useRef(null);
  const baseRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const baseEl = baseRef.current;
    const overlay = overlayRef.current;
    if (!root || !baseEl || !overlay) return;

    // Mobile + reduced motion: plain natural scroll (CSS also disables sticky there).
    const desktop = window.matchMedia("(min-width: 768px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!desktop.matches || reduced.matches) return;

    // Height of the pinned section: used so a section taller than the screen
    // pins by its BOTTOM edge instead of cutting off its lower half.
    const ro = new ResizeObserver(([entry]) => {
      root.style.setProperty("--h", `${entry.target.offsetHeight}px`);
    });
    ro.observe(baseEl);

    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      const top = overlay.getBoundingClientRect().top;
      // 0 while the overlay is below the screen, 1 once it has reached the top
      const p = Math.min(1, Math.max(0, (vh - top) / vh));
      root.style.setProperty("--p", p.toFixed(3));
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
      } else {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    });
    io.observe(root);

    return () => {
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={cn("relative isolate", className)}
      style={{ "--p": 0, "--h": "100svh" }}
    >
      {/* pinned layer */}
      <div
        ref={baseRef}
        className="z-0 md:sticky motion-reduce:static"
        style={{ top: `min(${stickyTop}, calc(100svh - var(--h)))` }}
      >
        <div
          className="origin-top will-change-transform motion-reduce:!transform-none motion-reduce:!filter-none"
          style={{
            transform: `scale(calc(1 - var(--p) * ${scale}))`,
            filter: `brightness(calc(1 - var(--p) * ${dim}))`,
          }}
        >
          {base}
        </div>
      </div>

      {/* rising layer: opaque, at least as tall as the pinned one so it fully covers it */}
      <div
        ref={overlayRef}
        className="relative z-10 rounded-t-3xl bg-white shadow-[0_-24px_48px_-24px_rgba(0,0,0,0.18)] md:min-h-[var(--h)]"
      >
        {children}
      </div>
    </div>
  );
}