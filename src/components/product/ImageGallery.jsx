import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

const SWIPE_MIN = 40; // px

export default function ImageGallery({ images = [], name = "Product" }) {
  const list = images.filter(Boolean);
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState({});
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 });
  const touchStart = useRef(null);

  const count = list.length;
  const go = (i) => setIndex((i + count) % count);

  const onKeyDown = (e) => {
    if (count < 2) return;
    if (e.key === "ArrowRight") go(index + 1);
    if (e.key === "ArrowLeft") go(index - 1);
  };

  const onTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStart.current === null || count < 2) return;
    const diff = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(diff) > SWIPE_MIN) go(diff < 0 ? index + 1 : index - 1);
    touchStart.current = null;
  };

  const onMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoom({
      on: true,
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  if (count === 0) {
    return (
      <div className="grid aspect-[9/10] place-items-center rounded-3xl bg-[#f6f6f6] font-heading text-7xl text-clay">
        {name.charAt(0)}
      </div>
    );
  }

  const current = list[index];
  const currentFailed = failed[current];

  return (
    <div className="space-y-3" onKeyDown={onKeyDown}>
      <div
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label={`${name} images`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseMove={onMouseMove}
        onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}
        className="relative aspect-[9/10] overflow-hidden rounded-3xl bg-[#f6f6f6] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta md:cursor-zoom-in"
      >
        {currentFailed ? (
          <span className="absolute inset-0 grid place-items-center font-heading text-7xl text-clay">
            {name.charAt(0)}
          </span>
        ) : (
          <img
            src={current}
            alt={`${name} - image ${index + 1} of ${count}`}
            draggable={false}
            onError={() => setFailed((f) => ({ ...f, [current]: true }))}
            style={{
              transformOrigin: `${zoom.x}% ${zoom.y}%`,
              transform: zoom.on ? "scale(1.8)" : "scale(1)",
            }}
            className="absolute inset-0 h-full w-full object-contain p-4 transition-transform duration-200 ease-out motion-reduce:transition-none sm:p-8 max-md:!transform-none"
          />
        )}

        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => go(index - 1)}
              className="absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-display shadow-soft transition-colors hover:text-terracotta"
            >
              <ChevronLeft aria-hidden="true" className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => go(index + 1)}
              className="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-display shadow-soft transition-colors hover:text-terracotta"
            >
              <ChevronRight aria-hidden="true" className="h-5 w-5" />
            </button>
            <span
              aria-live="polite"
              className="absolute bottom-3 right-3 rounded-full bg-display/70 px-3 py-1 font-body text-xs text-inverse"
            >
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {count > 1 && (
        <ul className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {list.map((src, i) => (
            <li key={src} className="shrink-0">
              <button
                type="button"
                aria-label={`Show image ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-20 w-16 overflow-hidden rounded-xl border-2 bg-[#f6f6f6] transition-colors sm:h-24 sm:w-20",
                  i === index ? "border-terracotta" : "border-transparent hover:border-sand"
                )}
              >
                {failed[src] ? (
                  <span className="grid h-full w-full place-items-center font-heading text-xl text-clay">
                    {name.charAt(0)}
                  </span>
                ) : (
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    draggable={false}
                    onError={() => setFailed((f) => ({ ...f, [src]: true }))}
                    className="h-full w-full object-contain p-1"
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}