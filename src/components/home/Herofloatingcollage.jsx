import { useId } from "react";
import { ShoppingBag, Sparkles } from "lucide-react";
import perfumeImg from "@/assets/images/ft-pefume.png";
import speakerImg from "@/assets/images/ft-speker.png";
import cameraImg from "@/assets/images/ft-gopro.png";
import sunglassImg from "@/assets/images/ft-sunglass.png"; // change to ft-sunglass.png to switch image
import jacketImg from "@/assets/images/ft-jackt.png";
import shopperImg from "@/assets/images/ft-purchase-4.png";
import sofaImg from "@/assets/images/ft-discount.png";

/*
 * Set false if the sunglass PNG is not REALLY transparent
 * (checkerboard must not be baked into the pixels).
 */
const SHOW_SUNGLASS = true;

/* Set false if ft-sofa.png is not a real transparent PNG. */
const SHOW_SOFA = true;

/*
 * All positions are in the coordinate space of Hero-1.png (1994 x 789).
 * The inner stage below reproduces `object-cover` exactly, so every item
 * stays pinned to the same spot of the hero photo at any screen size.
 */
const W = 1994;
const H = 789;
const px = (n) => `calc(var(--u) * ${n})`;

/* sofa + shopper cutouts share the same width and float effect */
const PHOTO_W = 200;
const PHOTO_ANIM = "animate-float-slow";

const SHADOW = "drop-shadow-[0_16px_18px_rgba(96,66,32,0.30)]";

function Spot({ x, y, rotate = 0, className = "", children }) {
  return (
    <div
      className={`absolute -translate-x-1/2 -translate-y-1/2 ${className}`}
      style={{
        left: `${(x / W) * 100}%`,
        top: `${(y / H) * 100}%`,
        rotate: `${rotate}deg`,
      }}
    >
      {children}
    </div>
  );
}

function Product({ src, x, y, w, rotate, anim, delay, className }) {
  return (
    <Spot x={x} y={y} rotate={rotate} className={className}>
      <img
        src={src}
        alt=""
        aria-hidden="true"
        decoding="async"
        draggable="false"
        className={`block h-auto max-w-none ${SHADOW} ${anim} motion-reduce:animate-none`}
        style={{ width: px(w), animationDelay: delay }}
      />
    </Spot>
  );
}

const badgeBase =
  "relative grid place-items-center rounded-full border border-[#e4d2b6] bg-[#fffaf1]/95 text-[#8a6a43] shadow-[0_10px_22px_-8px_rgba(110,80,40,0.38)]";

function Badge({ x, y, d, rotate, anim, delay, className, children }) {
  return (
    <Spot x={x} y={y} rotate={rotate} className={className}>
      <div
        className={`${badgeBase} ${anim} motion-reduce:animate-none`}
        style={{ width: px(d), height: px(d), animationDelay: delay }}
      >
        {children}
      </div>
    </Spot>
  );
}

function BrandBadge(props) {
  const id = useId();
  return (
    <Badge {...props}>
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 animate-spin-slow motion-reduce:animate-none"
        aria-hidden="true"
      >
        <defs>
          <path id={id} d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
        </defs>
        <text fontSize="10" letterSpacing="2" fill="currentColor">
          <textPath href={`#${id}`} textLength="228" lengthAdjust="spacing">
            SHILOH • PREMIUM • SHILOH • PREMIUM •
          </textPath>
        </text>
      </svg>
      <span
        className="font-heading leading-none text-[#6f4f2a]"
        style={{ fontSize: px(30) }}
      >
        S
      </span>
    </Badge>
  );
}

export default function HeroFloatingCollage() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 hidden animate-collage-in overflow-hidden motion-reduce:animate-none md:block"
      style={{ containerType: "size" }}
    >
      {/* stage = same box the cover-fitted Hero-1.png occupies */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "max(100cqw, calc(100cqh * 1994 / 789))",
          aspectRatio: "1994 / 789",
          "--u": "calc(max(100cqw, calc(100cqh * 1994 / 789)) / 1994)",
        }}
      >
        {/* concentric rings around the existing arch */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${W} ${H}`}
          fill="none"
        >
          <g stroke="#c8a176" strokeWidth="2">
            <circle cx="1466" cy="420" r="292" strokeOpacity="0.38" />
            <circle cx="1466" cy="420" r="348" strokeOpacity="0.26" />
            <circle
              cx="1466"
              cy="420"
              r="408"
              strokeOpacity="0.30"
              strokeDasharray="2 16"
              strokeLinecap="round"
              className="origin-center animate-spin-slow motion-reduce:animate-none [transform-box:fill-box]"
            />
            <circle cx="1466" cy="420" r="472" strokeOpacity="0.14" />
          </g>
        </svg>

        {/* speaker sits ON the podium (right of the watch pedestal); top row: jacket > gopro > sofa */}
        <Product
          src={speakerImg}
          x={1458}
          y={585}
          w={190}
          rotate={0}
          anim=""
          delay="0s"
          className="hidden lg:block"
        />
        <Product
          src={jacketImg}
          x={1450}
          y={95}
          w={200}
          rotate={-10}
          anim="animate-float-medium"
          delay="-1.5s"
          className="hidden lg:block"
        />
        <Product
          src={cameraImg}
          x={1230}
          y={92}
          w={185}
          rotate={6}
          anim="animate-float-slow"
          delay="-3s"
          className="hidden lg:block"
        />
        {SHOW_SOFA && (
          <Product
            src={sofaImg}
            x={1650}
            y={222}
            w={PHOTO_W}
            rotate={-4}
            anim={PHOTO_ANIM}
            delay="-4.5s"
            className="hidden xl:block"
          />
        )}

        {/* hero cutout beside the arch */}
        <Product
          src={perfumeImg}
          x={1130}
          y={288}
          w={300}
          rotate={-8}
          anim="animate-float-slow"
          delay="-2s"
        />
        <Product
          src={shopperImg}
          x={1272}
          y={365}
          w={PHOTO_W}
          rotate={4}
          anim={PHOTO_ANIM}
          delay="-6s"
          className="hidden xl:block"
        />

        {/* lower-left floor (free now that the camera moved up) */}
        {SHOW_SUNGLASS && (
          <Product
            src={sunglassImg}
            x={860}
            y={535}
            w={220}
            rotate={-8}
            anim="animate-float-medium"
            delay="-1s"
            className="hidden xl:block"
          />
        )}

        {/* badges */}
        <BrandBadge
          x={1360}
          y={240}
          d={96}
          rotate={0}
          anim="animate-badge-sway"
          delay="-1s"
        />
        <Badge
          x={1545}
          y={185}
          d={70}
          rotate={-10}
          anim="animate-badge-sway"
          delay="-2s"
          className="hidden lg:block"
        >
          <span
            className="font-semibold tracking-[0.14em] text-[#6f4f2a]"
            style={{ fontSize: px(16) }}
          >
            NEW
          </span>
        </Badge>
        <Badge
          x={1712}
          y={345}
          d={62}
          rotate={0}
          anim="animate-float-slow"
          delay="-5s"
          className="hidden lg:block"
        >
          <ShoppingBag style={{ width: px(27), height: px(27) }} strokeWidth={1.6} />
        </Badge>
        <Badge
          x={975}
          y={636}
          d={54}
          rotate={0}
          anim="animate-float-medium"
          delay="-3s"
          className="hidden xl:block"
        >
          <Sparkles style={{ width: px(24), height: px(24) }} strokeWidth={1.6} />
        </Badge>
      </div>
    </div>
  );
}