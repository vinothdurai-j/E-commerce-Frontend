const base = {
  viewBox: "0 0 64 64",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
};

/* Truck with FREE package */
export function FreeShippingIcon({ className }) {
  return (
    <svg {...base} className={className}>
      {/* package box */}
      <rect x="6" y="14" width="30" height="24" rx="2" />
      <text
        x="21"
        y="30"
        textAnchor="middle"
        fontSize="9"
        fontWeight="600"
        fill="currentColor"
        stroke="none"
        fontFamily="sans-serif"
      >
        FREE
      </text>
      {/* cab */}
      <path d="M36 22h12l8 9v10H36" />
      <path d="M42 26h5l4 5h-9z" />
      {/* base line */}
      <path d="M6 41h4M22 41h14M50 41h6" />
      {/* wheels */}
      <circle cx="16" cy="44" r="5" />
      <circle cx="16" cy="44" r="1.5" />
      <circle cx="47" cy="44" r="5" />
      <circle cx="47" cy="44" r="1.5" />
    </svg>
  );
}

/* Outlined stars + thumbs-up */
export function QualityIcon({ className }) {
  return (
    <svg {...base} className={className}>
      {/* stars */}
      <path d="M10 14l2 4 4.4.6-3.2 3 .8 4.4L10 24l-4 2 .8-4.4-3.2-3L8 18z" transform="translate(2 -4) scale(.9)" />
      <path d="M32 6l3.2 6.4 7 1-5.1 5 1.2 7L32 22l-6.3 3.4 1.2-7-5.1-5 7-1z" />
      <path d="M54 14l2 4 4.4.6-3.2 3 .8 4.4L54 24l-4 2 .8-4.4-3.2-3 4.4-.6z" transform="translate(-6 -4) scale(.9)" />
      {/* thumb */}
      <path d="M22 34h-8a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h8z" />
      <path d="M22 36l7-12c3 0 5 2 4.4 5L32 34h14a3 3 0 0 1 2.9 3.7l-3.2 13.5A4 4 0 0 1 41.800 54H22" />
      <path d="M26 42h14M26 48h12" />
    </svg>
  );
}

/* Hand holding shield with secure payment */
export function SecurePaymentIcon({ className }) {
  return (
    <svg {...base} className={className}>
      {/* shield */}
      <path d="M20 6l9 3v8c0 6-4 10-9 12-5-2-9-6-9-12V9z" />
      <path d="M16 17l3 3 5-6" />
      {/* coin / S */}
      <circle cx="42" cy="26" r="11" />
      <path d="M46 22c-1-1.500-3-2-5-1.500s-3 2-2 3.500 3 2 4 2.500 2 2 1 3.500-4 1.500-6 .5" />
      <path d="M42 17v2M42 33v2" />
      {/* hand */}
      <path d="M6 42h8v14H6z" />
      <path d="M14 46l8-2h9c2 0 3 1.500 2 3l-1 1.500M31 47l14-4c2-.5 4 1.500 3 3.500L38 56l-18 2-6-2" />
    </svg>
  );
}

/* Circular 24/7 with curved arrows */
export function SupportIcon({ className }) {
  return (
    <svg {...base} className={className}>
      <path d="M12 28a21 21 0 0 1 38-9" />
      <path d="M52 8v11H41" />
      <path d="M52 36a21 21 0 0 1-38 9" />
      <path d="M12 56V45h11" />
      <text
        x="32"
        y="37"
        textAnchor="middle"
        fontSize="17"
        fontWeight="400"
        fill="currentColor"
        stroke="none"
        fontFamily="sans-serif"
      >
        24/7
      </text>
    </svg>
  );
}